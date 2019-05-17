import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Chart } from 'chart.js';
import { LogLevel, LoggerService } from 'src/app/services/logger.service';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { Person, PersonRole } from 'src/app/competences/models/person';
import { SkillsSheet, SkillGraduated, SkillsSheetVersions } from 'src/app/competences/models/skillsSheet';
import { Diploma } from '../../../models/diploma';
import { SkillsService } from 'src/app/competences/services/skills.service';
import { ArrayObsService } from 'src/app/competences/services/arrayObs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Skills } from 'src/app/competences/models/skills';
import { SubMenusService } from 'src/app/services/subMenus.service';
import { SubMenu } from 'src/app/header/models/menu';
import { PersonSkillsService } from 'src/app/competences/services/personSkills.service';
import { MatTableDataSource } from '@angular/material';
import { PageSkillsHomeComponent } from '../../accueil/page-skills-home/page-skills-home.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SkillsListService } from '../../../services/skillsList.service';
import { DiplomasService } from '../../../services/diplomas.service';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss'],
  providers: [ArrayObsService]
})
/**
* Component containing the skillsSheet creation form.
* @param skillsSheetService service handling back-end communication and data
*/
export class SkillsFormComponent implements OnInit, OnDestroy {

  versionsArray = new MatTableDataSource();
  lastModifDisplayedColumns: string[] = ['manager', 'date'];

  // Information of tech skills
  skillsArray: any[] = [];
  skillsDisplayedColumns: string[] = ['skillName', 'grade'];
  skillsArrayDataSource = new MatTableDataSource<SkillGraduated[]>();

  // Information of soft skills
  softSkillsArray: any[] = [];
  softSkillsDisplayedColumns: string[] = ['skillName', 'grade'];
  softSkillsArrayDataSource = new MatTableDataSource<SkillGraduated[]>();

  headerRowHiddenModif = false;

  // Form displayed
  formItems: any[];

  //Tableau contenant toutes les options (diplômes) pour l'auto-complétion
  options: string[];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();

  //Charts
  skillsChart = Chart;
  softSkillsChart = Chart;

  currentPerson: Person;
  currentSkillsSheet: SkillsSheet;
  newSkillsSheet: PageSkillsHomeComponent;

  // MODIF DETECTION
  countSkillsUpdate = 0;
  countSoftSkillsUpdate = 0;
  modifDetection = false;

  // information contains in the path
  name: string;
  version: number;

  //Initialisation vars
  avis: string;
  comment: string = "";
  isEditButtonHidden: boolean = false;
  isPersonDataDisabled: boolean = true;
  isSkillsSheetNameEditable: boolean = false;

  // subscription
  submenusSubscription;
  skillsSubscription;

  // Name of the skillsSheet
  nameSkillsSheet: string;

  constructor(private skillsService: SkillsService,
    private skillsSheetService: SkillsSheetService,
    private personSkillsService: PersonSkillsService,
    private router: Router,
    private route: ActivatedRoute,
    private subMenusService: SubMenusService,
    private skillsListService: SkillsListService,
    private diplomasService: DiplomasService) {
    window.addEventListener('beforeunload', () => {
      if (this.modifDetection) {
        this.onSubmitForm();
      }
    });
  }

  /***********************************************************************\
   *
   *                              NG FUNCTIONS
   *
  \***********************************************************************/

  /**
   * Init : - check if a skillsObservable is present then inits current data (Person and Skills) else redirects to skills home
   *        - init form items of a Person (different inputs whether it's an applicant or a consultant)
   *        - init both charts of skills and soft skills
   */
  ngOnInit() {
    this.getDiplomas();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      map(value => this._filter(value))
    );
    this.route.params.subscribe(param => {
      // Get param in the url
      this.name = param['name'];
      this.version = + param['version'];
      console.log(this.currentPerson);
      console.log(this.currentSkillsSheet);
      // Check if data already exists, person is more important than skillsSheet
      if (window.sessionStorage.getItem('person') !== null) {
        this.currentPerson = JSON.parse(window.sessionStorage.getItem('person')) as Person;
        if (window.sessionStorage.getItem('skills') !== null) {
          if (window.sessionStorage.getItem('skillsSheetVersions') !== null) {
            // get all versions of the current skillsSheet to display in versions array
            this.setupSkillsSheetFromVersions();
          } else {
            this.setupSkillsSheet(JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[], true);
          }
          console.log(this.currentPerson);
          console.log(this.currentSkillsSheet);
          this.initializeView(new Skills(this.currentPerson, this.currentSkillsSheet), true);
          this.createMenu();
        } else {
          this.skillsSheetService.getSkillsSheetsByMail(this.currentPerson.mail).subscribe(skillsSheets => {
            this.initVersionArray(false);
            console.log(this.currentPerson);
            console.log(this.currentSkillsSheet);
            this.initializeView(new Skills(this.currentPerson, this.currentSkillsSheet), true);
            this.createMenu();
          });
        }
      } else {
        this.skillsSubscription = this.skillsService.skillsObservable.subscribe(skills => this.initializeView(skills, false));
      }
      // if we are consultant or applicant we don't have the same information so we load the form that match with the role
      const formItemsJSON = require('../../../resources/formItems.json');
      if (this.currentPerson.role === PersonRole.APPLICANT) {
        this.formItems = formItemsJSON['candidateFormItems'];
        this.updateFormItemsFromPerson(this.currentPerson);
      } else if (this.currentPerson.role.toUpperCase() === PersonRole.CONSULTANT) {
        this.formItems = formItemsJSON['consultantFormItems'];
        this.updateFormItemsFromPerson(this.currentPerson);
      } else {
        this.formItems = null;
      }
      // Update chart
    });
    this.submenusSubscription = this.subMenusService.menuActionObservable.subscribe(action => this.doAction(action));
    this.myControl.disable();
    this.myControl.setValue(this.formItems[0].model);
    this.enableEditIfFormFieldsEmpty();
  }

  ngOnDestroy() {
    if (this.submenusSubscription !== undefined) {
      this.submenusSubscription.unsubscribe();
    }
    if (this.skillsSubscription !== undefined) {
      this.skillsSubscription.unsubscribe();
    }
  }

  /***********************************************************************\
   *
   *                          MAIN FUNCTIONS
   *
  \***********************************************************************/

  /**
 * Check among skillsSheet the one which correspond to the url
 * @param skillsSheets
 * @author Quentin Della-Pasqua
 */
  setupSkillsSheet(skillsSheets: SkillsSheet[], skillsSheetStored: boolean) {
    skillsSheets.forEach(skillsSheet => {
      if (skillsSheet.versionNumber === this.version && skillsSheet.name === this.name) {
        this.currentSkillsSheet = skillsSheet;
      }
    });
    if (!skillsSheetStored) {
      window.sessionStorage.setItem('skills', JSON.stringify(skillsSheets));
    }
  }

  /**
   * Filtre toutes les options qui correspondent à l'input user
   * 
   * @param value la valeur renseignée par l'utilisateur
   * @author Lucas Royackkers
   */
  private _filter(value: string): string[] {
    if (value != null) {
      if (value.length != 0) {
        const filterValue = value.toLowerCase();
        return this.options.filter(option => option.toLowerCase().includes(filterValue));
      }
      else {
        return [];
      }
    }
    else {
      return [];
    }
  }

  /**
   * Cherche tous les diplômes dans la base de données
   * @author Lucas Royackkers
   */
  getDiplomas() {
    this.diplomasService.getAllDiplomas().subscribe(diplomas => {
      this.options = (diplomas as Diploma[]).map(diploma => diploma.name);
    })
  }

  /**
 * Check among skillsSheet versions the one which corresponds to the url
 * @param skillsSheets
 * @author Camille Schnell
 */
  setupSkillsSheetFromVersions() {
    const versions = JSON.parse(window.sessionStorage.getItem('skillsSheetVersions'));
    if (versions[0].name !== this.name) {
      this.setupSkillsSheet(JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[], true);
      this.initVersionArray(false);
    } else {
      versions.forEach(skillsSheet => {
        if (skillsSheet.name === this.name && skillsSheet.versionNumber === this.version) {
          this.currentSkillsSheet = skillsSheet as SkillsSheet;
        }
      });
      this.initVersionArray(true);
    }
  }

  /**
  * Initialize components (creating soft and tech skills array, set up var, etc..)
  * @param skills
  * @author Quentin Della-Pasqua
  */
  initializeView(skills, personStored: boolean) {
    console.log(skills);
    if (skills === undefined) {
      this.router.navigate(['skills']);
    } else {
      
      this.currentPerson = skills.person;
      this.currentSkillsSheet = skills.skillsSheet;
      this.comment = skills.skillsSheet.comment;
      this.nameSkillsSheet = skills.skillsSheet.name;
      // this.lastModificationsArray = this.skillsSheetService.lastModificationsArray;
      this.softSkillsArray = [];
      this.skillsArray = [];
      skills.skillsSheet.skillsList.forEach(skill => {
        if (skill['skill'].hasOwnProperty('isSoft')) {
          this.softSkillsArray.push(skill);
        } else {
          this.skillsArray.push(skill);
        }
      });
      this.countSkillsUpdate = 0;
      this.countSoftSkillsUpdate = 0;
      this.modifDetection = false;
      this.skillsArrayDataSource = new MatTableDataSource(this.skillsArray);
      this.updateChartSkills(this.skillsArray);
      this.softSkillsArrayDataSource = new MatTableDataSource(this.softSkillsArray);
      this.updateChartSoftSkills(this.softSkillsArray);
      if (!personStored) {
        window.sessionStorage.setItem('person', JSON.stringify(this.currentPerson));
        this.skillsSheetService.getSkillsSheetsByMail(this.currentPerson.mail).subscribe(skillsSheets => {
          window.sessionStorage.setItem('skills', JSON.stringify(skillsSheets));
          this.createMenu();
          this.initVersionArray(false);
        });
      }
    }
  }

  /**
  * Create the menu corresponding to the view
  * @author Quentin Della-Pasqua
  */
  createMenu() {
    const skillsSheets = JSON.parse(window.sessionStorage.getItem('skills'));
    const subMenu: SubMenu[] = [];
    subMenu.push(this.subMenusService.createMenu('Accueil', [], 'home', 'redirect/skills', []));
    subMenu.push(this.subMenusService.createMenu('Nouvelle', [], 'note_add', 'create', []));
    let count = 0;
    const tmpSkillsSheet: SkillsSheet[] = [];
    skillsSheets.forEach(skillsSheet => {
      if (count < 3) {
        subMenu.push(this.subMenusService.createMenu(skillsSheet.name, [], 'description', 'redirect/skills/skillsheet/' + skillsSheet.name + '/' + skillsSheet.versionNumber + '/', []));
      } else {
        tmpSkillsSheet.push(skillsSheet);
      }
      count++;
    });
    if (count > 3) {
      subMenu.push(this.subMenusService.createMenu('Autres', tmpSkillsSheet, 'description', 'redirect/skills/skillsheet/', ['name', 'versionNumber']));
    }
    this.subMenusService.notifySubMenu(subMenu);
  }

  initVersionArray(skillsVersionsStored: boolean) {
    const versions = [];
    let versionDate = '';
    if (!skillsVersionsStored) {
      this.skillsSheetService.getAllSkillsSheetVersions(this.currentSkillsSheet.name, this.currentSkillsSheet.mailPersonAttachedTo).subscribe(skillsSheetVersions => {
        // init skillsSheet versions array
        (skillsSheetVersions as SkillsSheet[]).forEach(version => {
          versionDate = new Date(parseInt(version.versionDate)).toLocaleDateString();
          const managerName = version.mailVersionAuthor.split('.')[0] + ' ' + version.mailVersionAuthor.split('.')[1];
          versions.push(new SkillsSheetVersions(managerName, versionDate, version.name, version.versionNumber));
        });
        this.versionsArray = new MatTableDataSource(versions);
        window.sessionStorage.setItem('skillsSheetVersions', JSON.stringify(skillsSheetVersions));
      });
    } else {
      JSON.parse(window.sessionStorage.getItem('skillsSheetVersions')).forEach(version => {
        versionDate = new Date(parseInt(version.versionDate)).toLocaleDateString();
        const managerName = version.mailVersionAuthor.split('.')[0] + ' ' + version.mailVersionAuthor.split('.')[1];
        versions.push(new SkillsSheetVersions(managerName, versionDate, version.name, version.versionNumber));
      });
      this.versionsArray = new MatTableDataSource(versions);
    }
  }

  /***********************************************************************\
   *
   *                          SOUS-FONCTIONS
   *
  \***********************************************************************/

  /**
   * Check s'il doit faire l'action, si oui, la réalise
   * @param action
   * @author Quentin Della-Pasqua
   */
  doAction(action: string) {
    if (action !== '') {
      const actionSplit = action.split('//');
      this.subMenusService.notifyMenuAction('');
      if (actionSplit[0] === this.router.url) {
        if (actionSplit[1] === 'create') {
          //this.createSkillsSheet();
        } else if (actionSplit[1].match('^redirect/.*')) {
          const redirect = actionSplit[1].substring(9);
          if (('/' + redirect) !== this.router.url + '/') {
            if (!this.modifDetection) {
              this.redirectAfterAction(redirect);
            } else {
              this.onSubmitRedirect(redirect);
            }
          }
        }
      }
    }
  }

  /**
  * Calls skills service to save current skillsSheet
  */
  onSubmitForm() {
    LoggerService.log('Submitting form', LogLevel.PROD);
    this.currentSkillsSheet.comment = this.comment;
    LoggerService.log(this.currentPerson,LogLevel.DEBUG);
    LoggerService.log(this.comment,LogLevel.DEBUG);
    let tmpExisting;
    if ((tmpExisting = (JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[]).find(skillsSheet => skillsSheet.name === this.currentSkillsSheet.name)) != undefined) {
      this.currentSkillsSheet.versionNumber = tmpExisting.versionNumber
      this.skillsSheetService.updateSkillsSheet(this.currentSkillsSheet).subscribe(httpResponse => {
        if (httpResponse['stackTrace'][0]['lineNumber'] == 201) {
          this.currentSkillsSheet.versionNumber += 1
          let tmpSkillsSheets: SkillsSheet[] = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
          let tmpModifiedSkillsSheets = tmpSkillsSheets.map(skillsSheet => skillsSheet.name == this.currentSkillsSheet.name ? this.currentSkillsSheet : skillsSheet)
          window.sessionStorage.setItem('skills', JSON.stringify(tmpModifiedSkillsSheets));
          this.initVersionArray(false);
          this.router.navigate(['skills/skillsheet/' + this.currentSkillsSheet.name + '/' + this.currentSkillsSheet.versionNumber])
        }
      });
    } else {
      this.currentSkillsSheet.versionNumber = 1;
      this.skillsSheetService.createNewSkillsSheet(this.currentSkillsSheet).subscribe(httpResponse => {
        if (httpResponse['stackTrace'][0]['lineNumber'] === 201) {
          const tmpSkillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
          tmpSkillsSheets.push(this.currentSkillsSheet);
          window.sessionStorage.setItem('skills', JSON.stringify(tmpSkillsSheets));
          this.router.navigate(['skills/skillsheet/' + this.currentSkillsSheet.name + '/' + this.currentSkillsSheet.versionNumber]);
        }
      });
    }
    this.modifDetection = false;
  }

  onSubmitRedirect(redirect: string) {
    LoggerService.log('submitRedirect', LogLevel.DEBUG);
    LoggerService.log(this.currentSkillsSheet, LogLevel.DEBUG);
    let tmpExisting;
    if ((tmpExisting = (JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[]).find(skillsSheet => skillsSheet.name === this.currentSkillsSheet.name)) !== undefined) {
      this.currentSkillsSheet.versionNumber = tmpExisting.versionNumber;
      this.skillsSheetService.updateSkillsSheet(this.currentSkillsSheet).subscribe(httpResponse => {
        if (httpResponse['stackTrace'][0]['lineNumber'] === 201) {
          this.currentSkillsSheet.versionNumber += 1;
          const tmpSkillsSheets: SkillsSheet[] = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
          const tmpModifiedSkillsSheets = tmpSkillsSheets.map(skillsSheet => skillsSheet.name === this.currentSkillsSheet.name ? this.currentSkillsSheet : skillsSheet);
          window.sessionStorage.setItem('skills', JSON.stringify(tmpModifiedSkillsSheets));
          this.redirectAfterAction(redirect);
        }
      });
    } else {
      this.currentSkillsSheet.versionNumber = 1;
      this.skillsSheetService.createNewSkillsSheet(this.currentSkillsSheet).subscribe(httpResponse => {
        if (httpResponse['stackTrace'][0]['lineNumber'] === 201) {
          const tmpSkillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
          if (tmpSkillsSheets.find(skillsSheet => skillsSheet.name === this.currentSkillsSheet.name) === undefined) {
            tmpSkillsSheets.push(this.currentSkillsSheet);
          }
          window.sessionStorage.setItem('skills', JSON.stringify(tmpSkillsSheets));
          this.redirectAfterAction(redirect);
        }
      });
    }
  }

  createSkillsSheet() {
    // const newSkillsSheet = new SkillsSheet('NEW-' + this.makeName(), this.currentPerson);
    // const tmpSkillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
    // const defaultSoftSkills = require('../../../resources/defaultSoftSkills.json');
    // newSkillsSheet.skillsList = defaultSoftSkills['softSkillsList'];
    // while (tmpSkillsSheets.find(skillsSheet => skillsSheet.name === newSkillsSheet.name) !== undefined) {
    //   newSkillsSheet.name = 'NEW-' + this.makeName();
    // }
    // this.skillsSheetService.createNewSkillsSheet(newSkillsSheet).subscribe(httpResponse => {
    //   if (httpResponse['stackTrace'][0]['lineNumber'] === 201) {
    //     const tmpSkillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
    //     tmpSkillsSheets.push(newSkillsSheet);
    //     window.sessionStorage.setItem('skills', JSON.stringify(tmpSkillsSheets));
    //     this.redirectAfterAction('skills/skillsheet/' + newSkillsSheet.name + '/1');
    //     this.subMenusService.notifyMenuAction('');
    //   }
    // });
  }

  redirectAfterAction(redirect: string) {
    if (this.skillsSubscription !== undefined) {
      this.skillsSubscription.unsubscribe();
    }
    this.subMenusService.resetMenuAction();
    this.subMenusService.resetSubMenu();
    this.router.navigate([redirect]);
  }

  /**
   * Translates Person role
   * @param  roleName role to translate
   */
  translate(roleName) {
    return roleName.toLowerCase() === 'applicant' ? 'Candidat' : 'Consultant';
  }

  /**
   * Checks if skillsSheetName is empty and sets old name if it is
   * @param  event input name of skillsSheet
   */
  checkIfNameEmpty(event) {
    const newSkillsSheetName = event.target.value;
    if (newSkillsSheetName.trim() === '') {
      event.target.value = this.currentSkillsSheet.name;
    } else {
      this.currentSkillsSheet.name = newSkillsSheetName;
      this.modifDetection = true;
    }
  }

  /**
   * On click on edit person button
   */
  editPerson() {
    this.isEditButtonHidden = true;
    this.isPersonDataDisabled = false;
    this.myControl.enable();
  }

  /**
   * On click on save edit button : Person is updated in db
   */
  savePerson() {
    this.isEditButtonHidden = false;
    this.isPersonDataDisabled = true;
    this.currentPerson = this.updatePersonFromFormItems();
    this.currentPerson.opinion = this.avis != undefined ? this.avis : "";
    this.currentPerson.highestDiploma = this.myControl.value;
    this.personSkillsService.updatePerson(this.currentPerson).subscribe(httpResponse => {
      if (httpResponse['stackTrace'][0]['lineNumber'] == 200) {
        window.sessionStorage.setItem('person', JSON.stringify(this.currentPerson));
        LoggerService.log('Person updated', LogLevel.DEBUG);
      }
    });
    this.myControl.disable();
  }

  /**
   * Update person's opinion on select
   */
  onOpinionChange() {
    this.currentPerson.opinion = this.avis != undefined ? this.avis : "";
    this.personSkillsService.updatePerson(this.currentPerson).subscribe(httpResponse => {
      if (httpResponse['stackTrace'][0]['lineNumber'] === 200) {
        window.sessionStorage.setItem('person', JSON.stringify(this.currentPerson));
        LoggerService.log('Person updated', LogLevel.DEBUG);
      }
    });
  }

  /**
   * On click on cancel edit button
   */
  cancelEditPerson() {
    this.isEditButtonHidden = false;
    this.isPersonDataDisabled = true;
    this.updateFormItemsFromPerson(this.currentPerson);
    this.myControl.disable();
  }

  /**
   * if no info about person yet : edit person form is enabled
   */
  enableEditIfFormFieldsEmpty() {
    let allEmpty = true;
    this.formItems.forEach(item => {
      if (item.model != '' && item.model != '0') {
        allEmpty = false;
      }
    });
    if (allEmpty) {
      this.isPersonDataDisabled = false;
      this.isEditButtonHidden = true;
      this.myControl.enable();
    }
  }

  /**
   * Updates a Person with data retrieved from the "edit person form" of a skillsheet
   * @return Person updated
   */
  updatePersonFromFormItems() {
    const personToUpdate = this.currentPerson;
    this.formItems.forEach(item => {
      switch (item.id) {
        case 'highestDiplomaYear':
          personToUpdate.highestDiplomaYear = item.model;
          break;
        case 'employer':
          personToUpdate.employer = item.model;
          break;
        case 'job':
          personToUpdate.job = item.model;
          break;
        case 'monthlyWage':
          personToUpdate.monthlyWage = item.model;
          break;
        default:
          break;
      }
    });
    personToUpdate.highestDiploma = this.myControl.value;
    return personToUpdate;
  }

  /**
  * Updates form data of a skillSheet given a Person
  * @param  person Person containing data to display
  */
  updateFormItemsFromPerson(person: Person) {
    this.avis = person.opinion; // update avis
    if (person.role == PersonRole.APPLICANT) {
      this.formItems.forEach(item => {
        switch (item.id) {
          case 'highestDiploma':
            item.model = person.highestDiploma;
            break;
          case 'highestDiplomaYear':
            item.model = person.highestDiplomaYear;
            break;
          case 'experienceTime':
            item.model = person.experienceTime;
            break;
          case 'employer':
            item.model = person.employer;
            break;
          case 'job':
            item.model = person.job;
            break;
          case 'monthlyWage':
            item.model = person.monthlyWage;
            break;
          default:
            break;
        }
      });
    }
    else if (person.role == PersonRole.CONSULTANT) {
      this.formItems.forEach(item => {
        switch (item.id) {
          case 'highestDiploma':
            item.model = person.highestDiploma;
            break;
          case 'highestDiplomaYear':
            item.model = person.highestDiplomaYear;
            break;
          case 'experienceTime':
            item.model = person.experienceTime;
            break;
          case 'job':
            item.model = person.job;
            break;
          case 'monthlyWage':
            item.model = person.monthlyWage;
            break;
          default:
            break;
        }
      });
    }
    this.myControl.setValue(this.currentPerson.highestDiploma);
  }

  makeName() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /***********************************************************************\
   *
   *                          CHART FUNCTIONS
   *
  \***********************************************************************/

  /**
   * Updates the radar chart for skills
   * @param  arraySkills Array containing updated skills
   */
  updateChartSkills(arraySkills: SkillGraduated[]) {
    if (this.countSkillsUpdate > 1) {
      this.modifDetection = true;
    }
    this.countSkillsUpdate++;
    if (typeof this.skillsChart !== 'function') {
      this.skillsChart.destroy();
    }
    if (arraySkills.length !== 0) {
      const skillsLabels: string[] = [];
      const skillsData: number[] = [];
      arraySkills.forEach((skillGraduated) => {
        skillsLabels.push(skillGraduated.skill.name);
        skillsData.push(skillGraduated.grade);
      });
      this.skillsChart = this.createOrUpdateChart(this.formatLabels(skillsLabels, 8), skillsData, 'canvasSkills');
      this.skillsArray = arraySkills;
      this.currentSkillsSheet.skillsList = this.skillsArray.concat(this.softSkillsArray);
    }
  }

  /**
   * Updates the radar chart for soft skills
   * @param  arraySkills Array containing updated soft skills
   */
  updateChartSoftSkills(arraySoftSkills: SkillGraduated[]) {
    if (this.countSoftSkillsUpdate > 1) {
      this.modifDetection = true;
    }
    this.countSoftSkillsUpdate++;
    if (typeof this.softSkillsChart !== 'function') {
      this.softSkillsChart.destroy();
    }
    if (arraySoftSkills.length !== 0) {
      const skillsLabels: string[] = [];
      const skillsData: number[] = [];
      arraySoftSkills.forEach((skillGraduated) => {
        skillsLabels.push(skillGraduated.skill.name);
        skillsData.push(skillGraduated.grade);
      });
      this.softSkillsChart = this.createOrUpdateChart(this.formatLabels(skillsLabels, 8), skillsData, 'canvasSoftSkills');
      this.softSkillsArray = arraySoftSkills;
      this.currentSkillsSheet.skillsList = this.skillsArray.concat(this.softSkillsArray);
    }
  }

  /**
  * Create a radar chart (skills matrix)
  * @param  labels    labels to display on the chart
  * @param  data      data for the chart
  * @param  elementId 'canvasSkills' or 'canvasSoftSkills'
  * @return           a radar chart
  */
  createOrUpdateChart(labels, data, elementId) {
    let legendDisplayed = elementId === 'canvasSkills';
    return new Chart(elementId, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Note',
          data: data,
          backgroundColor: [
            'rgba(00, 139, 210, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(00, 139, 210, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: legendDisplayed,
          position: 'bottom',
          onClick: (e) => e.stopPropagation()
        },
        scale: {
          ticks: {
            min: 0,
            max: 4,
            step: 0.5
          },
          pointLabels: {
            fontSize: 16
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              var label = data.labels[tooltipItem.index];
              return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  /* takes a string phrase and breaks it into separate phrases
  no bigger than 'maxwidth', breaks are made at complete words.*/
  /**
  * Breaks labels into arrays to display them in multiple lines in radar chart.
  * Breaks are made at complete words.
  * @param  labels   array of labels
  * @param  maxwidth max width per line
  * @return          new array with formatted labels
  */
  formatLabels(labels, maxwidth) {
    const formattedLabels = [];

    labels.forEach((label) => {
      const sections = [];
      const words = label.split(' ');
      let temp = '';

      words.forEach((item, index) => {
        if (temp.length > 0) {
          const concat = temp + ' ' + item;

          if (concat.length > maxwidth) {
            sections.push(temp);
            temp = '';
          } else {
            if (index === (words.length - 1)) {
              sections.push(concat);
              return;
            } else {
              temp = concat;
              return;
            }
          }
        }

        if (index === (words.length - 1)) {
          sections.push(item);
          return;
        }

        if (item.length < maxwidth) {
          temp = item;
        } else {
          sections.push(item);
        }

      });
      formattedLabels.push(sections);
    });
    return formattedLabels;
  }
}

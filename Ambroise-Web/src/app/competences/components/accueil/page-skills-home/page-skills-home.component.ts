import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/competences/components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import {MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator, MatExpansionPanel } from '@angular/material';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Router } from '@angular/router';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { PersonSkillsService } from 'src/app/competences/services/personSkills.service';
import { SkillGraduated, Skill } from 'src/app/competences/models/skillsSheet';
import { SkillsService } from 'src/app/competences/services/skills.service';
import { Skills } from 'src/app/competences/models/skills';
import { Person } from 'src/app/competences/models/person';
import { SubMenu } from 'src/app/header/models/menu';
import { SubMenusService } from 'src/app/services/subMenus.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { SkillsListService } from '../../../services/skillsList.service';

@Component({
  selector: 'app-page-skills-home',
  templateUrl: './page-skills-home.component.html',
  styleUrls: ['./page-skills-home.component.scss']
})
export class PageSkillsHomeComponent implements OnInit {

  @ViewChild('expansionCPT') expansionCPT: MatExpansionPanel;

  skillsSheetDataSource: MatTableDataSource<any[]> = new MatTableDataSource();
  //Tableau countenant les headers
  displayedColumns: string[] = ['Nom Prénom', 'Métier', 'Avis', 'Disponibilité', 'Moyenne Soft Skills','Java','C++','.NET','PHP','SQL'];
  //noCompColumns: string[] = ['Nom Prénom','Métier','Avis','Disponibilité'];
  //Tableau contenant les compétences
  compColumns: string[] = ['Java','C++','.NET','PHP','SQL'];

  //Tableau contenant les compétences recherchées
  compFilter: string[] = [];
  //Tableau contenant les autres filtres
  filter: string[] = [];

  //Tableau contenant toutes les options (compétences)
  options : string[];
  filteredOptions : Observable<string[]>;
  myControl = new FormControl();

  rechercheInput: string;
  rechercheInputCpt: string;

  //current skills[]
  currentSkills: Skills[];

  //Subscription
  subMenusSubscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
    private router: Router,
    private skillsSheetService: SkillsSheetService,
    private personSkillsService: PersonSkillsService,
    private skillsService: SkillsService,
    private subMenusService: SubMenusService, private skillsListService : SkillsListService) { }

  ngOnInit() {
    this.getSkillsList();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      map(value => this._filter(value))
    );
    this.searchSkillSheets(",");
    this.createMenu();
    this.subMenusSubscription = this.subMenusService.menuActionObservable.subscribe(action => this.doAction(action));
  }

  ngOnDestroy(){
    if(this.subMenusSubscription != undefined){
      this.subMenusSubscription.unsubscribe() ;
    } else {
      LoggerService.log("ERROR SUBSCRIPTION : subMenusSubscription (page-skills-home Component), should have been set up",LogLevel.DEV)
    }
  }

  /**
   * Cherche toutes les compétences en base
   * @author Lucas Royackkers
   */
  getSkillsList(){
    this.skillsListService.getAllSkills().subscribe(skillsList=> {
      this.options = (skillsList as Skill[]).map(skill => skill.name);
    });
  }

  /**
   * Cherche toutes les skillSheets
   * @author Quentin Della-pasqua
   */
  searchSkillSheets(sortColumn) {
    this.skillsService.getAllSkills(this.filter, this.compFilter, sortColumn).subscribe(skillsList => {
      if (skillsList != undefined) {
        this.createDataSource(skillsList['results'] as Skills[])
        setTimeout(() => this.skillsSheetDataSource.paginator = this.paginator);
      }
    })
  }

  /**
   * Filtre toutes les options qui correspondent à l'input user
   *
   * @param value la valeur renseignée par l'utilisateur
   * @author Lucas Royackkers
   */
  private _filter(value: string): string[] {
    if(value.length != 0){
      const filterValue = value.toLowerCase();
      this.rechercheInputCpt = value;
      return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
    else{
      return [];
    }
  }

  /**
   * Crée les menus associé à la vue
   * @author Quentin Della-Pasqua
   */
  createMenu() {
    let subMenu: SubMenu[] = [];
    subMenu.push(this.subMenusService.createMenu('Nouvelle', [], 'add_circle', 'create', []))
    this.subMenusService.notifySubMenu(subMenu);
  }

  /**
   * Regarde quel action est envoyer par le header, la vérifie et la traite si c'est pour lui
   * @param action
   * @author Quentin Della-Pasqua
   */
  doAction(action: string) {
    if (action != "") {
      let actionSplit = action.split('//');
      this.subMenusService.notifyMenuAction("");
      if (actionSplit[0] == this.router.url) {
        if (actionSplit[1] === 'create') {
          this.createSkillsSheetModal();
        }
      }
    }
  }

  /***********************************************************************\
   *
   *                          SOUS-FONCTIONS
   *
  \***********************************************************************/


  /**
   * Modeler les données reçu du serveur pour les faire correspondre au Mat Table
   * @param skillsList
   * @author Quentin Della-Pasqua
   */
  createDataSource(skillsList: Skills[]) {
    let skillSheet: any[] = [];
    if (skillsList != []) {
      this.currentSkills = skillsList;
      skillsList.forEach(skills => {
        let tmpSkillSheet: any = {};
        if (skills['person'].hasOwnProperty('name') && skills['person'].hasOwnProperty('surname')) {
          tmpSkillSheet['nameSkillsSheet'] = skills['skillsSheet']['name'];
          tmpSkillSheet['Nom Prénom'] = skills['person']['name'] + ' ' + skills['person']['surname'];
          tmpSkillSheet['Métier'] = this.instantiateProperty(skills['person'], 'job');
          tmpSkillSheet['Avis'] = this.instantiateProperty(skills['person'], 'opinion');
          tmpSkillSheet['Disponibilité'] = this.instantiateProperty(skills['person'], 'availability');
          tmpSkillSheet['Moyenne Soft Skills'] = this.instantiateProperty(skills['skillsSheet'], 'softSkillAverage');
          this.compColumns.forEach(comp => {
            let tmpCompResult = skills['skillsSheet']['skillsList'].find(skill => skill['skill']['name'].toLowerCase() == comp.toLowerCase())
            if (tmpCompResult != undefined) {
              tmpSkillSheet[comp] = tmpCompResult.grade;
            } else {
              tmpSkillSheet[comp] = "";
            }
          })
          tmpSkillSheet['skills'] = skills;
          skillSheet.push(tmpSkillSheet);
        }
      })
      this.skillsSheetDataSource = new MatTableDataSource(skillSheet);
    }
  }

  /**
   * Factorise les conditions if
   * @param property
   * @param testedProperty
   * @author Quentin Della-Pasqua
   */
  instantiateProperty(property, testedProperty: string): any {
    if (property.hasOwnProperty(testedProperty)) {
      return property[testedProperty];
    }
    return "";
  }

  /**
   * Calcul de la moyenne des soft skills
   * @param skillsList
   * @author Quentin Della-Pasqua, Camille Schnell
   */
  getAverageSoftSkillGrade(skillsList: SkillGraduated[]): number {
    let sumGrades = 0;
    let countSoft = 0;
    for (let softSkill of skillsList) {
      if (softSkill['skill'].hasOwnProperty('isSoft')) {
        sumGrades += softSkill.grade;
        countSoft += 1;
      }
    }
    if (countSoft != 0) {
      return +(sumGrades / countSoft).toFixed(2);
    }
    return 0;
  }

  /**
  * Filters array on input
  * @param  filterValue input string
  */
  applyFilterSkillsSheets(filterValue: string) {
    this.skillsSheetDataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToSkillsSheet(skillsSheetData) {
    let skills = this.currentSkills.find(skills => skills['skillsSheet']['name'] == skillsSheetData['nameSkillsSheet']);
    this.skillsService.notifySkills(skills);
    this.redirectToSkillsSheet(skills['skillsSheet']['name'], skills['skillsSheet']['versionNumber']);
  }

  /**
  * Ouvre une modal pour créer une nouvelle personne
  */
  createSkillsSheetModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ModalSkillsCandidateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(skills => {
      let currentSkills = skills as Skills;
      if (skills != "canceled" && skills != undefined) {
        if (currentSkills.skillsSheet.versionDate != "") { // if existant skillsSheet
          this.personSkillsService.getPersonByMail(currentSkills.skillsSheet.mailPersonAttachedTo).subscribe(person => {
            this.skillsService.notifySkills(new Skills(person as Person, currentSkills.skillsSheet))
          });
          this.redirectToSkillsSheet(currentSkills.skillsSheet.name, currentSkills.skillsSheet.versionNumber);
        }
        else {
          this.personSkillsService.createNewPerson(currentSkills.person).subscribe(httpResponse => {
            if (httpResponse['stackTrace'][0]['lineNumber'] == 201) {
              this.createNewSkillSheet(currentSkills.person, currentSkills.skillsSheet);
            }
          });
        }
      }
    });
  }

  /**
   * Crée le nom et fais la requête pour post la skillSheet
   * @param person
   * @author Quentin Della-Pasqua
   */
  createNewSkillSheet(person, skillsSheet) {
    this.skillsSheetService.createNewSkillsSheet(skillsSheet).subscribe(httpResponse => {
      if (httpResponse['stackTrace'][0]['lineNumber'] == 201) {
        this.skillsService.notifySkills(new Skills(person, skillsSheet));
        this.redirectToSkillsSheet(skillsSheet.name, skillsSheet.versionNumber);
      }
    })
  }

  redirectToSkillsSheet(name: string, version: number) {
    this.router.navigate(['skills/skillsheet/' + name + '/' + version]);
  }

  /**
   * Ajoute une colonne au tableau + appel au WS pour trier
   * @author Quentin Della-Pasqua, Lucas Royackkers
   */
  doAddSkill() {
    if (this.displayedColumns.findIndex(filterTag => filterTag.toLowerCase() === this.rechercheInputCpt.toLowerCase()) == -1 && this.rechercheInputCpt != null && !this.rechercheInputCpt.match("^\ +") && this.rechercheInputCpt != "" && this.options.find(filterTag => filterTag.toLowerCase() === this.rechercheInputCpt.toLowerCase()) != undefined) {
      this.compFilter.push(this.rechercheInputCpt);
      this.compColumns.push(this.rechercheInputCpt);
      this.displayedColumns.push(this.rechercheInputCpt);
      this.searchSkillSheets(",");
      this.expansionCPT.expanded = true;
    }
    else if(this.rechercheInputCpt != null && !this.rechercheInputCpt.match("^\ +") && this.rechercheInputCpt != "" && this.options.find(filterTag => filterTag.toLowerCase() === this.rechercheInputCpt.toLowerCase()) != undefined){
      this.compFilter.push(this.rechercheInputCpt);
      this.searchSkillSheets(",");
      this.expansionCPT.expanded = true;
    }
    this.rechercheInputCpt = "";
    this.myControl.setValue("");
  }

  /**
   * Ajoute le filter a la liste
   * @author Maxime Maquinghen
   */
  doAddFilter() {
    if (this.filter.findIndex(filterTag => filterTag.toLowerCase() === this.rechercheInput.toLowerCase()) == -1 && this.rechercheInput != null && !this.rechercheInput.match("^\ +") && this.rechercheInput != "") {
      this.filter.push(this.rechercheInput);
      this.searchSkillSheets(",");
    }
    this.rechercheInput = "";
  }

  /**
   *
   * @param event catch the delete event on tagWord of Competence
   * @author Maxime Maquinghen
   */
  deleteSkillWord(event) {
    let skillWordToDelete = event.srcElement.alt;
    this.compFilter = this.compFilter.filter(el => el !== skillWordToDelete);
    if(!this.isSkillWordInBasics(skillWordToDelete)) this.displayedColumns = this.displayedColumns.filter(el => el !== skillWordToDelete);
    this.searchSkillSheets(",");
  }

  /**
   * Checks if the skill Word is in our 'basics' skills
   *
   * @param skillWord the skill Word that we might delete
   * @author Lucas Royackkers
   */
  isSkillWordInBasics(skillWord){
    return skillWord.toLowerCase() == "c++" || skillWord.toLowerCase() == "php" || skillWord.toLowerCase() == "sql" || skillWord.toLowerCase() == ".net" || skillWord.toLowerCase() == "java";
  }

  /**
   *
   * @param event catch the delete event on tagWord of filter
   * @author Maxime Maquinghen
   */
  deleteTagWord(event) {
    this.filter = this.filter.filter(el => el !== event.srcElement.alt);
    this.searchSkillSheets(",");
  }

  /**
   * Sort the columns
   * @param  event catch the sort event
   */
  onColumnSort(sort) {
    if(sort.active && sort.direction != "") {
      this.searchSkillSheets(this.translateColumnName(sort.active) + ',' + sort.direction);
    }
    else {
      this.searchSkillSheets(",");
    }
  }

  translateColumnName(name) {
    switch(name) {
      case "Nom Prénom":
        return "name";
      case "Métier":
        return "job";
      case "Avis":
        return "opinion";
      case "Disponibilité":
        return "availability";
      case "Moyenne Soft Skills":
        return "softskillsAverage";
      default:
        return name;
    }
  }


  /**
   * Get the value of the rating
   * @param event catch the click event on star
   */
  /*
  minRatingValue(event) {
    LoggerService.log(event.srcElement.value, LogLevel.DEVDEBUG)
  }*/

}

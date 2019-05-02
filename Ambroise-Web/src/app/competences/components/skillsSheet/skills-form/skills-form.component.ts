import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { LogLevel, LoggerService } from 'src/app/services/logger.service';
import { MatDialog, MatDialogActions } from '@angular/material';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { Person, PersonRole } from 'src/app/competences/models/person';
import { SkillsSheet, Skill, SkillGraduated, SkillsSheetVersions } from 'src/app/competences/models/skillsSheet';
import { SkillsService } from 'src/app/competences/services/skills.service';
import { ArrayObsService } from 'src/app/competences/services/arrayObs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTabLinkBase } from '@angular/material/tabs/typings/tab-nav-bar';
import { Skills } from 'src/app/competences/models/skills';
import { SubMenusService } from 'src/app/services/subMenus.service';
import { Menu, SubMenu } from 'src/app/header/models/menu';
import { PersonSkillsService } from 'src/app/competences/services/personSkills.service';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss']
})
/**
* Component containing the skillsSheet creation form.
* @param skillsSheetService service handling back-end communication and data
*/
export class SkillsFormComponent implements OnInit {

  lastModificationsArray: any[];
  lastModifDisplayedColumns: string[] = ['manager', 'date'];

  //Information of tech skills
  skillsArray: any[] = [];
  skillsDisplayedColumns: string[] = ['skillName', 'grade'];

  //Information of soft skills
  softSkillsArray: any[] = [];
  softSkillsDisplayedColumns: string[] = ['skillName', 'grade'];

  headerRowHiddenModif = false;
  headerRowHiddenSkills = true;

  //Form displayed
  formItems: any[];

  //Charts
  skillsChart = Chart;
  softSkillsChart = Chart;

  currentPerson: Person;
  tmpCurrentPerson: Person;
  currentSkillsSheet: SkillsSheet;

  //information contains in the path
  name: string;
  version: number ; 

  //
  avis: string;
  isEditButtonHidden: boolean = false;
  isPersonDataDisabled: boolean = true;
  isSkillsSheetNameEditable: boolean = false;

  constructor(private skillsService: SkillsService,
              private skillsSheetService: SkillsSheetService,
              private personSkillsService: PersonSkillsService,
              private arrayObsService: ArrayObsService,
              private router: Router,
              private route: ActivatedRoute,
              private subMenusService: SubMenusService) { }

  /**
   * Init : - check if a skillsObservable is present then inits current data (Person and Skills) else redirects to skills home
   *        - init form items of a Person (different inputs whether it's an applicant or a consultant)
   *        - init both charts of skills and soft skills
   */
  ngOnInit() {
    //Get param in the url 
    this.name = this.route.snapshot.paramMap.get("name") ;
    this.version = +this.route.snapshot.paramMap.get("version") ;
    //Check if data already exists, person is more important than skillsSheet 
    if (window.sessionStorage.getItem('person') != null){
      this.currentPerson = JSON.parse(window.sessionStorage.getItem('person')) as Person  ; 
      if(window.sessionStorage.getItem('skills') != null){
        this.setupSkillsSheet(JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[],true)
        this.initializeView(new Skills(this.currentPerson,this.currentSkillsSheet),true) ; 
        this.createMenu() ;
      } else {
        this.skillsSheetService.getAllSkillSheets(this.currentPerson.mail).subscribe(skillsSheets  => {
          this.setupSkillsSheet(skillsSheets as SkillsSheet[],false) ;
          this.initializeView(new Skills(this.currentPerson,this.currentSkillsSheet),true);
          this.createMenu() ;
        })
      }
    } else {
      this.skillsService.skillsObservable.subscribe(skills => this.initializeView(skills,false))
    }
    //if we are consultant or applicant we don't have the same information so we load the form that match with the role
    let formItemsJSON = require('../../../resources/formItems.json');
    if(this.currentPerson.role == PersonRole.APPLICANT){
      this.formItems = formItemsJSON["candidateFormItems"];
      this.updateFormItemsFromPerson(this.currentPerson);
    } else if (this.currentPerson.role.toUpperCase() == PersonRole.CONSULTANT ){
      this.formItems = formItemsJSON["consultantFormItems"];
      this.updateFormItemsFromPerson(this.currentPerson);
    } else {
      this.formItems = null ;
    }
    //Update chart 
    this.arrayObsService.arraySkillsObservable.subscribe(arraySkills => this.updateChartSkills(arraySkills));
    this.arrayObsService.arraySoftSkillsObservable.subscribe(arraySoftSkills => this.updateChartSoftSkills(arraySoftSkills)) ; 
    this.subMenusService.menuActionObservable.subscribe(action => this.doAction(action)); 
    this.arrayObsService.arraySkillsVersionsObservable.subscribe(arraySkillsVersions => this.lastModificationsArray = arraySkillsVersions);
  }

  /**
   * Create the menu corresponding to the view
   * @author Quentin Della-Pasqua
   */
  createMenu(){
    let skillsSheets = JSON.parse(window.sessionStorage.getItem('skills'))
    let subMenu: SubMenu[] = []; 
    subMenu.push(this.subMenusService.createMenu('Accueil',[],'home','redirect/skills'))
    subMenu.push(this.subMenusService.createMenu('Nouvelle',[],'note_add','create'))
    skillsSheets.forEach(skillsSheet => {
      subMenu.push(this.subMenusService.createMenu(skillsSheet.name,[],null,'redirect/skills/skillsSheet'+skillsSheet.name+'/'+skillsSheet.versionNumber))
    })
    this.subMenusService.notifySubMenu(new Menu("Compétences",subMenu))
  }

  ngOnDestroy() {
    this.arrayObsService.resetSkills();
    this.arrayObsService.resetSoftSkills();
    this.arrayObsService.resetSkillsVersions();
  }

  /**
   * Translates Person role
   * @param  roleName role to translate
   */
  /**
   * Check s'il doit faire l'action, si oui, la réalise
   * @param action 
   * @author Quentin Della-Pasqua
   */
  doAction(action: string){
    if(action != ""){
      let actionSplit = action.split('//') ; 
    if (actionSplit[0] == this.router.url){
      if(actionSplit[1] === 'create'){
        //TODO
      } else if(actionSplit[1].match("^redirect/.*")){
        let redirect = actionSplit[1].substring(9); 
        this.router.navigate([redirect])
      }
    }
    }
  }

  /**
   * Check among skillsSheet the one which correspond to the url 
   * @param skillsSheets 
   * @author Quentin Della-Pasqua
   */
  setupSkillsSheet(skillsSheets: SkillsSheet[], skillsSheetStored){
    skillsSheets.forEach(skillsSheet => {
      if(skillsSheet.versionNumber == this.version && skillsSheet.name == this.name){
        this.currentSkillsSheet = skillsSheet ; 
      }
    })
    if(!skillsSheetStored){
      window.sessionStorage.setItem('skills',JSON.stringify(skillsSheets)); 
    }
  }

  /**
   * Initialize components (creating soft and tech skills array, set up var, etc..)
   * @param skills
   * @author Quentin Della-Pasqua 
   */
  initializeView(skills,personStored:boolean){
    if(skills == undefined){
      this.router.navigate(['skills']);
    } else {
      this.currentPerson = skills.person ; 
      this.currentSkillsSheet = skills.skillsSheet ; 
      this.lastModificationsArray = this.skillsSheetService.lastModificationsArray;
      skills.skillsSheet.skillsList.forEach(skill => {
        if(skill['skill'].hasOwnProperty('isSoft')){
          this.softSkillsArray.push(skill); 
        } else {
          this.skillsArray.push(skill)
        }
      });
    this.arrayObsService.notifySkills(this.skillsArray) ; 
    this.arrayObsService.notifySoftSkills(this.softSkillsArray)
    }
    if(!personStored){
      window.sessionStorage.setItem('person',JSON.stringify(this.currentPerson));
      this.skillsSheetService.getAllSkillSheets(this.currentPerson.mail).subscribe(skillsSheets  =>  {
        window.sessionStorage.setItem('skills',JSON.stringify(skillsSheets))
        this.createMenu(); 
      });
    }
  }

  translate(roleName) {
    return roleName.toLowerCase() === 'applicant' ? 'Candidat' : 'Consultant';
  }

  editSkillsSheetName() {
    this.isSkillsSheetNameEditable = true;
  }

  /**
   * Checks if skillsSheetName is empty and sets old name if it is
   * @param  event input name of skillsSheet
   */
  checkIfNameEmpty(event) {
    let newSkillsSheetName = event.target.innerText;
    if(newSkillsSheetName == "") {
      event.target.innerText = this.currentSkillsSheet.name;
    }
    else {
      this.currentSkillsSheet.name = newSkillsSheetName;
    }
  }

  /**
   * On click on edit person button
   */
  editPerson() {
    this.isEditButtonHidden = true;
    this.isPersonDataDisabled = false;
    this.tmpCurrentPerson = this.currentPerson;
  }

  /**
   * On click on save edit button : Person is updated in db
   */
  savePerson() {
    this.isEditButtonHidden = false;
    this.isPersonDataDisabled = true;
    this.currentPerson = this.updatePersonFromFormItems();
    this.personSkillsService.updatePerson(this.currentPerson).subscribe(httpResponse => {
      if(httpResponse != undefined) {
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
    this.currentPerson = this.tmpCurrentPerson;
    this.updateFormItemsFromPerson(this.currentPerson);
  }

  /**
   * Updates form data of a skillSheet given a Person
   * @param  person Person containing data to display
   */
  updateFormItemsFromPerson(person: Person) {
    if(person.role == PersonRole.APPLICANT) {
      this.formItems.forEach(item => {
        switch(item.id) {
          case 'highestDiploma':
            item.model = person.highestDiploma;
            break;
          case 'highestDiplomaYear':
            item.model = person.highestDiplomaYear;
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
    else if(person.role == PersonRole.CONSULTANT) {
      this.formItems.forEach(item => {
        switch(item.id) {
          case 'highestDiploma':
            item.model = person.highestDiploma;
            break;
          case 'highestDiplomaYear':
            item.model = person.highestDiplomaYear;
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
  }

  /**
   * Updates a Person with data retrieved from the "edit person form" of a skillsheet
   * @return Person updated
   */
  updatePersonFromFormItems() {
    let personToUpdate = this.currentPerson;
    this.formItems.forEach(item => {
      switch(item.id) {
        case 'highestDiploma':
          personToUpdate.highestDiploma = item.model ;
          break;
        case 'highestDiplomaYear':
          personToUpdate.highestDiplomaYear = item.model ;
          break;
        case 'employer':
          personToUpdate.employer = item.model;
          break;
        case 'job':
          personToUpdate.job = item.model ;
          break;
        case 'monthlyWage':
          personToUpdate.monthlyWage = item.model ;
          break;
        default:
          break;
      }
    });
    return personToUpdate;
  }

  /**
  * Calls skills service to save current skillsSheet
  */
  onSubmitForm() {
    LoggerService.log("submit", LogLevel.DEBUG);
    LoggerService.log(this.currentSkillsSheet, LogLevel.DEBUG);
    this.skillsSheetService.updateSkillsSheet(this.currentSkillsSheet).subscribe(httpResponse => this.currentSkillsSheet.versionNumber += 1) ;
  }

  /**
   * Updates the radar chart for skills
   * @param  arraySkills Array containing updated skills
   */
  updateChartSkills(arraySkills: SkillGraduated[]){
    if (typeof this.skillsChart != "function"){
      this.skillsChart.destroy() ;
    }
    let skillsLabels: string[] = [];
    let skillsData: number[] = [];
    arraySkills.forEach(function(skillGraduated) {
      skillsLabels.push(skillGraduated.skill.name);
      skillsData.push(skillGraduated.grade);
    });
    this.skillsChart = this.createOrUpdateChart(this.formatLabels(skillsLabels,8), skillsData, 'canvasSkills');
    this.skillsArray = arraySkills ;
    this.currentSkillsSheet.skillsList = this.skillsArray.concat(this.softSkillsArray) ;
  }

  /**
   * Updates the radar chart for soft skills
   * @param  arraySkills Array containing updated soft skills
   */
  updateChartSoftSkills(arraySoftSkills: SkillGraduated[]){
    if(typeof this.softSkillsChart != "function"){
      this.softSkillsChart.destroy() ;
    }
    let skillsLabels: string[] = [];
    let skillsData: number[] = [];
    arraySoftSkills.forEach(function(skillGraduated) {
      skillsLabels.push(skillGraduated.skill.name);
      skillsData.push(skillGraduated.grade);
    });
    this.softSkillsChart = this.createOrUpdateChart(this.formatLabels(skillsLabels,8), skillsData, 'canvasSoftSkills');
    this.softSkillsArray = arraySoftSkills ;
    this.currentSkillsSheet.skillsList = this.skillsArray.concat(this.softSkillsArray) ;
  }

  /**
  * Create a radar chart (skills matrix)
  * @param  labels    labels to display on the chart
  * @param  data      data for the chart
  * @param  elementId 'canvasSkills' or 'canvasSoftSkills'
  * @return           a radar chart
  */
  createOrUpdateChart(labels, data, elementId) {
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
        scale: {
          ticks: {
            min: 1,
            max: 4,
            step: 0.5
          }
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
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
  formatLabels(labels, maxwidth){
    let formattedLabels = [];

    labels.forEach(function(label) {
      let sections = [];
      let words = label.split(" ");
      let temp = "";

      words.forEach(function(item, index){
        if(temp.length > 0)
        {
          let concat = temp + ' ' + item;

          if(concat.length > maxwidth){
            sections.push(temp);
            temp = "";
          }
          else{
            if(index == (words.length-1))
            {
              sections.push(concat);
              return;
            }
            else{
              temp = concat;
              return;
            }
          }
        }

        if(index == (words.length-1))
        {
          sections.push(item);
          return;
        }

        if(item.length < maxwidth) {
          temp = item;
        }
        else {
          sections.push(item);
        }

      });
      formattedLabels.push(sections);
    })
    return formattedLabels;
  }


}

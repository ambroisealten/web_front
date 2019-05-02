import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { LogLevel, LoggerService } from 'src/app/services/logger.service';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { Person, PersonRole } from 'src/app/competences/models/person';
import { SkillsSheet, Skill, SkillGraduated, SkillsSheetVersions } from 'src/app/competences/models/skillsSheet';
import { SkillsService } from 'src/app/competences/services/skills.service';
import { ArrayObsService } from 'src/app/competences/services/arrayObs.service';
import { Router } from '@angular/router';
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

  skillsArray: any[] = [];
  skillsDisplayedColumns: string[] = ['skillName', 'grade'];

  softSkillsArray: any[] = [];
  softSkillsDisplayedColumns: string[] = ['skillName', 'grade'];

  headerRowHiddenModif = false;
  headerRowHiddenSkills = true;

  formItems: any[];

  skillsChart = Chart;
  softSkillsChart = Chart;

  currentPerson: Person;
  tmpCurrentPerson: Person;
  currentSkillsSheet: SkillsSheet;

  isEditButtonHidden: boolean = false;
  isPersonDataDisabled: boolean = true;
  isSkillsSheetNameEditable: boolean = false;

  constructor(private skillsService: SkillsService,
              private skillsSheetService: SkillsSheetService,
              private personSkillsService: PersonSkillsService,
              private arrayObsService: ArrayObsService,
              private router: Router) { }

  /**
   * Init : - check if a skillsObservable is present then inits current data (Person and Skills) else redirects to skills home
   *        - init form items of a Person (different inputs whether it's an applicant or a consultant)
   *        - init both charts of skills and soft skills
   */
  ngOnInit() {
    this.skillsService.skillsObservable.subscribe(skills => {
      if(skills == undefined){
        this.router.navigate(['skills']);
      } else {
      this.currentPerson = skills.person ;
      this.currentSkillsSheet = skills.skillsSheet ;
      skills.skillsSheet.skillsList.forEach(skillData => {
        let skillGraduated = new SkillGraduated(skillData.skill, skillData.grade);
        if(skillData.skill.hasOwnProperty('isSoft')){
          this.softSkillsArray.push(skillGraduated);
        } else {
          this.skillsArray.push(skillGraduated);
        }
      });
      this.arrayObsService.notifySkills(this.skillsArray) ;
      this.arrayObsService.notifySoftSkills(this.softSkillsArray) ;
      }
    })
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

    this.arrayObsService.arraySkillsObservable.subscribe(arraySkills => this.updateChartSkills(arraySkills));
    this.arrayObsService.arraySoftSkillsObservable.subscribe(arraySoftSkills => this.updateChartSoftSkills(arraySoftSkills)) ;
    this.arrayObsService.arraySkillsVersionsObservable.subscribe(arraySkillsVersions => this.lastModificationsArray = arraySkillsVersions);

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

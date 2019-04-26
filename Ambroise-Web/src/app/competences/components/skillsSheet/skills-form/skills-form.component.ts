import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { LogLevel, LoggerService } from 'src/app/services/logger.service';
import { MatDialog } from '@angular/material';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { ConfirmationDialogComponent } from 'src/app/utils/confirmation-dialog/confirmation-dialog.component';
import { Person, PersonRole } from 'src/app/competences/models/person';
import { SkillsSheet, Skill } from 'src/app/competences/models/skillsSheet';
import { SkillsService } from 'src/app/competences/services/skills.service';
import { ArrayObsService } from 'src/app/competences/services/arrayObs.service';
import { Router } from '@angular/router';
import { MatTabLinkBase } from '@angular/material/tabs/typings/tab-nav-bar';
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
  lastModifDisplayedColumns: string[] = ['manager', 'date', 'action'];

  skillsArray: any[] = [];
  skillsDisplayedColumns: string[] = ['skillName', 'grade'];

  softSkillsArray: any[] = [];
  softSkillsDisplayedColumns: string[] = ['skillName', 'grade'];

  headerRowHiddenModif = false;
  headerRowHiddenSkills = true;

  formItems: any[];

  skillsChart = Chart;
  softSkillsChart = Chart;

  showPassToConsultant: boolean = true;

  currentPerson: Person;
  tmpCurrentPerson: Person;
  currentSkillsSheet: SkillsSheet;

  avis: string;

  isEditButtonHidden: boolean = false;
  isPersonDataDisabled: boolean = true;
  isSkillsSheetNameEditable: boolean = false;

  constructor(private skillsService: SkillsService,
              private dialog: MatDialog,
              private skillsSheetService: SkillsSheetService,
              private personSkillsService: PersonSkillsService,
              private arrayObsService: ArrayObsService,
              private router: Router) { }

  ngOnInit() {
    this.skillsService.skillsObservable.subscribe(skills => {
      if(skills == undefined){
        this.router.navigate(['skills']);
      } else {
      this.currentPerson = skills.person ;
      this.currentSkillsSheet = skills.skillsSheet ;
      this.lastModificationsArray = this.skillsSheetService.lastModificationsArray;
      skills.skillsSheet.skillsList.forEach(skill => {
        if(skill.hasOwnProperty('isSoft')){
          this.softSkillsArray.push(skill);
        } else {
          this.skillsArray.push(skill)
        }
      });
      this.arrayObsService.notifySkills(this.softSkillsArray) ;
      this.arrayObsService.notifySoftSkills(this.skillsArray)
      }
    })
    let formItemsJSON = require('../../../resources/formItems.json');
    if(this.currentPerson.role == PersonRole.APPLICANT){
      this.formItems = formItemsJSON["candidateFormItems"];
    } else if (this.currentPerson.role.toUpperCase() == PersonRole.CONSULTANT ){
      this.formItems = formItemsJSON["consultantFormItems"]
    } else {
      this.formItems = null ;
    }

    this.arrayObsService.arraySkillsObservable.subscribe(arraySkills => this.updateChartSkills(arraySkills));
    this.arrayObsService.arraySoftSkillsObservable.subscribe(arraySoftSkills => this.updateChartSoftSkills(arraySoftSkills)) ;

  }

  translate(roleName) {
    return roleName.toLowerCase() === 'applicant' ? 'Candidat' : 'Consultant';
  }

  editSkillsSheetName() {
    this.isSkillsSheetNameEditable = true;
  }

  checkIfNameEmpty(event) {
    let newSkillsSheetName = event.target.innerText;
    if(newSkillsSheetName == "") {
      event.target.innerText = this.currentSkillsSheet.name;
    }
    else {
      this.currentSkillsSheet.name = newSkillsSheetName;
    }
  }

  editPerson() {
    this.isEditButtonHidden = true;
    this.isPersonDataDisabled = false;
    this.tmpCurrentPerson = this.currentPerson;
  }

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

  cancelEditPerson() {
    this.isEditButtonHidden = false;
    this.isPersonDataDisabled = true;
    this.currentPerson = this.tmpCurrentPerson;
    this.updateFormItemsFromPerson(this.currentPerson);
  }

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

  updateChartSkills(arraySkills: Skill[]){
    if (typeof this.skillsChart != "function"){
      this.skillsChart.destroy() ;
    }
    let skillsLabels: string[] = [];
    let skillsData: number[] = [];
    arraySkills.forEach(function(skill) {
      skillsLabels.push(skill.name);
      skillsData.push(skill.grade);
    });
    this.skillsChart = this.createOrUpdateChart(this.formatLabels(skillsLabels,8), skillsData, 'canvasSkills');
    this.skillsArray = arraySkills ;
    this.currentSkillsSheet.skillsList = this.skillsArray.concat(this.softSkillsArray) ;
  }

  updateChartSoftSkills(arraySoftSkills: Skill[]){
    if(typeof this.softSkillsChart != "function"){
      this.softSkillsChart.destroy() ;
    }
    let skillsLabels: string[] = [];
    let skillsData: number[] = [];
    arraySoftSkills.forEach(function(skill) {
      skillsLabels.push(skill.name);
      skillsData.push(skill.grade);
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

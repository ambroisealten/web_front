import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { LogLevel, LoggerService } from 'src/app/services/logger.service';
import { MatDialog } from '@angular/material';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { ConfirmationDialogComponent } from 'src/app/utils/confirmation-dialog/confirmation-dialog.component';
import { Person } from 'src/app/competences/models/person';
import { SkillsSheet } from 'src/app/competences/models/skillsSheet';
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

  skillsArray: any[];
  skillsDisplayedColumns: string[] = ['skillName', 'grade'];

  softSkillsArray: any[];
  softSkillsDisplayedColumns: string[] = ['skillName', 'grade'];

  headerRowHiddenModif = false;
  headerRowHiddenSkills = true;

  formItems: any[];

  skillsChart = Chart;
  softSkillsChart = Chart;

  showPassToConsultant: boolean = true;

  currentPerson: Person;
  currentSkillsSheet: SkillsSheet;

  avis: string;

  constructor(private skillsSheetService: SkillsSheetService, private dialog: MatDialog, private personSkillsService: PersonSkillsService) { }

  ngOnInit() {
    this.skillsSheetService.skillsSheetObservable.subscribe(skillsSheet => {
      this.currentPerson = skillsSheet.getPerson() ; 
      this.currentSkillsSheet = skillsSheet ; 
    })

    this.skillsArray = this.currentSkillsSheet.techskills;
    this.softSkillsArray = this.currentSkillsSheet.softskills;

    this.lastModificationsArray = this.skillsSheetService.lastModificationsArray;
    this.formItems = this.skillsSheetService.candidateFormItems;

    this.skillsSheetService.updateSkills(this.currentSkillsSheet.techskills);
    this.skillsSheetService.updateSoftSkills(this.currentSkillsSheet.softskills);

    // init charts
    this.updateChartSkills('skills');
    this.updateChartSkills('softSkills');
  }

  translate(roleName) {
    return roleName === 'applicant' ? 'Candidat' : 'Consultant';
  }

  /**
  * Calls skills service to save current skillsSheet
  */
  onSubmitForm() {
    LoggerService.log("submit", LogLevel.DEBUG);
  }

  /**
  * Pass a candidate to consultant, update form
  */
  passToConsultant() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.dialogMessage = "Confirmez-vous le passage de " + this.currentPerson.name + " " + this.currentPerson.surname + " du statut de candidat à celui de consultant ?";
    dialogRef.componentInstance.dialogTitle = "Confirmation";

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.updatePersonStatus();
      }
      dialogRef = null;
    });
  }

  /**
  * Do changes when passing from applicant to consultant : update form and send change to server with skillsSheetService
  */
  updatePersonStatus() {
    this.formItems = this.skillsSheetService.consultantFormItems;
    this.showPassToConsultant = false;
  }

  /**
  * Function called when an event is received from ArraySkillsComponent
  * @param  $skillType 'skills' or 'softSkills'
  */
  receiveMessage($skillType) {
    switch($skillType) {
      case('skills') :
      {
        this.skillsChart.destroy();
        break;
      }
      case('softSkills') : {
        this.softSkillsChart.destroy();
        break;
      }
    }

    this.updateChartSkills($skillType);
  }

  /**
  * Get current data from skills service and updates the matrix
  * @param  skillType 'skills' or 'softSkills'
  */
  updateChartSkills(skillType) {
    let skillsLabels: string[] = [];
    let skillsData: string[] = [];

    switch(skillType) {
      case('skills') :
      {
        this.skillsSheetService.getSkills().forEach(function(skill) {
          skillsLabels.push(skill.skillName);
          skillsData.push(skill.grade);
        });
        this.skillsChart = this.createOrUpdateChart(this.formatLabels(skillsLabels,8), skillsData, 'canvasSkills');
        break;
      }
      case('softSkills'):
      {
        this.skillsSheetService.getSoftSkills().forEach(function(skill) {
          skillsLabels.push(skill.skillName);
          skillsData.push(skill.grade);
        });
        this.softSkillsChart = this.createOrUpdateChart(this.formatLabels(skillsLabels,8), skillsData, 'canvasSoftSkills');
        break;
      }
      default:
      {
        LoggerService.log('No such skillType ' + skillType, LogLevel.DEBUG);
        break;
      }
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
            min: 0,
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

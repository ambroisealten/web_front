import { Component, OnInit } from '@angular/core';
import { SkillsService } from 'src/app/services/skills.service';
import { Chart } from 'chart.js';
import { LogLevel, LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss']
})
/**
 * Component containing the skillsSheet creation form.
 * @param skillsService service handling back-end communication and data
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

  skillsSheet: any;

  skillsChart = Chart;
  softSkillsChart = Chart;

  constructor(private skillsService: SkillsService) { }

  ngOnInit() {
    this.skillsArray = this.skillsService.skillsArray;
    this.softSkillsArray = this.skillsService.softSkillsArray;
    this.lastModificationsArray = this.skillsService.lastModificationsArray;
    this.formItems = this.skillsService.candidateFormItems;
    this.skillsSheet = this.skillsService.ficheCompetence[0];

    // init charts
    this.updateChartSkills('skills');
    this.updateChartSkills('softSkills');
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
    this.formItems = this.skillsService.consultantFormItems;
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
        this.skillsService.getSkills().forEach(function(skill) {
          skillsLabels.push(skill.skillName);
          skillsData.push(skill.grade);
        });
        this.skillsChart = this.createOrUpdateChart(skillsLabels, skillsData, 'canvasSkills');
        break;
      }
      case('softSkills'):
      {
        this.skillsService.getSoftSkills().forEach(function(skill) {
          skillsLabels.push(skill.skillName);
          skillsData.push(skill.grade);
        });
        this.softSkillsChart = this.createOrUpdateChart(skillsLabels, skillsData, 'canvasSoftSkills');
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
            min: 1,
            max: 4,
            step: 0.5
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

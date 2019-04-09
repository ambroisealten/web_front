import { Component, OnInit } from '@angular/core';
import { SkillsService } from 'src/app/services/skills.service';
import { Chart } from 'chart.js';
import { LogLevel, LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss']
})
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

  skillsChart = [];
  softSkillsChart = [];

  constructor(private skillsService: SkillsService) { }

  ngOnInit() {
    this.skillsArray = this.skillsService.skillsArray;
    this.softSkillsArray = this.skillsService.softSkillsArray;
    this.lastModificationsArray = this.skillsService.lastModificationsArray;
    this.formItems = this.skillsService.candidateFormItems;
    this.skillsSheet = this.skillsService.ficheCompetence[0];
  }

  onSubmitForm() {
    console.log("submit");
  }

  passToConsultant() {
    this.formItems = this.skillsService.consultantFormItems;
  }

  refreshCharts() {
    //  this.updateChartSkills();
  }

  receiveMessage($skillType) {
    this.updateChartSkills($skillType);
    console.log('up');
  }

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
        this.skillsService.getSkills().forEach(function(skill) {
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
        scales: {

        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

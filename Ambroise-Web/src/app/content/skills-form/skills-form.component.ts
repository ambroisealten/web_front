import { Component, OnInit } from '@angular/core';
import { SkillsService } from 'src/app/services/skills.service';
import { Chart } from 'chart.js';

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

  chart = [];

  constructor(private skillsService: SkillsService) { }

  ngOnInit() {
    this.skillsArray = this.skillsService.skillsArray;
    this.softSkillsArray = this.skillsService.softSkillsArray;
    this.lastModificationsArray = this.skillsService.lastModificationsArray;
    this.formItems = this.skillsService.candidateFormItems;
    this.skillsSheet = this.skillsService.ficheCompetence[0];

    this.updateChartSkills();
  }

  onSubmitForm() {
    console.log("submit");
  }

  passToConsultant() {
    this.formItems = this.skillsService.consultantFormItems;
  }

  refreshCharts() {
    this.updateChartSkills();
  }

  updateChartSkills() {
    let skillsLabels: string[] = [];
    let skillsData: string[] = [];

    this.skillsService.getSkills().forEach(function(skill) {
      skillsLabels.push(skill.skillName);
      skillsData.push(skill.grade);
    });

    this.chart = new Chart('canvasSkills', {
      type: 'radar',
      data: {
        labels: skillsLabels,
        datasets: [{
          label: 'Note',
          data: skillsData,
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

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SkillsService } from 'src/app/services/skills.service';

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

  formItems: any[];

  skillsSheet: any;

  headerRowHiddenModif = false;
  headerRowHiddenSkills = true;

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
      console.log('tetet');
  }
}

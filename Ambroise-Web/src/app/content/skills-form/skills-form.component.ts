import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SkillsService } from 'src/app/services/skills.service';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss']
})
export class SkillsFormComponent implements OnInit {

  lastModificationsArray: any;
  lastModifDisplayedColumns: string[] = ['manager', 'date', 'action'];

  skillsArrayDS: any;
  skillsDisplayedColumns: string[] = ['skillName', 'grade'];

  softSkillsArrayDS: any;
  softSkillsDisplayedColumns: string[] = ['skillName', 'grade'];

  headerRowHiddenModif = false;
  headerRowHiddenSkills = true;

  constructor(private skillsService: SkillsService) { }

  ngOnInit() {
    this.skillsArrayDS = new MatTableDataSource(this.skillsService.skillsArray);
    this.softSkillsArrayDS = new MatTableDataSource(this.skillsService.softSkillsArray);
    this.lastModificationsArray = new MatTableDataSource(this.skillsService.lastModificationsArray);
  }

  onSubmitForm() {
    console.log("submit");
  }

  applyFilterSkills(filterValue: string) {
    this.skillsArrayDS.filter = filterValue.trim().toLowerCase();
  }

  applyFilterSoftSkills(filterValue: string) {
    this.softSkillsArrayDS.filter = filterValue.trim().toLowerCase();
  }

}

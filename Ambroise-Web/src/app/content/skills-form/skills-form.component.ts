import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss']
})
export class SkillsFormComponent implements OnInit {

  lastModificationsArray: any[] = [
    {manager: 'Joyce', date: '01/03/19', action: 'Création'},
    {manager: 'Joyce', date: '15/03/19', action: 'Mise à jour'}
  ];
  lastModifDisplayedColumns: string[] = ['manager', 'date', 'action'];
  lastModificationsArrayDS = new MatTableDataSource(this.lastModificationsArray);

  skillsArray: any[] = [
    {category: 'Langage', name: 'Java', grade: '3.5'},
    {category: 'Langage', name: 'C++', grade: '3'}
  ];
  skillsDisplayedColumns: string[] = ['category', 'name', 'grade'];
  skillsArrayDS = new MatTableDataSource(this.skillsArray);

  softSkillsArray: any[] = [
    {category: 'Gestion de projet', name: 'Cycle en V', grade: '3'},
    {category: 'Gestion de projet', name: 'Scrum', grade: '3'}
  ];
  softSkillsDisplayedColumns: string[] = ['category', 'name', 'grade'];
  softSkillsArrayDS = new MatTableDataSource(this.softSkillsArray);

  constructor() { }

  ngOnInit() {
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

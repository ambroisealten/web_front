import { Component, OnInit } from '@angular/core';

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
  displayedColumns: string[] = ['manager', 'date', 'action'];

  constructor() { }

  ngOnInit() {
  }

  onSubmitForm() {
    console.log("submit");
  }

}

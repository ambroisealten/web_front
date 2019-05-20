import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { Person } from 'src/app/competences/models/person';
import { PageSkillsHomeComponent } from '../../accueil/page-skills-home/page-skills-home.component';
import { SkillsSheet } from 'src/app/competences/models/skillsSheet';

@Component({
  selector: 'app-modal-new-skills-sheet',
  templateUrl: './modal-new-skills-sheet.component.html',
  styleUrls: ['./modal-new-skills-sheet.component.scss']
})
export class ModalNewSkillsSheetComponent implements OnInit {

  name: string;

  currentPerson: Person;
  currentSkillsSheet: SkillsSheet;
  newSkillsSheet: PageSkillsHomeComponent;


  constructor(private dialogRef: MatDialogRef<ModalNewSkillsSheetComponent>) { }

  ngOnInit() {

  }

  saveName() {
    if (this.name != null ||this.name != ""){
      this.dialogRef.close();
    }
    console.log(this.name);
  }

  checkname(event: any) {
  }
}

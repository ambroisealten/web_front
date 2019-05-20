import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";
@Component({
  selector: 'app-modal-new-skills-sheet',
  templateUrl: './modal-new-skills-sheet.component.html',
  styleUrls: ['./modal-new-skills-sheet.component.scss']
})
export class ModalNewSkillsSheetComponent implements OnInit {

  name: string;

  constructor(private dialogRef: MatDialogRef<ModalNewSkillsSheetComponent>) { }

  ngOnInit() {

  }

  saveName() {

  }
}

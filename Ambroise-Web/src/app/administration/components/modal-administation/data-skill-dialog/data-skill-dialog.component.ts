import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-data-skill-dialog',
  templateUrl: './data-skill-dialog.component.html',
  styleUrls: ['./data-skill-dialog.component.scss']
})
export class DataSkillDialogComponent implements OnInit {

  form: FormGroup;
  name: string;
  synonymous: string[];
  replaceWith: string;
  description: string;
  instructionMessage: string;

  valide: boolean = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DataSkillDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataSkill) {
    this.instructionMessage = "";
    this.name = dataSkill.name;
    this.synonymous = dataSkill.synonymous;
    this.replaceWith = dataSkill.replaceWith;
    this.description = dataSkill.description;
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.name, []],
      synonymous: [this.synonymous, []],
      replaceWith: [this.replaceWith, []],
    });
    this.checkField();
  }

  onChange() {
    this.checkField();
  }

  checkField() {
    let n = this.form.value;

    if (!n.synonymous && !n.replaceWith) {
      this.valide = true;
      this.instructionMessage = "Entrez une liste de synonymes séparées par des virgules, ou bien un remplacement";
    } else if (n.replaceWith === n.name || n.synonymous === n.name) {
      this.valide = true;
      this.instructionMessage = "Veuillez changer la valeur du champs";
    } else if (!n.synonymous && n.replaceWith) {
      this.instructionMessage = "Entrez une liste de synonymes séparées par des virgules, ou bien un remplacement";
      this.valide = false;
    } else if (n.synonymous && !n.replaceWith) {
      this.instructionMessage = "Entrez une liste de synonymes séparées par des virgules, ou bien un remplacement";
      this.valide = false;
    } else if (n.synonymous && n.replaceWith) {
      this.valide = true;
      this.instructionMessage = "Ne remplissez pas les deux champs";
    }
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}

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
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DataSkillDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataSkill) {
    this.errorMessage = "";
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
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}

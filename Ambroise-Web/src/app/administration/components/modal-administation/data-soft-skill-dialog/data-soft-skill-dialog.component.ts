import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SoftSkill } from '../../../models/SoftSkill';

@Component({
  selector: 'app-data-soft-skill-dialog',
  templateUrl: './data-soft-skill-dialog.component.html',
  styleUrls: ['./data-soft-skill-dialog.component.scss']
})
export class DataSoftSkillDialogComponent implements OnInit {

  form: FormGroup;
  name: string;
  description: string;
  errorMessage: string;

  tmpSoftSkills: any[];

  valide: boolean = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DataSoftSkillDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataSoftSkill) {
    this.errorMessage = "";
    this.name = dataSoftSkill.name;
    this.description = dataSoftSkill.description;
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.name, []],
    });

    this.tmpSoftSkills = JSON.parse(window.sessionStorage.getItem('softSkills')) as SoftSkill[];
  }

  onChange() {
    if (this.name == "") {
      this.errorMessage = "Veuillez entrer un nom";
      this.valide = true;
    }
    else if (this.tmpSoftSkills.find(softSkill => softSkill.name === this.name) !== undefined) {
      this.errorMessage = "Ce Soft Skill existe déjà";
      this.valide = true;
    }
    else {
      this.errorMessage = "";
      this.valide = false;
    }
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}

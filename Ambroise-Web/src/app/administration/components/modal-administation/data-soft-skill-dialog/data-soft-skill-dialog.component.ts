import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-data-soft-skill-dialog',
  templateUrl: './data-soft-skill-dialog.component.html',
  styleUrls: ['./data-soft-skill-dialog.component.scss']
})
export class DataSoftSkillDialogComponent implements OnInit {

  form: FormGroup;
  name: string;
  description: string;

  valide: boolean = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DataSoftSkillDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataSoftSkill) {

    this.name = dataSoftSkill.name;
    this.description = dataSoftSkill.description;
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.name, []],
    });
  }

  onChange() {
    if (this.name == "") {
      this.valide = true;
    }
    else {
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

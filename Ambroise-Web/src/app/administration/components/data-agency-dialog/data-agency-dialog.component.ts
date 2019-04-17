import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-data-agency-dialog',
  templateUrl: './data-agency-dialog.component.html',
  styleUrls: ['./data-agency-dialog.component.scss']
})
export class DataAgencyDialogComponent implements OnInit {

  form: FormGroup;
  name: string;
  place: string;
  placeType: string;
  description: string;


  placeTypes: string[] = ['City', 'Region', 'Departement'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DataAgencyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataAgency) {

    this.name = dataAgency.name;
    this.place = dataAgency.place;
    this.placeType = dataAgency.placeType;
    this.description = dataAgency.description;
  }

  changePlaceType(value) {
    this.form.value.placeType = value;
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.name, []],
      place: [this.place, []],
      placeType: [this.placeType, []],
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
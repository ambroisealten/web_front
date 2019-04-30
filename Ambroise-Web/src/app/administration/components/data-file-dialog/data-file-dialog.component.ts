import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-data-file-dialog',
  templateUrl: './data-file-dialog.component.html',
  styleUrls: ['./data-file-dialog.component.scss']
})
export class DataFileDialogComponent implements OnInit {

  form: FormGroup;
  path: string;
  displayName: string;
  description: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DataFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataFile) {

      this.path = dataFile.path;
      this.displayName = dataFile.displayName;
      this.description = dataFile.description;

  }

  changePlaceType(value) {
    this.form.value.placeType = value;
  }

  ngOnInit() {
    this.form = this.fb.group({
      displayName: [this.displayName, []],
      path: [this.path, []],
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}


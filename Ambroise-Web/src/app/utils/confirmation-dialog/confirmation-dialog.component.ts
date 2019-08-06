import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  dialogTitle: string;
  dialogMessage: string;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) { }

  ngOnInit() {
  }

}

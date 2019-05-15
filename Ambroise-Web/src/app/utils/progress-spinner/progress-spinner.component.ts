import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent implements OnInit {

  static value = 0;
  static mode = 'indeterminate';

  constructor() { }

  static openDialogProgress(dialog) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.direction = 'ltr';
    dialogConfig.closeOnNavigation = true;

    dialogConfig.data = {
      id: 1,
      title: 'Please wait',
      description: 'Please wait',
    };

    return dialog.open(ProgressSpinnerComponent, dialogConfig);
  }

  static openDialogProgressDeterminate(dialog, progressObservable: Observable<number>) {
    const dialogConfig = new MatDialogConfig();
    ProgressSpinnerComponent.mode = 'determinate';
    progressObservable.subscribe(value => {
      ProgressSpinnerComponent.value = value;
    });

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.direction = 'ltr';
    dialogConfig.closeOnNavigation = true;

    dialogConfig.data = {
      id: 1,
      title: 'Please wait',
      description: 'Please wait',
    };

    return dialog.open(ProgressSpinnerComponent, dialogConfig);
  }

  ngOnInit() { }
}

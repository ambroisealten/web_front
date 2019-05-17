import { Component, OnInit } from '@angular/core';
import { DateAdapter, MatDialogRef } from '@angular/material';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';

@Component({
  selector: 'app-modal-availability',
  templateUrl: './modal-availability.component.html',
  styleUrls: ['./modal-availability.component.scss']
})
export class ModalAvailabilityComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ModalAvailabilityComponent>,
    private adapter: DateAdapter<any>) { }

  ngOnInit() {
    this.adapter.setLocale('fr');
  }


  /**
   * On click on cancel button : close dialog with value 'canceled'
   */
  cancel() {
    this.dialogRef.close('canceled');
  }

  save() {
    LoggerService.log("saved", LogLevel.DEBUG);
  }
}

import { Component, OnInit } from '@angular/core';
import { DateAdapter, MatDialogRef } from '@angular/material';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { DurationType, OnDateAvailability, OnTimeAvailibility } from 'src/app/competences/models/person';

@Component({
  selector: 'app-modal-availability',
  templateUrl: './modal-availability.component.html',
  styleUrls: ['./modal-availability.component.scss']
})
export class ModalAvailabilityComponent implements OnInit {

  initDate: number;
  finalDate: number;
  duration: number;
  durationType: DurationType;

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
    if(this.initDate != undefined && this.finalDate != undefined) {
      // convert dates to milliseconds
      let init = new Date(this.initDate).getTime();
      let final = new Date(this.finalDate).getTime();
      // create and init object OnDateAvailability
      let onDateAvailability = new OnDateAvailability();
      onDateAvailability.finalDate = final;
      onDateAvailability.initDate = init;
      // close with new object
      this.dialogRef.close(onDateAvailability);
    }
    else if(this.duration != undefined && this.durationType != undefined) {
      // create and init object OnTimeAvailability
      let onTimeAvailibility = new OnTimeAvailibility();
      onTimeAvailibility.duration = this.duration;
      onTimeAvailibility.durationType = this.durationType;
      // close with new object
      this.dialogRef.close(onTimeAvailibility);
    }

  }
}

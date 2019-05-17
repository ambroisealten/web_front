import { Component, OnInit } from '@angular/core';
import { DateAdapter, MatDialogRef } from '@angular/material';
import { DurationType, OnDateAvailability, OnTimeAvailability } from 'src/app/competences/models/person';

@Component({
  selector: 'app-modal-availability',
  templateUrl: './modal-availability.component.html',
  styleUrls: ['./modal-availability.component.scss']
})
export class ModalAvailabilityComponent implements OnInit {

  initDate: number;
  finalDate: number;
  duration: number;
  durationType: string;

  constructor(private dialogRef: MatDialogRef<ModalAvailabilityComponent>,
    private adapter: DateAdapter<any>) { }

  ngOnInit() {
    this.adapter.setLocale('fr');
  }

  save() {
    if(this.initDate != undefined) {
      // create object OnDateAvailability
      let onDateAvailability = new OnDateAvailability();

      // convert dates to milliseconds
      let init = new Date(this.initDate).getTime();
      if(this.finalDate != undefined) {
        let final = new Date(this.finalDate).getTime();
        onDateAvailability.finalDate = final;
      }

      onDateAvailability.initDate = init;
      // close with new object
      this.dialogRef.close(onDateAvailability);
    }
    else if(this.duration != undefined && this.durationType != undefined) {
      // create and init object OnTimeAvailability
      let onTimeAvailability = new OnTimeAvailability();
      onTimeAvailability.initDate = new Date().getTime();
      onTimeAvailability.duration = this.duration;
      onTimeAvailability.durationType = this.durationType;
      // close with new object
      this.dialogRef.close(onTimeAvailability);
    }

  }
}

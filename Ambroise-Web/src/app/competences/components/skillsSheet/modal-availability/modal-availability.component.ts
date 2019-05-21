import { Component, OnInit } from '@angular/core';
import { DateAdapter, MatDialogRef } from '@angular/material';
import { Availability } from 'src/app/competences/models/person';

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

  currentDate : string;
  dateMin : string;

  isFirstPanelDisabled: boolean = false;
  isSecondPanelDisabled: boolean = true;

  constructor(private dialogRef: MatDialogRef<ModalAvailabilityComponent>,
    private adapter: DateAdapter<any>) {
      this.dateMin = this.formatDate(new Date());
      this.currentDate = this.formatDate(new Date());
     }

  ngOnInit() {
    this.adapter.setLocale('fr');
  }

  reloadDateMin(){
    if(this.initDate != undefined){
      this.dateMin = this.formatDate(new Date(this.initDate));
    }
  }

  saveFirstPanel() {
    if(this.initDate != undefined) {
      // create object Availability
      let availability = new Availability();

      // convert dates to milliseconds
      let init = new Date(this.initDate).getTime();
      if(this.finalDate != undefined) {
        let final = new Date(this.finalDate).getTime();
        availability.finalDate = final;
      }
      availability.duration = 0;
      availability.initDate = init;
      
      // close with new object
      this.dialogRef.close(availability);
    }
  }

 formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

  saveSecondPanel() {
    if(this.duration != undefined && this.durationType != undefined) {
      // create and init object Availability
      let availability = new Availability();
      availability.initDate = new Date().getTime();
      availability.duration = this.duration;
      availability.durationType = this.durationType;
      // close with new object
      this.dialogRef.close(availability);
    }
  }

  enableFirstPanel() {
    this.isFirstPanelDisabled = false;
    this.isSecondPanelDisabled = true;
  }

  enableSecondPanel() {
    this.isSecondPanelDisabled = false;
    this.isFirstPanelDisabled = true;
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SkillsSheet } from '../../../models/skillsSheet';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-skills-candidate',
  templateUrl: './modal-skills-candidate.component.html',
  styleUrls: ['./modal-skills-candidate.component.scss']
})
export class ModalSkillsCandidateComponent implements OnInit {

  //firstname: string;
  //lastname: string;
  //skillsSheetName: string = '';
  email: string;
  //role: boolean = false;

  //firstnameFirstletter: string = '';
  //lastnameFirstLetters: string = '';

  constructor(private dialogRef: MatDialogRef<ModalSkillsCandidateComponent>, private router: Router, private skillsSheetService: SkillsSheetService) { }

  ngOnInit() {
    //this.updateSkillsSheetName();
  }

/*  updateSkillsSheetName() {
    let month = String("0" + (new Date().getMonth()+1)).slice(-2);
    let year = new Date().getFullYear();
    this.skillsSheetName =  month + year + '-' + this.firstnameFirstletter + this.lastnameFirstLetters;
  }

  firstnameChanged($event) {
    this.firstnameFirstletter = $event[0].toUpperCase();
    this.firstname = $event; // update firstname value with input

    this.updateSkillsSheetName();
  }

  lastnameChanged($event) {
    if($event.length >= 2) {
      this.lastnameFirstLetters = $event[0].toUpperCase() + $event[1].toUpperCase();
      this.lastname = $event; // update lastname value with input

      this.updateSkillsSheetName();
    }
  }*/

  emailChanged($event) {
    let emailPattern = "^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$";
    if($event.match(emailPattern)) {
      this.skillsSheetService.checkSkillsSheetExistenceByMail($event).subscribe(skillsSheetExists => {
        if(skillsSheetExists)
          console.log('exists');
        else
          console.log('new');
      });
    }
  }

  cancel() {
    this.dialogRef.close('canceled');
  }

  save() {
    //let personRole = this.role ? PersonRole.CONSULTANT : PersonRole.APPLICANT;

    //let newPerson: Person = new Person(this.lastname, this.firstname, this.email, personRole);

    this.dialogRef.close('saved');//newPerson);
  }

}

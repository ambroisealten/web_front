import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SkillsSheet } from '../../../models/skillsSheet';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { Router } from '@angular/router';
import { Validators, FormControl } from '@angular/forms';
import { Person, PersonRole } from 'src/app/competences/models/person';
import { PersonSkillsService } from 'src/app/competences/services/personSkills.service';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Skills } from 'src/app/competences/models/skills';

@Component({
  selector: 'app-modal-skills-candidate',
  templateUrl: './modal-skills-candidate.component.html',
  styleUrls: ['./modal-skills-candidate.component.scss']
})
export class ModalSkillsCandidateComponent implements OnInit {

  firstname: string;
  lastname: string;
  skillsSheetName: string = '';
  email: string;
  emailValidator =  new FormControl('', [Validators.required, Validators.email]);
  skillsSheetExists: boolean = false;
  skillsSheetPerson: Person;
  role: boolean = false;

  firstnameFirstletter: string = '';
  lastnameFirstLetters: string = '';

  constructor(private dialogRef: MatDialogRef<ModalSkillsCandidateComponent>,
    private router: Router,
    private skillsSheetService: SkillsSheetService,
    private personSkillsService: PersonSkillsService
  ) { }

  ngOnInit() {
    this.updateSkillsSheetName();
  }

  updateSkillsSheetName() {
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
  }

  emailChanged($event, emailForm) {
    let emailPattern = "^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$";
    if($event.match(emailPattern)) {
      this.skillsSheetService.checkSkillsSheetExistenceByMail($event).subscribe(skillsSheetExists => {
        if(skillsSheetExists) {
          this.skillsSheetExists = true;
        //  this.emailValidator.setErrors({'exists' : true});
        }
        else {
          this.skillsSheetExists = false;
          //this.emailValidator.setErrors({'exists' : false});
        }
      });
    }
  }

  getErrorMessage() {
    //console.log(this.emailValidator.invalid);
    return 'oui';/*this.emailValidator.hasError('required') ? 'Email obligatoire' :
           this.emailValidator.hasError('email') ? 'Email invalide' :
            '';*/
  }

  cancel() {
    this.dialogRef.close('canceled');
  }

  save() {
    let personRole = this.role ? PersonRole.CONSULTANT : PersonRole.APPLICANT;
    if(this.skillsSheetExists) {
      return;
    }
    else {
      this.personSkillsService.getPersonByMail(this.email).subscribe(person => {
        if(person != undefined) {
          if(person.hasOwnProperty('mail')) { // person exists
            //ERROR
          }
          else { // create person
            this.dialogRef.close(new Person(this.firstname, this.lastname, this.email, personRole));
          }
        }
      });
    }
  }

}
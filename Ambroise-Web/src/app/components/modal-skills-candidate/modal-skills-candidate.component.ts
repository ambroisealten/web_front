import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Person, PersonRole } from 'src/app/models/person';
import { SkillsSheet } from 'src/app/models/skillsSheet';

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
  role: boolean = false;

  firstnameFirstletter: string = '';
  lastnameFirstLetters: string = '';

  constructor(private dialogRef: MatDialogRef<ModalSkillsCandidateComponent>, private formBuilder: FormBuilder) { }

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

  cancel() {
    this.dialogRef.close('canceled');
  }

  save() {
    let personRole = this.role ? PersonRole.APPLICANT : PersonRole.CONSULTANT;

    let newPerson: Person = new Person(this.lastname, this.firstname, this.email, personRole);

    let skillsSheet: SkillsSheet = new SkillsSheet(this.skillsSheetName, newPerson);

    let result: any[] = [];
    result.push(newPerson);
    result.push(skillsSheet);

    this.dialogRef.close(result);
  }

}

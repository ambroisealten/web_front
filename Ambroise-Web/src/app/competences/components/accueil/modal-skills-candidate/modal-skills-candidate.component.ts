import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SkillsSheet } from '../../../models/skillsSheet';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { Person, PersonRole } from 'src/app/competences/models/person';
import { PersonSkillsService } from 'src/app/competences/services/personSkills.service';
import { Skills } from 'src/app/competences/models/skills';

@Component({
  selector: 'app-modal-skills-candidate',
  templateUrl: './modal-skills-candidate.component.html',
  styleUrls: ['./modal-skills-candidate.component.scss']
})
export class ModalSkillsCandidateComponent implements OnInit {

  firstname: string = '';
  lastname: string = '';
  skillsSheetName: string = '';
  emailInput: string = '';
  skillsSheetExists: boolean = false;
  skillsSheetPerson: Person;
  role: boolean = false;

  firstnameFirstletter: string = '';
  lastnameFirstLetters: string = '';

  isCreateButtonDisabled: boolean = true;

  constructor(private dialogRef: MatDialogRef<ModalSkillsCandidateComponent>,
    private skillsSheetService: SkillsSheetService,
    private personSkillsService: PersonSkillsService
  ) { }

  ngOnInit() {
    this.updateSkillsSheetName();
  }

  /**
   * Updates skillsSheetName when input changed to set default name
   */
  updateSkillsSheetName() {
    let month = String("0" + (new Date().getMonth()+1)).slice(-2);
    let year = new Date().getFullYear();
    this.skillsSheetName =  month + year + '-' + this.firstnameFirstletter + this.lastnameFirstLetters;
  }

  /**
   * Updates data when input changed to set default skillsSheetName
   * @param  $event firstname input
   */
  firstnameChanged($event) {
    this.firstnameFirstletter = $event[0].toUpperCase();
    this.firstname = $event; // update firstname value with input

    this.updateSkillsSheetName();
  }

  /**
   * Updates data when input changed to set default skillsSheetName
   * @param  $event lastname input
   */
  lastnameChanged($event) {
    if($event.length >= 2) {
      this.lastnameFirstLetters = $event[0].toUpperCase() + $event[1].toUpperCase();
      this.lastname = $event; // update lastname value with input

      this.updateSkillsSheetName();
    }
  }

  /**
   * Checks if email exists and already has a skillsSheet
   * @param  $event email input
   */
  emailChanged($event) {
    let emailPattern = "^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$";
    if($event.match(emailPattern)) {
      this.skillsSheetService.getSkillsSheetsByMail($event).subscribe(skillsSheetList => {
        if(skillsSheetList != undefined) {
          let list = skillsSheetList as SkillsSheet[];
          if( list.length != 0) {
            this.skillsSheetExists = true;
          }
          else {
            this.skillsSheetExists = false;
          }
        }
      });
    }
  }

  checkEnableCreateButton() {
    let emailPattern = "^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$";

    if(this.firstname != '' && this.lastname != '' && this.emailInput != '' && this.emailInput.match(emailPattern)) {
      this.isCreateButtonDisabled = false;
    }
  }

  /**
   * On click on cancel button : close dialog with value 'canceled'
   */
  cancel() {
    this.dialogRef.close('canceled');
  }

  /**
   * On click on create button : close dialog with object Skills containing the created Person and an empty skillSheet
   */
  save(isNewSkillsSheet) {
    let personRole = this.role ? PersonRole.CONSULTANT : PersonRole.APPLICANT;
    this.personSkillsService.getPersonByMail(this.emailInput).subscribe(person => {
      if(person != undefined) {
        let newPerson : Person;
        if(person.hasOwnProperty('mail')) { // person exists
          newPerson = person as Person;
        }
        else { // create person
          newPerson = new Person(this.firstname, this.lastname, this.emailInput, personRole);
        }

        let skillsSheet : SkillsSheet;
        if(isNewSkillsSheet) { // create skillsSheet
          let newSkillsSheet = new SkillsSheet(this.skillsSheetName, newPerson);
          let defaultSoftSkills = require('../../../resources/defaultSoftSkills.json');
          newSkillsSheet.skillsList = defaultSoftSkills['softSkillsList'];
          this.dialogRef.close(new Skills(newPerson, newSkillsSheet));
        }
        else { // skillsSheet exists
          this.closeWithExistantSkillsSheet(newPerson);
        }
      }
    });
  }

  closeWithExistantSkillsSheet(person: Person) {
    console.log("ICI")
    this.skillsSheetService.getSkillsSheetsByMail(this.emailInput).subscribe(skillsSheetsList => {
      if(skillsSheetsList != undefined) {
        this.dialogRef.close(new Skills(person, skillsSheetsList[0] as SkillsSheet));
      }
    })
  }

}

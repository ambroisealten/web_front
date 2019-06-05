import { Component, OnInit } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/competences/components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { MatDialogRef } from '@angular/material/dialog';


export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-data-user-management-dialog',
  templateUrl: './data-user-management-dialog.component.html',
  styleUrls: ['./data-user-management-dialog.component.scss']
})


export class DataUserManagementDialogComponent implements OnInit {

  forName: string = '';
  name: string= '';
  emailInput: string= '';
  role: boolean = false;

  isCreateButtonDisabled: boolean = true;

  constructor(private dialogRef: MatDialogRef<ModalSkillsCandidateComponent>, ) { }

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  
  ngOnInit() {
  }


  
}

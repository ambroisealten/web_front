import { Component, OnInit } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/competences/components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { MatDialogRef } from '@angular/material/dialog';
import { User, UserRole } from 'src/app/administration/models/User';
import { MatTableDataSource } from '@angular/material';


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

  users: string[];
  usersSources: MatTableDataSource<any[]> = new MatTableDataSource();
  
  isCreateButtonDisabled: boolean = true;

  constructor(private dialogRef: MatDialogRef<ModalSkillsCandidateComponent>, ) { }

  ngOnInit() {
    this.users = Object.keys(UserRole);
  }

  getRole() {

  }


  
}

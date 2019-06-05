import { Component, OnInit } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/competences/components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { MatDialogRef } from '@angular/material/dialog';
import { User, UserRole } from 'src/app/administration/models/User';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-data-user-management-dialog',
  templateUrl: './data-user-management-dialog.component.html',
  styleUrls: ['./data-user-management-dialog.component.scss']
})

export class DataUserManagementDialogComponent implements OnInit {

  form: FormGroup;
  forname: string = '';
  name: string= '';
  emailInput: string= '';
  role: boolean = false;

  users: string[];
  usersSources: MatTableDataSource<any[]> = new MatTableDataSource();
  
  isCreateButtonDisabled: boolean = true;
  valide: boolean = true;
  errorMessage: string;


  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DataUserManagementDialogComponent> ) { }

  ngOnInit() {
    this.users = Object.keys(UserRole);
    this.form = this.fb.group({
      name: [this.name, []],
      forname: [this.forname, []],
      mail: [this.emailInput, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      role: [this.role, []],
    })
  }

  onChange() {
    if (this.name == "" || this.forname == "" || this.emailInput == "") {
      this.valide = true;
    }
    else {
      this.errorMessage = "";
      this.valide = false;
    }
  }
  
  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }


  
}

import { Component, OnInit } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/competences/components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRole } from '../../../models/User';


@Component({
  selector: 'app-data-user-management-dialog',
  templateUrl: './data-user-management-dialog.component.html',
  styleUrls: ['./data-user-management-dialog.component.scss']
})

export class DataUserManagementDialogComponent implements OnInit {
  description: string = "Création d'un utilisateur";

  form: FormGroup;
  forname: string = '';
  name: string= '';
  emailInput: string= '';
  pswd: string = '';
  role: string = "CONSULTANT";

  roles: string[];
  usersSources: MatTableDataSource<any[]> = new MatTableDataSource();
  
  isCreateButtonDisabled: boolean = true;
  valide: boolean = true;
  errorMessage: string;


  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DataUserManagementDialogComponent> ) { }

  ngOnInit() {
    this.roles = Object.keys(UserRole);
    this.form = this.fb.group({
      name: [this.name, []],
      forname: [this.forname, []],
      pswd : [this.pswd,[]],
      mail: [this.emailInput, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      role: [this.role, []],
    })
  }


  onChange() {
    if (this.name == "" || this.forname == "" || this.emailInput == "" || this.pswd == "") {
      this.valide = true;
    }
    else {
      this.errorMessage = "";
      this.valide = false;
    }
  }

  onValueChange(){
    console.log(this.role) ; 
  }
  
  save() {
    console.log(this.form.value);
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }


  
}

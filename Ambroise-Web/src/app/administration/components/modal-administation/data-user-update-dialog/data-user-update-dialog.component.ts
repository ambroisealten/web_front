import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { DataUserManagementDialogComponent } from '../data-user-management-dialog/data-user-management-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRole } from 'src/app/administration/models/User';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';

@Component({
  selector: 'app-data-user-update-dialog',
  templateUrl: './data-user-update-dialog.component.html',
  styleUrls: ['./data-user-update-dialog.component.scss']
})
export class DataUserUpdateDialogComponent implements OnInit {

  description: string = "Mise à jour";

  form: FormGroup;
  forname: string = '';
  name: string = '';
  emailInput: string = '';
  role: string = "CONSULTANT";

  roles: string[];
  usersSources: MatTableDataSource<any[]> = new MatTableDataSource();

  isCreateButtonDisabled: boolean = true;
  valide: boolean = true;
  errorMessage: string;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DataUserUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataUser) {
    this.errorMessage = "";
    this.name = dataUser.name;
    this.forname = dataUser.forName;
    this.emailInput = dataUser.email;
    this.role = dataUser.role;
  }

  ngOnInit() {
    this.roles = Object.keys(UserRole);
    this.form = this.fb.group({
      name: [this.name, []],
      forname: [this.forname, []],
      mail: [this.emailInput, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      role: [this.role, []],
    })
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}

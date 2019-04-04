import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as sha512 from 'js-sha512';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // used to set validators
  validationForm: FormGroup;
  submitted = false;

  userEmail: string;
  userPswd: string;

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit() {
    // init validators
    this.validationForm =this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")]],
      password: ['', [Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  get validationFormControls() { return this.validationForm.controls; }

  /**
    Sends http request with email and password when login form is submitted
  **/
  onConnect() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.validationForm.invalid) {
      return;
    }

    // init values with form
    this.userEmail = this.validationForm.value.email;
    this.userPswd = this.validationForm.value.password;

    // password hash with sha512 before POST request
    let postParams = {
      mail: this.userEmail,
      pswd: sha512.sha512(this.userPswd),
    }

    /** TODO call login Web service with postParams **/
  }

}

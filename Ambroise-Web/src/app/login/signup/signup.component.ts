import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as sha512 from 'js-sha512';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../../utils/must-match.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  // used to set validators
  validatingForm: FormGroup;
  submitted = false;

  userName: string;
  userFirstName: string;
  userEmail: string;
  userPswd: string;

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit() {
    // init validators
    this.validatingForm =this.formBuilder.group({
      name: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordCheck: ['', [Validators.required]]
    }, {
      validator: MustMatch('password', 'passwordCheck')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.validatingForm.controls; }

  /**
    Sends http request with user info when signup form is submitted
  **/
  onSignup() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.validatingForm.invalid) {
      return;
    }

    // init values with form
    this.userName = this.validatingForm.value.name;
    this.userFirstName = this.validatingForm.value.firstname;
    this.userEmail = this.validatingForm.value.email;
    this.userPswd = sha512.sha512(this.validatingForm.value.password);

    // password hash with sha512 before POST request
    let postParams = {
      mail: this.userEmail,
      pswd: sha512.sha512(this.userPswd),
      name: this.userName,
      firstname: this.userFirstName
    }

    // TODO change server ip
    // send user info to server
    /*this.httpClient.post('http://localhost:8080/login', postParams).subscribe(data => {
      // TODO redirect to application home
    }, error => {
      console.log(error); // if error getting the data
    });*/
  }

}

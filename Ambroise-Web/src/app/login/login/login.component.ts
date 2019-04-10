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
  validatingForm: FormGroup;
  submitted = false;

  userEmail: string;
  userPswd: string;

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit() {
    // init validators
    this.validatingForm =this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.validatingForm.controls; }

  /**
    Sends http request with email and password when login form is submitted
  **/
  onConnect() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.validatingForm.invalid) {
      return;
    }

    // init values with form
    this.userEmail = this.validatingForm.value.email;
    this.userPswd = sha512.sha512(this.validatingForm.value.password);

    // password hash with sha512 before POST request
    let postParams = {
      mail: this.userEmail,
      pswd: sha512.sha512(this.userPswd),
    }

    // TODO change server ip
    // send mail and hashed pswd to server and add received token to sessionStorage
  /*  this.httpClient.post('http://localhost:8080/login', postParams).subscribe(data => {
      window.sessionStorage.setItem("bearerToken",JSON.parse(JSON.stringify(data))["token"]);
    }, error => {
      console.log(error); // if error getting the data
    });*/
  }

}

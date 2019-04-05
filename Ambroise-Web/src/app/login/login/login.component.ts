import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as sha512 from 'js-sha512';
import { AuthService } from 'src/app/services/auth.service';
import { timeout } from 'q';

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

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder,
    private authService: AuthService) { }

  ngOnInit() {
    // init validators
    this.validationForm = this.formBuilder.group({
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
    console.log('form validated');
    this.authService.signIn(this.validationForm.value.email, this.validationForm.value.password,(result:String)=>{
      console.log(result);

    });

   /* setTimeout(() => {
      this.authService.redirectToHomePage();
    }, 2000)*/

  }

}

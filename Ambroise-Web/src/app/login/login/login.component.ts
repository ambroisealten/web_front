import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as sha512 from 'js-sha512';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { reject, resolve } from 'q';


@Component({
  selector: 'app-login-aync',
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
    private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // init validators
    this.validationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")]],
      password: ['', [Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  get validationFormControls() { return this.validationForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.validationForm.invalid) {
      return;
    }

    this.authService.signIn(this.validationForm.value.email, this.validationForm.value.password)
    this.authService.tokenReceptionObservable.subscribe(tokenReceived => {

      console.log("boolean : "+tokenReceived);
      if(tokenReceived){
        this.redirectToHomePage();
      }


    })

  }

  redirectToHomePage() {
    //  TO-DO : Creer un service de redirection
    //  changer la redirection après connection en fonction du module de préférence
    //  de l'utilisateur (Mission par défaut)
    this.router.navigate(['content']);
  }



}

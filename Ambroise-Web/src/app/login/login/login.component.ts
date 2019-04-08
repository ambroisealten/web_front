import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as sha512 from 'js-sha512';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


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
    private authService: AuthService, private router : Router) { }

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
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.validationForm.invalid) {
      return;
    }
    return new Promise(
      (resolve, reject) => {
        setTimeout(() => resolve(1), 5000);
        let sub = this.authService.signIn(this.validationForm.value.email, this.validationForm.value.password)
          .subscribe(data => {

            if (data != null) {
              window.sessionStorage.setItem("bearerToken", JSON.parse(JSON.stringify(data))["token"]);
              this.router.navigate(['content']);
              resolve('Token reçu');
            }

          }, error => {
            switch (error.status) {
              case 0: alert("500 : internal server error"); break;
              case 403: alert("identifiant/mdp incorrect"); break;
              default: console.log("Nouvelle erreur pas dans le switch case" + error);
            }
          });
      }
    ).catch(error => { console.log(error) });

  }

}

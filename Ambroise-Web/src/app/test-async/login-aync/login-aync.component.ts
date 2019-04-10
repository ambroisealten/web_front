import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as sha512 from 'js-sha512';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { reject, resolve } from 'q';


@Component({
  selector: 'app-login-aync',
  templateUrl: './login-aync.component.html',
  styleUrls: ['./login-aync.component.scss']
})
export class LoginAyncComponent implements OnInit {

  // used to set validators
  validationForm: FormGroup;
  submitted = false;
  token;

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
    return new Promise(
      (resolve, reject) => {
        setTimeout(() => resolve(1), 5000);
        let sub = this.authService.signIn(this.validationForm.value.email, this.validationForm.value.password)
          .subscribe(data => {

            console.log("data in promise : " + data);
            //window.sessionStorage.setItem("bearerToken", JSON.parse(JSON.stringify(data))["token"]);
            this.token = data;
            if (this.token != null) {
              window.sessionStorage.setItem("bearerToken", JSON.parse(JSON.stringify(this.token))["token"]);
              console.log("data in then : " + this.token);
              this.router.navigate(['content']);
              resolve('Token reçu');
            }

          }, error => {
            switch (error.status) {
              case 0: alert("500 : internal server error"); break;
              case 403: alert("identifiant/mdp incorrect"); break;
              default: console.log("HEIN?  "+error); break;
            }
          });
      }
    ).catch(error => { console.log(error) });

  }
}

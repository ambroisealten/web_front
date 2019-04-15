import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';

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

  constructor(private formBuilder: FormBuilder,
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

    this.authService.tokenReceptionObservable.subscribe(tokenReceived => this.isRedirect(tokenReceived))

  }

  //Check if has to do the redirection
  isRedirect(tokenReceived: boolean){
    LoggerService.log("token received : " + tokenReceived, LogLevel.DEBUG);
    if (tokenReceived) {
        this.redirectToHomePage() ; 
    }
  }

  redirectToHomePage(){
    //  TO-DO : Creer un service de redirection
    //  changer la redirection après connection en fonction du module de préférence
    //  de l'utilisateur (Mission par défaut)
    this.router.navigate(['skills']);
  }
}
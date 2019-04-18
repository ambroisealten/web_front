import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { Router, Route } from '@angular/router';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { RoutingService } from '../../services/routing.service';
import { IsNotLoginService } from 'src/app/services/isNotLogin.service';

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
    private tokenService: TokenService,
    private routingService: RoutingService,
    private router: Router,
    private isNotLoginService: IsNotLoginService) {
      this.isNotLoginService.notifyLoginOut(false);
    }

  ngOnInit() {
    // init validators
    this.validationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")]],
      password: ['', [Validators.required]]
    });

    this.tokenService.tokenReceptionObservable.subscribe(tokenReceived => this.isRedirect(tokenReceived))
  }

  // convenience getter for easy access to form fields
  get validationFormControls() { return this.validationForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.validationForm.invalid) {
      return;
    }

    this.tokenService.signIn(this.validationForm.value.email, this.validationForm.value.password) ;

  }

  //Check if has to do the redirection
  isRedirect(tokenReceived: boolean){
    LoggerService.log("token received : " + tokenReceived, LogLevel.DEBUG);
    if (tokenReceived) {
        //this.routingService.getRoute().subscribe(routes => this.setRoutes(routes)) ;
        this.redirectToHomePage() ;
    }
  }

  setRoutes(routes: Route[]){
    LoggerService.log("Routes received: " + routes, LogLevel.DEBUG);
    this.router.resetConfig(routes) ;
    this.redirectToHomePage() ;
  }

  redirectToHomePage(){
    //  TO-DO : Creer un service de redirection
    //  changer la redirection après connection en fonction du module de préférence
    //  de l'utilisateur (Mission par défaut)
    this.isNotLoginService.notifyLoginOut(true) ;
    this.tokenService.notifyTokenReception(false) ;
    this.router.navigate(['skills/skillsheet']);
  }
}

import { NgModule } from '@angular/core';

//    IMPORT MODULES
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginRoutingModule } from './login-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';
import { DemoMaterialModule } from '../utils/material-modules';
import { BrowserModule } from '@angular/platform-browser';


//    IMPORT COMPOSANTS
import { LoginComponent } from './components/login/login.component' ; 
import { SignupComponent } from './components/signup/signup.component';

//    IMPORT SERVICES
import { TokenService } from './services/token.service';
import { RoutingService } from './services/routing.service';



@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    LoginRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    DemoMaterialModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [
    TokenService,
    RoutingService
  ]
})
export class LoginModule { }

import { NgModule } from '@angular/core';

//    IMPORT MODULES
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';

//    IMPORT COMPOSANTS
import { LoginComponent } from './components/login/login.component' ; 
import { SignupComponent } from './components/signup/signup.component';

//    IMPORT SERVICES
import { TokenService } from './services/token.service';
import { RoutingService } from './services/routing.service';



@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    LoginRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  providers: [
    TokenService,
    RoutingService
  ]
})
export class LoginModule { }

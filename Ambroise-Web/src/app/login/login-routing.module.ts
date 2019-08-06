import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';


const loginRoutes: Routes = [ 
  { path: '', component: LoginComponent },
  { path:'c2lnbnVw', component: SignupComponent }, // path 'c2lnbnVw' corresponds to signup
]
@NgModule({
  imports: [ RouterModule.forChild(loginRoutes) ],
  exports: [ RouterModule ]
})
export class LoginRoutingModule { }

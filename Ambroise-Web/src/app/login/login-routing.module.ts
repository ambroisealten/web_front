import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/login/login.component';


const loginRoutes: Routes = [ 
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }
]
@NgModule({
  imports: [ RouterModule.forChild(loginRoutes) ],
  exports: [RouterModule]
})
export class LoginRoutingModule { }

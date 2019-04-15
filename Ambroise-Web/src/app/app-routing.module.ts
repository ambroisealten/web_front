import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { SignupComponent } from './login/components/signup/signup.component';


const appRoutes: Routes = [
  { path:'', redirectTo: '/login',pathMatch: 'full' },
  { path:'**', redirectTo: '/login', pathMatch: 'full' },
  { path:'skills', loadChildren: './competences/competences.module#CompetencesModule' }, 
  { path:'login', loadChildren: './login/login.module#LoginModule' },
  { path:'missions', loadChildren: './missions/missions.module#MissionsModule' }, 
  { path:'forum', loadChildren: './forum/forum.module#ForumModule' },
  { path:'c2lnbnVw', component: SignupComponent } // path 'c2lnbnVw' corresponds to signup
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes, { enableTracing: false }) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

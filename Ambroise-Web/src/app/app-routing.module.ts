import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

const appRoutes: Routes = [
  { path:'', redirectTo: '/login',pathMatch: 'full' },
  { path:'skills', loadChildren: './competences/competences.module#CompetencesModule' }, 
  { path:'login', loadChildren: './login/login.module#LoginModule' },
  { path:'missions', loadChildren: './missions/missions.module#MissionsModule' }, 
  { path:'forum', loadChildren: './forum/forum.module#ForumModule' },
  { path:'admin', loadChildren: './administration/administration.module#AdministrationModule' },
  //{ path:'**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes, { enableTracing: false } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

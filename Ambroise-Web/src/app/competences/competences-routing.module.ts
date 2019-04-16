import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SkillsFormComponent } from './components/skillsSheet/skills-form/skills-form.component' ; 
import { PageSkillsHomeComponent } from './components/accueil/page-skills-home/page-skills-home.component' ;  

const compRoutes: Routes = [
  { path: '', redirectTo:'skills', pathMatch:'full' },
  { path:'skills', children: [
    { path: '',  component: PageSkillsHomeComponent },
    { path:'skillsheet', component: SkillsFormComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(compRoutes)],
  exports: [RouterModule]
})
export class CompetencesRoutingModule { }

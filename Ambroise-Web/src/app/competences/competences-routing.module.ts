import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageSkillsHomeComponent } from './components/accueil/page-skills-home/page-skills-home.component' ;  
import { SkillsSheetViewComponent } from './components/skillsSheet/skills-sheet-view/skills-sheet-view.component';

const compRoutes: Routes = [
  { path: '', component: PageSkillsHomeComponent },
  { path:'skillsheet/:name/:version', component: SkillsSheetViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(compRoutes)],
  exports: [RouterModule]
})
export class CompetencesRoutingModule { }

//  MODULES NEEDED
import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../utils/material-modules';

//  ROUTING MODULE
import { CompetencesRoutingModule } from './competences-routing.module';

//  COMPONENTS
import { ModalSkillsCandidateComponent } from './components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { PageSkillsHomeComponent } from './components/accueil/page-skills-home/page-skills-home.component';
import { ArraySkillsComponent } from './components/skillsSheet/array-skills/array-skills.component';
import { ArraySkillsUpdatesComponent } from './components/skillsSheet/array-skillsUpdates/array-skillsUpdates.component';
import { SkillsFormComponent } from './components/skillsSheet/skills-form/skills-form.component';

//  FEATURE MODULE NEEDED
import { HeaderModule } from '../header/header.module';
import { SkillsSheetService } from './services/skillsSheet.service';
import { IsNotLoginService } from '../services/isNotLogin.service';
import { SkillsService } from './services/skills.service';
import { PersonSkillsService } from './services/personSkills.service';
import { ArrayObsService } from './services/arrayObs.service';
import { SkillsListService } from './services/skillsList.service';
import { ModalDisponibilityComponent } from './components/skillsSheet/modal-disponibility/modal-disponibility.component';


@NgModule({
  declarations: [
    ModalSkillsCandidateComponent,
    PageSkillsHomeComponent,
    ArraySkillsComponent,
    ArraySkillsUpdatesComponent,
    SkillsFormComponent,
    ModalDisponibilityComponent
  ],
  imports: [
    CommonModule,
    CompetencesRoutingModule,
    HeaderModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    //BrowserModule,
    DemoMaterialModule,
    //BrowserAnimationsModule,
    //MatDialogModule
  ],
  entryComponents: [
    ModalSkillsCandidateComponent,
    ModalDisponibilityComponent
    //ConfirmationDialogComponent
  ],
  providers: [
    SkillsSheetService,
    SkillsService,
    PersonSkillsService,
    SkillsListService
  ]
})
export class CompetencesModule {

}

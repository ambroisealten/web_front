//  MODULES NEEDED
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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


@NgModule({
  declarations: [
    ModalSkillsCandidateComponent,
    PageSkillsHomeComponent,
    ArraySkillsComponent,
    ArraySkillsUpdatesComponent,
    SkillsFormComponent
  ],
  imports: [
    CommonModule,
    CompetencesRoutingModule,
    HeaderModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    //ReactiveFormsModule,
    //BrowserModule,
    DemoMaterialModule,
    //BrowserAnimationsModule,
    //MatDialogModule
  ],
  entryComponents: [
    ModalSkillsCandidateComponent,
    //ConfirmationDialogComponent
  ],
  providers: [
    SkillsSheetService
  ]
})
export class CompetencesModule { }

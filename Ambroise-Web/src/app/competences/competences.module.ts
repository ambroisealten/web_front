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
import { SkillsSheetViewComponent } from './components/skillsSheet/skills-sheet-view/skills-sheet-view.component';
import { PdfComponent } from './components/skillsSheet/pdf/pdf.component';
import { SkillsListService } from './services/skillsList.service';
import { ModalAvailabilityComponent } from './components/skillsSheet/modal-availability/modal-availability.component';


@NgModule({
  declarations: [
    ModalSkillsCandidateComponent,
    PageSkillsHomeComponent,
    ArraySkillsComponent,
    ArraySkillsUpdatesComponent,
    SkillsFormComponent,
    SkillsSheetViewComponent,
    PdfComponent
    SkillsFormComponent,
    ModalAvailabilityComponent
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
    SkillsFormComponent,
    PdfComponent
    ModalAvailabilityComponent
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

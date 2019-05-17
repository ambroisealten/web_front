//  MODULES NEEDED
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../utils/shared-module/material-modules';

//  ROUTING MODULE
import { CompetencesRoutingModule } from './competences-routing.module';

//  COMPONENTS
import { ModalSkillsCandidateComponent } from './components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { PageSkillsHomeComponent } from './components/accueil/page-skills-home/page-skills-home.component';
import { ArraySkillsComponent } from './components/skillsSheet/array-skills/array-skills.component';
import { ArraySkillsUpdatesComponent } from './components/skillsSheet/array-skillsUpdates/array-skillsUpdates.component';
import { SkillsFormComponent } from './components/skillsSheet/skills-form/skills-form.component';
import { SkillsSheetViewComponent } from './components/skillsSheet/skills-sheet-view/skills-sheet-view.component';

//  SERVICES
import { SkillsSheetService } from './services/skillsSheet.service';;
import { SkillsService } from './services/skills.service';
import { PersonSkillsService } from './services/personSkills.service';
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
    CommonModule,
    HttpClientModule,
    FormsModule,
    DemoMaterialModule,
  ],
  entryComponents: [
    ModalSkillsCandidateComponent,
    SkillsFormComponent,
    PdfComponent
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

import { NgModule } from '@angular/core';

//  IMPORT INTERNAL MODULE
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './utils/material-modules';
import { MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//  ROUTING
import { AppRoutingModule } from './app-routing.module';

//  COMPONENT
import { AppComponent } from './app.component';
import { ConfirmationDialogComponent } from './utils/confirmation-dialog/confirmation-dialog.component';

//  IMPORT FEATURE MODULE
import { ForumModule } from './forum/forum.module';
import { MissionsModule } from './missions/missions.module';
import { FooterModule } from './footer/footer.module';
import { LoginModule } from './login/login.module';
import { HeaderModule } from './header/header.module';
import { CompetencesModule } from './competences/competences.module';

// SERVICE
import { LoggerService } from './services/logger.service';
import { IsNotLoginService } from './services/isNotLogin.service' ;
import { SkillsSheetService } from './competences/services/skillsSheet.service';
import { PersonSkillsService } from './competences/services/personSkills.service';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    LoginModule,
    CompetencesModule,
    ForumModule,
    MissionsModule,
    HeaderModule,
    FooterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [
    LoggerService,
    IsNotLoginService,
    SkillsSheetService,
    PersonSkillsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent
  ]
})
export class AppModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdminDataAppComponent } from './components/admin-data-app/admin-data-app.component';
import { AdminDocumentComponent } from './components/admin-document/admin-document.component';
import { DataAgencyDialogComponent } from './components/data-agency-dialog/data-agency-dialog.component';
import { MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../utils/material-modules';
import { AdminService } from './services/admin.service';
import { DataFileDialogComponent } from './components/data-file-dialog/data-file-dialog.component';
import { ProgressSpinnerComponent } from '../utils/progress-spinner/progress-spinner.component';
import { DataSoftSkillDialogComponent } from './components/data-soft-skill-dialog/data-soft-skill-dialog.component';


@NgModule({
  declarations: [
    AdminDocumentComponent,
    AdminDataAppComponent,
    DataAgencyDialogComponent,
    DataFileDialogComponent,
    ProgressSpinnerComponent,
    DataSoftSkillDialogComponent,
  ],
  entryComponents: [
    DataFileDialogComponent,
    DataAgencyDialogComponent,
    ProgressSpinnerComponent,
    DataSoftSkillDialogComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    MatDialogModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    AdminService
  ]
})
export class AdministrationModule { }

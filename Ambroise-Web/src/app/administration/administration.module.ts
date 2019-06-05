import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdminDataAppComponent } from './components/admin-data-app/admin-data-app.component';
import { AdminDocumentComponent } from './components/admin-document/admin-document.component';
import { DataAgencyDialogComponent } from './components/modal-administation/data-agency-dialog/data-agency-dialog.component';
import { MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../utils/shared-module/material-modules';
import { AdminService } from './services/admin.service';
import { DataFileDialogComponent } from './components/modal-administation/data-file-dialog/data-file-dialog.component';
import { ProgressSpinnerComponent } from '../utils/progress-spinner/progress-spinner.component';
import { DataSoftSkillDialogComponent } from './components/modal-administation/data-soft-skill-dialog/data-soft-skill-dialog.component';
import { AdminUserComponent } from './components/admin-user/admin-user/admin-user.component';
import { AdminUserService } from './services/admin-user.service';

@NgModule({
  declarations: [
    AdminDocumentComponent,
    AdminDataAppComponent,
    DataAgencyDialogComponent,
    DataFileDialogComponent,
    ProgressSpinnerComponent,
    DataSoftSkillDialogComponent,
    AdminUserComponent
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
    AdminService,
    AdminUserService
  ]
})
export class AdministrationModule { }

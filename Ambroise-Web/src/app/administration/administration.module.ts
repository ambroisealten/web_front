import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { ProgressSpinnerComponent } from '../utils/progress-spinner/progress-spinner.component';
import { DemoMaterialModule } from '../utils/shared-module/material-modules';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdminDataAppComponent } from './components/admin-data-app/admin-data-app.component';
import { AdminDocumentComponent } from './components/admin-document/admin-document.component';
import { AdminUserComponent } from './components/data-applicative-components/admin-user/admin-user/admin-user.component';
import { AdminJobComponent } from './components/data-applicative-components/applicative-components/admin-job/admin-job.component';
import { AdminSkillGradeComponent } from './components/data-applicative-components/applicative-components/admin-skill-grade/admin-skill-grade.component';
import { AdminSoftSkillComponent } from './components/data-applicative-components/applicative-components/admin-soft-skill/admin-soft-skill.component';
import { AgenciesComponent } from './components/data-applicative-components/applicative-components/agencies/agencies.component';
import { ContractTypeComponent } from './components/data-applicative-components/applicative-components/contract-type/contract-type.component';
import { LineOfBusinessComponent } from './components/data-applicative-components/applicative-components/line-of-business/line-of-business.component';
import { AdminSkillsComponent } from './components/data-applicative-components/data-quality-components/admin-skills/admin-skills.component';
import { DataAgencyDialogComponent } from './components/modal-administation/data-agency-dialog/data-agency-dialog.component';
import { DataFileDialogComponent } from './components/modal-administation/data-file-dialog/data-file-dialog.component';
import { DataSoftSkillDialogComponent } from './components/modal-administation/data-soft-skill-dialog/data-soft-skill-dialog.component';
import { DataUserManagementDialogComponent } from './components/modal-administation/data-user-management-dialog/data-user-management-dialog.component';
import { DataUserUpdateDialogComponent } from './components/modal-administation/data-user-update-dialog/data-user-update-dialog.component';
import { AdminAgencyService } from './services/admin-agency.service';
import { AdminSoftSkillService } from './services/admin-softSkill.service';
import { AdminUserService } from './services/admin-user.service';
import { AdminService } from './services/admin.service';
import { HttpInterceptorProviders } from '../app-interceptor-provider';

@NgModule({
  declarations: [
    AdminDocumentComponent,
    AdminDataAppComponent,
    DataAgencyDialogComponent,
    DataFileDialogComponent,
    ProgressSpinnerComponent,
    DataUserManagementDialogComponent,
    DataSoftSkillDialogComponent,
    AdminUserComponent,
    AgenciesComponent,
    AdminSoftSkillComponent,
    ContractTypeComponent,
    LineOfBusinessComponent,
    AdminJobComponent,
    AdminSkillGradeComponent,
    AdminSkillsComponent,
    DataUserUpdateDialogComponent
  ],
  entryComponents: [
    DataFileDialogComponent,
    DataAgencyDialogComponent,
    ProgressSpinnerComponent,
    DataSoftSkillDialogComponent,
    DataUserManagementDialogComponent,
    DataUserUpdateDialogComponent
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
    AdminUserService,
    AdminAgencyService,
    AdminSoftSkillService,
    HttpInterceptorProviders
  ]
})
export class AdministrationModule { }

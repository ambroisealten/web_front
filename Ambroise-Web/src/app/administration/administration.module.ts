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
import { AdminDocumentMenuForumComponent } from './components/admin-document-menu-forum/admin-document-menu-forum.component';
import { DataFileDialogComponent } from './components/data-file-dialog/data-file-dialog.component';


@NgModule({
  declarations: [
    AdminDocumentComponent,
    AdminDataAppComponent,
    DataAgencyDialogComponent,
    AdminDocumentMenuForumComponent,
    DataFileDialogComponent
  ],
  entryComponents: [
    DataFileDialogComponent,
    DataAgencyDialogComponent
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

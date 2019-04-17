import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdminDocumentComponent } from './components/admin-document/admin-document.component';
import { AdminDataAppComponent } from './components/admin-data-app/admin-data-app.component';
import { DataAgencyDialogComponent } from './components/data-agency-dialog/data-agency-dialog.component';

@NgModule({
  declarations: [AdminDocumentComponent, AdminDataAppComponent, DataAgencyDialogComponent],
  imports: [
    CommonModule,
    AdministrationRoutingModule
  ]
})
export class AdministrationModule { }

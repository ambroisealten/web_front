import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDataAppComponent } from './components/admin-data-app/admin-data-app.component';
import { AdminDocumentComponent } from './components/admin-document/admin-document.component';

const routes: Routes = [
  { path: '', redirectTo: 'document', pathMatch: 'full' },
  { path: 'dataApp', component: AdminDataAppComponent },
  { path: 'document', component: AdminDocumentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }

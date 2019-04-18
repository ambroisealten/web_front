import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDataAppComponent } from './components/admin-data-app/admin-data-app.component';
import { AdminDocumentComponent } from './components/admin-document/admin-document.component';
import { AdminDocumentMenuForumComponent } from './components/admin-document-menu-forum/admin-document-menu-forum.component';

const routes: Routes = [
  { path: '', component: AdminDataAppComponent },
  { path: 'dataApp', component: AdminDataAppComponent },
  { path: 'document', component: AdminDocumentComponent },
  { path: 'documentForum', component: AdminDocumentMenuForumComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }

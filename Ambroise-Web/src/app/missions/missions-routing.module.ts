import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const missionsRoutes: Routes = [
  { path: '', redirectTo:'missions', pathMatch:'full' },
  { path:'missions', children: [
    { path: '', redirectTo:'home', pathMatch:'full' },
    //{ path:'home', component: PageMissionsHomeComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(missionsRoutes)],
  exports: [RouterModule]
})
export class MissionsRoutingModule { }

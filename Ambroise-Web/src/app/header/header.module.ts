import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModuleComponent } from './components/header-module/header-module.component';
import { HeaderMenuComponent } from './components/header-menu/header-menu.component' ;
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { HeaderService } from './services/header.services';

@NgModule({
  declarations: [
    HeaderModuleComponent,
    HeaderMenuComponent,
    HeaderUserComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderMenuComponent,
    HeaderModuleComponent,
    HeaderUserComponent
  ],
  providers: [
    HeaderService
  ]
})
export class HeaderModule { }

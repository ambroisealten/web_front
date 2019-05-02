import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//  Components
import { HeaderModuleComponent } from './components/header-module/header-module.component';
import { HeaderMenuComponent } from './components/header-menu/header-menu.component' ;
import { HeaderUserComponent } from './components/header-user/header-user.component';

//  Services 
import { HeaderService } from './services/header.services';
import { CurrentModuleService } from './services/currentModule.services' ;
import { MatIconModule } from '@angular/material';

@NgModule({
  declarations: [
    HeaderModuleComponent,
    HeaderMenuComponent,
    HeaderUserComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    HeaderMenuComponent,
    HeaderModuleComponent,
    HeaderUserComponent
  ],
  providers: [
    CurrentModuleService, 
    HeaderService
  ],
  entryComponents: [ 
    HeaderUserComponent
  ]
})
export class HeaderModule { }

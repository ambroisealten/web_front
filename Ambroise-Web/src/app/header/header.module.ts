import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//  Components
import { HeaderMenuComponent } from './components/header-menu/header-menu.component' ;
import { HeaderUserComponent } from './components/header-user/header-user.component';

//  Services 
import { HeaderService } from './services/header.services';
import { MatIconModule } from '@angular/material';
import { TokenService } from '../login/services/token.service';

@NgModule({
  declarations: [
    HeaderMenuComponent,
    HeaderUserComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    HeaderMenuComponent,
    HeaderUserComponent
  ],
  providers: [
    HeaderService,
    TokenService
  ],
  entryComponents: [ 
    HeaderUserComponent
  ]
})
export class HeaderModule { }

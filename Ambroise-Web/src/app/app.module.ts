import { NgModule } from '@angular/core';

//  IMPORT INTERNAL MODULE
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';  

//  ROUTING
import { AppRoutingModule } from './app-routing.module';

//  COMPONENT
import { AppComponent } from './app.component';
import { ConfirmationDialogComponent } from './utils/confirmation-dialog/confirmation-dialog.component';

//  IMPORT FEATURE MODULE
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';

// SERVICE
import { LoggerService } from './services/logger.service';
import { IsNotLoginService } from './services/isNotLogin.service' ;
import { SubMenusService } from './services/subMenus.service';
import { ErrorService } from './services/error.service';
import { HttpHeaderService } from './services/httpHeaderService';
import { MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    HeaderModule,
    FooterModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }) ,
    MatDialogModule
  ],
  providers: [
    LoggerService,
    IsNotLoginService,
    SubMenusService,
    ErrorService,
    HttpHeaderService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent
  ]
})
export class AppModule { }

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';
//  IMPORT INTERNAL MODULE
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
//  ROUTING
import { AppRoutingModule } from './app-routing.module';
//  COMPONENT
import { AppComponent } from './app.component';
//  IMPORT FEATURE MODULE
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { ErrorService } from './services/error.service';
import { HttpHeaderService } from './services/httpHeaderService';
import { IsNotLoginService } from './services/isNotLogin.service';
// SERVICE
import { LoggerService } from './services/logger.service';
import { SubMenusService } from './services/subMenus.service';
import { ConfirmationDialogComponent } from './utils/confirmation-dialog/confirmation-dialog.component';
import { httpInterceptorProviders } from './app-interceptor-provider';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent
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
    HttpHeaderService,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent
  ]
})
export class AppModule { }

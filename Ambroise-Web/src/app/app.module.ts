import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { DemoMaterialModule } from './material-modules';
import { SearchAutoComponent } from './content/search-auto/search-auto.component';
import { SearchService } from './content/services/search.service';
import { MatAutocompleteModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderUserComponent } from './header/header-user/header-user.component';
import { AuthGuard } from './services/auth-guard.service';
import { PageLoginComponent } from './content/page-login/page-login.component';
import { PageContentComponent } from './content/page-content/page-content.component';
import { HeaderUserComponent } from './header/header-user/header-user.component';
import { HeaderMenuComponent } from './header/header-menu/header-menu.component';

const appRoutes: Routes = [
  {path:'content', component:PageContentComponent},
  {path:'',component:PageLoginComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    SearchAutoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    SearchService
    HeaderUserComponent,
    PageLoginComponent,
    PageContentComponent,
    HeaderMenuComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

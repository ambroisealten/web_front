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
import { LoginComponent } from './login/login/login.component';
import { SignupComponent } from './login/signup/signup.component';
import { PageContentComponent } from './content/page-content/page-content.component';
import { PageLoginComponent } from './content/page-login/page-login.component';
import { HeaderUserComponent } from './header/header-user/header-user.component';
import { HeaderMenuComponent } from './header/header-menu/header-menu.component';
import { AuthGuard } from './services/auth-guard.service';
import { HeaderService } from './services/header.services';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path:'content', component:PageContentComponent},
  { path: 'c2lnbnVw', component: SignupComponent } // path 'c2lnbnVw' corresponds to signup
];
@NgModule({
  declarations: [
    AppComponent,
    SearchAutoComponent,
    HeaderUserComponent,
    PageLoginComponent,
    PageContentComponent,
    HeaderMenuComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserAnimationsModule
  ],
  providers: [
    SearchService,
    AuthGuard,
    HeaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

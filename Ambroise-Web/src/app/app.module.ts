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

const appRoutes: Routes = [
  {path:'content', component:PageContentComponent},
  {path:'',component:PageLoginComponent}
  { path: 'login', component: LoginComponent },
  { path: 'c2lnbnVw', component: SignupComponent } // path 'c2lnbnVw' corresponds to signup
];
@NgModule({
  declarations: [
    AppComponent,
    SearchAutoComponent,
    HeaderUserComponent,
    PageLoginComponent,
    PageContentComponent,
    HeaderMenuComponent
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

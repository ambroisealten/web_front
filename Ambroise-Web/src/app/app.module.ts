import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderUserComponent } from './header/header-user/header-user.component';
import { HeaderVisitorComponent } from './header/header-visitor/header-visitor.component';
import { AuthGuard } from './services/auth-guard.service';
import { PageLoginComponent } from './content/page-login/page-login.component';
import { PageContentComponent } from './content/page-content/page-content.component';

const appRoutes: Routes = [
  {path:'content', component:PageContentComponent},
  {path:'',component:PageLoginComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    HeaderUserComponent,
    HeaderVisitorComponent,
    PageLoginComponent,
    PageContentComponent
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

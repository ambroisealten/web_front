import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchAutoComponent } from './content/search-auto/search-auto.component';
import { SearchService } from './content/services/search.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchAutoComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    SearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

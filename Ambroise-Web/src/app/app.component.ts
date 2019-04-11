import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ambroise-Web';

  constructor(){

    //  Récupération de la variable d'environement "globalLogType" pour initialiser
    //  le LoggerService
    LoggerService.parseLogType(environment.globalLogType);
  }
}

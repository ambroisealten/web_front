import { Component } from '@angular/core';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { environment } from 'src/environments/environment';

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

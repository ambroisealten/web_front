import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { timeout, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Person } from '../models/person';
import { SkillsSheet } from '../models/skillsSheet';

@Injectable()
/**
* Service to handle skillsSheet creation and update
*/
export class SkillsSheetService {

  /**
  * Temporary hardcoded json for data
  */

  lastModificationsArray = [
    {
      manager: 'Joyce',
      date: '01/03/19',
      action: 'Création'
    },
    {
      manager: 'Joyce',
      date: '15/03/19',
      action: 'Mise à jour'
    }
  ];

  constructor(private httpClient: HttpClient) { }

  /**
   * HTTP Post request to create a new skillsSheet in db
   * @param  skillsSheet skillsSheet to create
   */
  createNewSkillsSheet(skillsSheet: SkillsSheet) {
    let token = window.sessionStorage.getItem("bearerToken");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token != "" ? token : ''
    });
    let options = { headers: headers };

    return this.httpClient
        .post<SkillsSheet>(environment.serverAddress + '/skillsheet', skillsSheet, options)
        .pipe(timeout(5000), catchError(error => this.handleError(error)));
  }

  /**
   * HTTP Put request to update a new skillsSheet in db
   * @param  skillsSheet skillsSheet to update
   */
  updateSkillsSheet(skillsSheet: SkillsSheet){
    let token = window.sessionStorage.getItem("bearerToken");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token != "" ? token : ''
    });
    let options = { headers: headers };

    return this.httpClient
        .put<SkillsSheet>(environment.serverAddress + '/skillsheet' , skillsSheet, options)
        .pipe(timeout(5000), catchError(error => this.handleError(error)));
  }

  /**
   * HTTP Get request to retrieve all existant skillsSheets in db
   */
  getAllSkillSheets():Observable<{} | SkillsSheet[]>{
    let token = window.sessionStorage.getItem("bearerToken");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    let options = { headers: headers };

    return this.httpClient
        .get<{} | SkillsSheet[]>(environment.serverAddress + '/skillsheets', options)
        .pipe(timeout(5000), catchError(error => this.handleError(error)));
  }

  /**
   * HTTP Get request to check if a skillsSheet exists given a mail
   * @param  mail skillsSheet's associated mail
   */
  checkSkillsSheetExistenceByMail(mail: string) {
    let token = window.sessionStorage.getItem("bearerToken");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    let options = { headers: headers };

    return this.httpClient
      .get<Person>(environment.serverAddress + "/skillsheetMail/" + mail, options)
      .pipe(timeout(5000), catchError(error => this.handleError(error)));
  }

  handleError(error){
    LoggerService.log(error, LogLevel.DEBUG); // TODO add errors in switch/case
    return undefined;
  }

}

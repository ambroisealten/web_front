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

    token = window.sessionStorage.getItem("bearerToken");
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token != "" ? this.token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    options = { headers: this.headers };

  /**
   * HTTP Post request to create a new skillsSheet in db
   * @param  skillsSheet skillsSheet to create
   */
  createNewSkillsSheet(skillsSheet: SkillsSheet) {
    return this.httpClient
        .post<SkillsSheet>(environment.serverAddress + '/skillsheet', skillsSheet, this.options)
        .pipe(timeout(5000), catchError(error => this.handleError(error)));
  }

  /**
   * HTTP Put request to update a new skillsSheet in db
   * @param  skillsSheet skillsSheet to update
   */
  updateSkillsSheet(skillsSheet: SkillsSheet){
    return this.httpClient
        .put<SkillsSheet>(environment.serverAddress + '/skillsheet' , skillsSheet, this.options)
        .pipe(timeout(5000), catchError(error => this.handleError(error)));
  }

  /**
   * HTTP Get request to retrieve all existant skillsSheets in db
   */
  getAllSkillSheets():Observable<{} | SkillsSheet[]>{
    return this.httpClient
        .get<{} | SkillsSheet[]>(environment.serverAddress + '/skillsheets', this.options)
        .pipe(timeout(5000), catchError(error => this.handleError(error)));
  }

  /**
   * HTTP Get request to check if a skillsSheet exists given a mail
   * @param  mail skillsSheet's associated mail
   */
  checkSkillsSheetExistenceByMail(mail: string) {
    return this.httpClient
      .get<Boolean>(environment.serverAddress + "/skillsheetMail/" + mail, this.options)
      .pipe(timeout(5000), catchError(error => this.handleError(error)));
  }

  /**
   * HTTP Get request to get skillsSheets given a mail
   * @param  mail skillsSheets's associated mail
   */
  getSkillsSheetsByMail(mail: string) {
    return this.httpClient
      .get<SkillsSheet[]>(environment.serverAddress + "/skillsheet/" + mail, this.options)
      .pipe(timeout(5000), catchError(error => this.handleError(error)));
  }

  handleError(error){
    LoggerService.log(error, LogLevel.DEBUG); // TODO add errors in switch/case
    return undefined;
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { timeout, catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SkillsSheet } from '../models/skillsSheet';
import { ErrorService } from 'src/app/services/error.service';

@Injectable()
/**
* Service to handle skillsSheet creation and update
*/
export class SkillsSheetService {

  /**
  * Temporary hardcoded json for data
  */
  constructor(private httpClient: HttpClient,
    private errorService: ErrorService) { }

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
      .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }

  /**
   * HTTP Put request to update a new skillsSheet in db
   * @param  skillsSheet skillsSheet to update
   */
  updateSkillsSheet(skillsSheet: SkillsSheet) {
    return this.httpClient
      .put<SkillsSheet>(environment.serverAddress + '/skillsheet', skillsSheet, this.options)
      .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }

  handleSkillsSheetError(error) {
    LoggerService.log(error, LogLevel.DEBUG);
    return undefined;
  }

  /**
   * HTTP Get request to get skillsSheets given a mail
   * @param  mail skillsSheets's associated mail
   */
  getSkillsSheetsByMail(mail: string) {
    return this.httpClient
      .get<SkillsSheet[]>(environment.serverAddress + "/skillsheetMail/" + mail, this.options)
      .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }

  getAllSkillsSheetVersions(skillsSheetName: String, mailPersonAttachedTo: String) {
    return this.httpClient
      .get<SkillsSheet[]>(environment.serverAddress + "/skillsheetVersion/" + skillsSheetName + "/" + mailPersonAttachedTo, this.options)
      .pipe(timeout(5000), 
        catchError(error => this.errorService.handleError(error)));
  }

}

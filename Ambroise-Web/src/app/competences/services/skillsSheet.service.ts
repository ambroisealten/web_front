import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { timeout, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SkillsSheet } from '../models/skillsSheet';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';

@Injectable()
/**
* Service to handle skillsSheet creation and update
*/
export class SkillsSheetService {

  constructor(private httpClient: HttpClient,
    private errorService: ErrorService,
    private httpHeaderService: HttpHeaderService) { }

  /**
   * HTTP Post request to create a new skillsSheet in db
   * @param  skillsSheet skillsSheet to create
   */
  createNewSkillsSheet(skillsSheet: SkillsSheet) {
    let options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .post<SkillsSheet>(environment.serverAddress + '/skillsheet', skillsSheet, options)
      .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }

  /**
   * HTTP Put request to update a new skillsSheet in db
   * @param  skillsSheet skillsSheet to update
   */
  updateSkillsSheet(skillsSheet: SkillsSheet) {
    let options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .put<SkillsSheet>(environment.serverAddress + '/skillsheet', skillsSheet, options)
      .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }

  /**
   * HTTP Get request to get skillsSheets given a mail
   * @param  mail skillsSheets's associated mail
   */
  getSkillsSheetsByMail(mail: string) {
    let options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .get<SkillsSheet[]>(environment.serverAddress + "/skillsheetMail/" + mail, options)
      .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }

  /**
   * Get all versions of a skillsSheet
   * @param skillsSheetName 
   * @param mailPersonAttachedTo 
   */
  getAllSkillsSheetVersions(skillsSheetName: String, mailPersonAttachedTo: String) {
    let options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .get<SkillsSheet[]>(environment.serverAddress + "/skillsheetVersion/" + skillsSheetName + "/" + mailPersonAttachedTo, options)
      .pipe(timeout(5000), 
        catchError(error => this.errorService.handleError(error)));
  }

  /**
   * Delete SkillsSheet
   * @param skillsSheet 
   */
  deleteSkillsSheet(skillsSheet: SkillsSheet) {
    let postParams = {
      name: skillsSheet.name,
    };
    let options = {
        body: postParams,
        headers: this.httpHeaderService.getHttpHeaders()['headers'],
    };
    return this.httpClient
      .delete(environment.serverAddress + '/skillsheet', options)
      .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }
}

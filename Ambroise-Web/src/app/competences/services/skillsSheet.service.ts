import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { environment } from 'src/environments/environment';
import { SkillsSheet } from '../models/skillsSheet';

@Injectable()
/**
* Service to handle skillsSheet creation and update
*/
export class SkillsSheetService {

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService,
    private httpHeaderService: HttpHeaderService) { }

  /**
   * HTTP Post request to create a new skillsSheet in db
   * @param  skillsSheet skillsSheet to create
   */
  createNewSkillsSheet(skillsSheet: SkillsSheet) {
    const options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .post<SkillsSheet>(environment.serverAddress + '/skillsheet', skillsSheet, options)
      .pipe(retry(10), catchError(error => this.errorService.handleError(error)));
  }

  /**
   * HTTP Put request to update a new skillsSheet in db
   * @param  skillsSheet skillsSheet to update
   */
  updateSkillsSheet(skillsSheet: SkillsSheet) {
    const options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .put<SkillsSheet>(environment.serverAddress + '/skillsheet', skillsSheet, options)
      .pipe(retry(10), catchError(error => this.errorService.handleError(error)));
  }

  /**
   * HTTP Get request to get skillsSheets given a mail
   * @param  mail skillsSheets's associated mail
   */
  getSkillsSheetsByMail(mail: string) {
    const options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .get<SkillsSheet[]>(environment.serverAddress + '/skillsheetMail/' + mail, options)
      .pipe(retry(10), catchError(error => this.errorService.handleError(error)));
  }

  /**
   * Get all versions of a skillsSheet
   * @param skillsSheetName
   * @param mailPersonAttachedTo
   */
  getAllSkillsSheetVersions(skillsSheetName: String, mailPersonAttachedTo: String) {
    const options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .get<SkillsSheet[]>(environment.serverAddress + '/skillsheetVersion/' + skillsSheetName + '/' + mailPersonAttachedTo, options)
      .pipe(retry(10),
        catchError(error => this.errorService.handleError(error)));
  }

}

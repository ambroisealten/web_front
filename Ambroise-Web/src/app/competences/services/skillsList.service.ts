import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Skills } from '../models/skills';
import { SkillsSheet, Skill } from '../models/skillsSheet';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { timeout, catchError, retry } from 'rxjs/operators';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';

@Injectable()
/**
* Service to handle Skills models
*/
export class SkillsListService {

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService,
    private httpHeaderService: HttpHeaderService) { }


  /**
   * HTTP Get request to get all Skills
   */
  getAllSkills() {
    const options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .get<Skill[]>(environment.serverAddress + '/skills/', options)
      .pipe(retry(), catchError(error => this.errorService.handleError(error)));
  }

  getSoftSkills(): Observable<{} | Skill[]> {
    const options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .get<Skill[]>(environment.serverAddress + '/softskills/', options)
      .pipe(retry(), catchError(error => this.errorService.handleError(error)));
  }

  /**
   * HTTP Get request to get all Skills (that are not soft)
   */
  getAllTechSkills() {
    const options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .get<Skill[]>(environment.serverAddress + '/techskills/', options)
      .pipe(retry(), catchError(error => this.errorService.handleError(error)));
  }
}

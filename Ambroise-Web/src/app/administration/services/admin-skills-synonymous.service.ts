import { Injectable } from '@angular/core';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { ErrorService } from 'src/app/services/error.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, timeout } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Skill } from '../models/Skill';

@Injectable({
  providedIn: 'root'
})
export class AdminSkillsSynonymousService {

  constructor(
      private httpClient: HttpClient,
      private httpHeaderService: HttpHeaderService,
      private errorService: ErrorService) { }

  getSkills(): Observable<{} | Skill[]> {
    let options = this.httpHeaderService.getHttpHeaders();
      return this.httpClient
          .get<Skill[]>(environment.serverAddress + '/techskills', options)
          .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }
  

  getSkillsSynonymous(): Observable<{} | Skill[]> {
    let options = this.httpHeaderService.getHttpHeaders();
      return this.httpClient
          .get<Skill[]>(environment.serverAddress + '/skillsSynonymous', options)
          .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }
  
  getSkillReplaceWith(): Observable<{} | Skill[]> {
    let options = this.httpHeaderService.getHttpHeaders();
     return this.httpClient
         .get<Skill[]>(environment.serverAddress + '/skillReplaceWith', options)
         .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }
  
  updateSkillsSynonymous(skill: Skill) {
      let options = this.httpHeaderService.getHttpHeaders();
      return this.httpClient
          .put<Skill>(environment.serverAddress + '/skillsSynonymous', skill, options)
          .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }

  deleteSkillsSynonymous(skill: Skill) {
      let postParams = {
          name: skill.name
      };
      let options = {
          body: postParams,
          headers: this.httpHeaderService.getHttpHeaders()['headers'],
      };
      return this.httpClient
          .delete<Skill>(environment.serverAddress + '/skillsSynonymous', options)
          .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }
}
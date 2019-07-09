import { Injectable } from '@angular/core';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { ErrorService } from 'src/app/services/error.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, timeout } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Skill } from 'src/app/competences/models/skillsSheet';

@Injectable({
  providedIn: 'root'
})
export class AdminSkillsService {

  constructor(
    private httpClient: HttpClient,
    private httpHeaderService: HttpHeaderService,
    private errorService: ErrorService) { }

getAgencies(): Observable<{} | Skill[]> {
    let options = this.httpHeaderService.getHttpHeaders();
    return this.httpClient
        .get<Skill[]>(environment.serverAddress + '/skills', options)
        .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
}

createSkill(skill: Skill) {
    let options = this.httpHeaderService.getHttpHeaders();
    return this.httpClient
        .post<Skill>(environment.serverAddress + '/skill', skill, options)
        .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
}

updateSkill(skill: Skill) {
    let options = this.httpHeaderService.getHttpHeaders();
    return this.httpClient
        .put<Skill>(environment.serverAddress + '/skill', skill, options)
        .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
}

deleteSkill(skill: Skill) {
    let postParams = {
        name: skill.name,
        order: skill.order,
        isSoft: skill.isSoft
    };
    let options = {
        body: postParams,
        headers: this.httpHeaderService.getHttpHeaders()['headers'],
    };
    return this.httpClient
        .delete<Skill>(environment.serverAddress + '/skill', options)
        .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
}
}
import { Injectable } from '@angular/core';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { ErrorService } from 'src/app/services/error.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, timeout } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Agency } from '../models/Agency';
import { SoftSkill } from '../models/SoftSkill';
import { Skill } from 'src/app/competences/models/skillsSheet';

@Injectable()
export class AdminSoftSkillService {

    constructor(
        private httpClient: HttpClient,
        private httpHeaderService: HttpHeaderService,
        private errorService: ErrorService) { }

    getSoftSkills(): Observable<{} | SoftSkill[]> {
        let options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .get<SoftSkill[]>(environment.serverAddress + '/softskills', options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

    createSoftSkill(softSkill: SoftSkill) {
        let options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .post<SoftSkill>(environment.serverAddress + '/skill', softSkill, options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

    updateSoftSkill(softSkill: SoftSkill) {
        let options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .put<SoftSkill>(environment.serverAddress + '/skill', softSkill, options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

    updateSoftSkillsOrder(softSkill: Skill[]){
        let options = this.httpHeaderService.getHttpHeaders();
        let softSkills = {} ; 
        softSkills['softSkillsList'] = softSkill 
        return this.httpClient
            .put(environment.serverAddress + '/softSkillsOrder', softSkills, options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

    deleteSoftSkill(softSkill: SoftSkill) {
        let postParams = {
            name: softSkill.name, 
        };
        let options = {
            body: postParams,
            headers: this.httpHeaderService.getHttpHeaders()['headers'],
        };
        return this.httpClient
            .delete<Agency>(environment.serverAddress + '/skill', options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }
}
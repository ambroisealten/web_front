import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Skill } from 'src/app/competences/models/skillsSheet';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { environment } from 'src/environments/environment';
import { Agency } from '../models/Agency';
import { SoftSkill } from '../models/SoftSkill';

@Injectable()
export class AdminSoftSkillService {

    constructor(
        private httpClient: HttpClient,
        private httpHeaderService: HttpHeaderService,
        private errorService: ErrorService) { }

    getSoftSkills(): Observable<{} | SoftSkill[]> {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .get<SoftSkill[]>(environment.serverAddress + '/softskills', options)
            .pipe(retry(), catchError(error => this.errorService.handleError(error)));
    }

    createSoftSkill(softSkill: SoftSkill) {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .post<SoftSkill>(environment.serverAddress + '/skill', softSkill, options)
            .pipe(retry(), catchError(error => this.errorService.handleError(error)));
    }

    updateSoftSkill(softSkill: SoftSkill) {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .put<SoftSkill>(environment.serverAddress + '/skill', softSkill, options)
            .pipe(retry(), catchError(error => this.errorService.handleError(error)));
    }

    updateSoftSkillsOrder(softSkill: Skill[]) {
        const options = this.httpHeaderService.getHttpHeaders();
        const softSkills = {};
        softSkills['softSkillsList'] = softSkill;
        return this.httpClient
            .put(environment.serverAddress + '/softSkillsOrder', softSkills, options)
            .pipe(retry(),
                catchError(error => this.errorService.handleError(error)));
    }

    deleteSoftSkill(softSkill: SoftSkill) {
        const postParams = {
            name: softSkill.name,
        };
        const options = {
            body: postParams,
            headers: this.httpHeaderService.getHttpHeaders()['headers'],
        };
        return this.httpClient
            .delete<Agency>(environment.serverAddress + '/skill', options)
            .pipe(retry(), catchError(error => this.errorService.handleError(error)));
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

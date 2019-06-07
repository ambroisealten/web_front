import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { catchError, finalize, mergeMap, retryWhen, timeout } from 'rxjs/operators';
import { Skill } from 'src/app/competences/models/skillsSheet';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { environment } from 'src/environments/environment';
import { Agency } from '../models/Agency';
import { SoftSkill } from '../models/SoftSkill';

@Injectable()
export class AdminSoftSkillService {

    constructor(
        private httpClient: HttpClient,
        private httpHeaderService: HttpHeaderService,
        private errorService: ErrorService,
        private router: Router) { }

    getSoftSkills(): Observable<{} | SoftSkill[]> {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .get<SoftSkill[]>(environment.serverAddress + '/softskills', options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

    createSoftSkill(softSkill: SoftSkill) {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .post<SoftSkill>(environment.serverAddress + '/skill', softSkill, options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

    updateSoftSkill(softSkill: SoftSkill) {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .put<SoftSkill>(environment.serverAddress + '/skill', softSkill, options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

    updateSoftSkillsOrder(softSkill: Skill[]) {
        const options = this.httpHeaderService.getHttpHeaders();
        const softSkills = {};
        softSkills['softSkillsList'] = softSkill;
        return this.httpClient
            .put(environment.serverAddress + '/softSkillsOrder', softSkills, options)
            .pipe(timeout(5000), retryWhen(this.genericRetryStrategy(options)), catchError(error => this.errorService.handleError(error)));
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
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

    genericRetryStrategy = (
        options,
        {
            maxRetryAttempts = 1,
            scalingDuration = 1000,
            excludedStatusCodes = []
        }: {
            maxRetryAttempts?: number;
            scalingDuration?: number;
            excludedStatusCodes?: number[];
        } = {}
    ) => (attempts: Observable<any>) => {
        return attempts.pipe(
            mergeMap((error, i) => {
                const retryAttempt = i + 1;
                // if maximum number of retries have been met
                // or response is a status code we don't wish to retry, throw error
                if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
                    return;//this.errorService.handleError(error);
                }
                LoggerService.log(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`, LogLevel.PROD);
                // retry after 1s, 2s, etc...
                const token = window.sessionStorage.getItem('refreshToken');
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: token !== '' ? token : ''
                });
                const newOptions = { headers };
                this.httpClient
                    .get(environment.serverAddress + '/login', newOptions)
                    .pipe(catchError(error => this.router.navigate(['login'])))
                    .toPromise().then(response => {
                        // Check si la propriété Token existe
                        if (response.hasOwnProperty('token')) {
                            // On store le token dans le sessionStorage du navigateur
                            window.sessionStorage.setItem('bearerToken', response['token']);
                            const newToken = response['token'];
                            const newHeaders = new HttpHeaders({
                                'Content-Type': 'application/json',
                                Authorization: newToken !== '' ? newToken : ''
                            });
                            options.headers = newHeaders;
                        } else {
                            LoggerService.log('Problème réception token !!', LogLevel.DEV);
                        }
                        return;
                    });
                return timer(scalingDuration);
            }),
            finalize(() => LoggerService.log('Refresh process ended', LogLevel.PROD))
        );
    };
}

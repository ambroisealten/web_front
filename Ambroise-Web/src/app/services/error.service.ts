import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHeaderService } from './httpHeaderService';
import { LoggerService, LogLevel } from './logger.service';

@Injectable()
export class ErrorService {

    constructor(
        private httpClient: HttpClient,
        private httpHeaderService: HttpHeaderService,
        private router: Router,
        private toastr: ToastrService) { }

    /**
     * Gere les erreurs http
     * @param error
     * @author Quentin Della-Pasqua
     */
    handleError(error): any {
        const statusError = error.error.status;
        const messageError = error.error.message;
        switch (statusError) {
            case (401):
                break;

            default:
                break;
        }
        LoggerService.log(statusError + ' : ' + messageError, LogLevel.DEV);
        this.toastr.error(statusError + ' - ' + messageError, 'Désolé, une erreur est survenue', { positionClass: 'toast-bottom-full-width', closeButton: true });
        return error;
    }
}

export const genericRetryStrategy = (
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
                return this.errorService.handleError(error);
            }
            console.log(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
            // retry after 1s, 2s, etc...
            const options = this.httpHeaderService.getHttpHeaders();

            return this.httpClient
                .get(environment.serverAddress + '/login', options)
                .pipe(catchError(error => this.router.navigate(['login'])))
                .subscribe(response => {
                    // Check si la propriété Token existe
                    if (response.hasOwnProperty('token')) {
                        // On store le token dans le sessionStorage du navigateur
                        window.sessionStorage.setItem('refreshToken', response.token);
                    } else {
                        LoggerService.log('Problème réception token !!', LogLevel.DEV);
                    }
                });
        }),
        finalize(() => console.log('We are done!'))
    );
};


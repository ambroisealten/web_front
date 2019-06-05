import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService, LogLevel } from './logger.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Skills } from '../competences/models/skills';
import { environment } from 'src/environments/environment';
import { timeout } from 'q';
import { catchError } from 'rxjs/operators';
import { HttpHeaderService } from './httpHeaderService';
import { HttpClient } from '@angular/common/http';

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
        const statusError = error.error['status'];
        const messageError = error.error['message'];
        switch (statusError) {
            case (401):
                this.refreshToken().subscribe(response => {
                    // Check si la propriété Token existe
                    if (response.hasOwnProperty('token')) {
                        // On store le token dans le sessionStorage du navigateur
                        window.sessionStorage.setItem('refreshToken', response['token']);
                    } else {
                        LoggerService.log('Problème réception token !!', LogLevel.DEV);
                    }
                });
                break;

            default:
                break;
        }
        LoggerService.log(statusError + ' : ' + messageError, LogLevel.DEV);
        this.toastr.error(statusError + ' - ' + messageError, 'Désolé, une erreur est survenue', { positionClass: 'toast-bottom-full-width', closeButton: true });
        return error;
    }

    refreshToken() {
        const options = this.httpHeaderService.getHttpHeadersForRefreshToken();

        return this.httpClient
            .get(environment.serverAddress + '/login', options)
            .pipe(catchError(error => this.router.navigate(['login'])));
    }
}

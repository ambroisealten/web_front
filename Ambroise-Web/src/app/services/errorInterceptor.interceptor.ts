import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoggerService, LogLevel } from './logger.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private httpClient: HttpClient, 
        private router: Router,
        private cookieService: CookieService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                const refreshToken = this.cookieService.get('refreshToken');
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: refreshToken !== '' ? refreshToken : ''
                });
                const options = { headers };
                this.httpClient
                    .get(environment.serverAddress + '/login', options)
                    .pipe(catchError(() => this.router.navigate(['login'])))
                    .subscribe(response => {
                        // Check si la propriété Token existe
                        if (response.hasOwnProperty('token')) {
                            // On store le token dans le sessionStorage du navigateur
                            window.sessionStorage.setItem('bearerToken', response['token']);
                        } else {
                            LoggerService.log('Problème réception token !!', LogLevel.DEV);
                        }
                        return;
                    });

                const token = window.sessionStorage.getItem('bearerToken');
                const cloneRequest = request.clone({headers: request.headers.set('Authorization', token !== '' ? token : '')});
                return next.handle(cloneRequest);
            } else {
                const error = err.error.message || err.statusText;
                return throwError(error);
            }
        }));
    }
}

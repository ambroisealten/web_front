import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { environment } from 'src/environments/environment';

/**
 * Service pour récupérer les routes
 */
@Injectable()
export class RoutingService {

    constructor(
        private httpClient: HttpClient,
        private errorService: ErrorService) { }

    public getRoute(): Observable<{} | Route[]> {

        const token = window.sessionStorage.getItem('bearerToken');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token !== '' ? token : ''
        });
        const options = { headers };

        return this.httpClient
            .get<Route[]>(environment.serverAddress + '/configRouting', options)
            .pipe(retry(), catchError(err => this.errorService.handleError(err)));

    }
}

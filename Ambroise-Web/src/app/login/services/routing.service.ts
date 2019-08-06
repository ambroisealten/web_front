import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService, LogLevel } from '../../services/logger.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { timeout } from 'rxjs/internal/operators/timeout';
import {Route, Router } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';
import { catchError } from 'rxjs/operators';

/**
 * Service pour récupérer les routes
 */
@Injectable()
export class RoutingService {

    constructor(private httpClient: HttpClient, 
        private errorService: ErrorService){}

    public getRoute(): Observable<{} | Route[]> {

        let token = window.sessionStorage.getItem('bearerToken') ; 
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
        });
        let options = { headers: headers };

        return this.httpClient
            .get<Route[]>( environment.serverAddress + '/configRouting', options)
            .pipe(timeout(5000), catchError(err => this.errorService.handleError(err)))
            
    }
}
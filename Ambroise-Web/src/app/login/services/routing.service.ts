import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService, LogLevel } from '../../services/logger.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { timeout } from 'rxjs/internal/operators/timeout';
import { Routes, Route, Router } from '@angular/router';

/**
 * Service pour récupérer les routes
 */
@Injectable()
export class RoutingService {

    private routeReceptionStatut = new BehaviorSubject(undefined) ; 
    routeReceptionObservable = this.routeReceptionStatut.asObservable() ; 

    constructor(private httpClient: HttpClient, private router: Router){}

    public getRoute(): Observable<Route[]> {

        let token = window.sessionStorage.getItem('bearerToken') ; 
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
        });
        let options = { headers: headers };

        return this.httpClient
            .get<Route[]>( environment.serverAddress + '/configRouting', options)
            .pipe(timeout(5000))
            
    }
}
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { timeout, catchError } from 'rxjs/operators';
import { Menu } from '../models/menu';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/app/services/error.service';

@Injectable()
export class HeaderService {

    constructor(private httpClient: HttpClient,
        private errorService: ErrorService) { }

    init(): Observable<{} | Menu[]> {

        let token = window.sessionStorage.getItem("bearerToken");
        LoggerService.log("Appel de : init()", LogLevel.DEBUG);

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
        });
        let options = { headers: headers };

        return this.httpClient
            .get<Menu[]>(environment.serverAddress + '/configMenu', options)
            .pipe(timeout(5000), catchError(err => this.errorService.handleError(err)))

    }
}

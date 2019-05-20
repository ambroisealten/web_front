import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { timeout, catchError } from 'rxjs/operators';
import { Menu } from '../models/menu';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';

@Injectable()
export class HeaderService {

    constructor(private httpClient: HttpClient,
        private errorService: ErrorService,
        private httpHeaderService: HttpHeaderService) { }

    init(): Observable<{} | Menu[]> {

        let options = this.httpHeaderService.getHttpHeaders() ; 

        return this.httpClient
            .get<Menu[]>(environment.serverAddress + '/configMenu', options)
            .pipe(timeout(5000), catchError(err => this.errorService.handleError(err)))

    }
}

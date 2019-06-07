import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { environment } from 'src/environments/environment';
import { Agency } from '../models/Agency';

@Injectable()
export class AdminAgencyService {

    constructor(
        private httpClient: HttpClient,
        private httpHeaderService: HttpHeaderService,
        private errorService: ErrorService) { }

    getAgencies(): Observable<{} | Agency[]> {
        let options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .get<Agency[]>(environment.serverAddress + '/agencies', options)
            .pipe(retry(), catchError(error => this.errorService.handleError(error)));
    }

    createAgency(agency: Agency) {
        let options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .post<Agency>(environment.serverAddress + '/agency', agency, options)
            .pipe(retry(), catchError(error => this.errorService.handleError(error)));
    }

    updateAgency(agency: Agency) {
        let options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .put<Agency>(environment.serverAddress + '/agency', agency, options)
            .pipe(retry(), catchError(error => this.errorService.handleError(error)));
    }

    deleteAgency(agency: Agency) {
        let postParams = {
            name: agency.name,
            place: agency.place,
            placeType: agency.placeType
        };
        let options = {
            body: postParams,
            headers: this.httpHeaderService.getHttpHeaders()['headers'],
        };
        return this.httpClient
            .delete<Agency>(environment.serverAddress + '/agency', options)
            .pipe(retry(), catchError(error => this.errorService.handleError(error)));
    }
}
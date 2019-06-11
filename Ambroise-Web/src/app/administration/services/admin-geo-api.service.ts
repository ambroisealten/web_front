import { Injectable } from '@angular/core';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { ErrorService } from 'src/app/services/error.service';
import { Observable, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, timeout, retry, retryWhen, mergeMap, finalize } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

@Injectable()
export class AdminGeoApiService {

    constructor(
        private httpClient: HttpClient,
        private httpHeaderService: HttpHeaderService,
        private errorService: ErrorService) { }

    updateGeoApi() {
        let options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .post(environment.serverAddress + '/admin/synchronize/geographics', options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

}
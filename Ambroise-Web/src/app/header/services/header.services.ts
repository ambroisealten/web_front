import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, timeout } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { environment } from 'src/environments/environment';

@Injectable()
export class HeaderService {

    constructor(
        private httpClient: HttpClient,
        private errorService: ErrorService,
        private httpHeaderService: HttpHeaderService) { }

    init() {
        const options = this.httpHeaderService.getHttpHeaders();

        return this.httpClient
            .get(environment.serverAddress + '/configMenu', options)
            .pipe(timeout(5000), catchError(err => this.errorService.handleError(err)));
    }
}

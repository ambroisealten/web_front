import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { environment } from 'src/environments/environment';

@Injectable()
/**
* Service to handle Skills models
*/
export class DiplomasService {

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService,
    private httpHeaderService: HttpHeaderService) { }

  /**
   * HTTP Get request to get all Diplomas
   */
  getAllDiplomas() {
    let options = this.httpHeaderService.getHttpHeaders();
    return this.httpClient
      .get(environment.serverAddress + '/diplomas/', options)
      .pipe(retry(20), catchError(error => this.errorService.handleError(error)));
  }
}
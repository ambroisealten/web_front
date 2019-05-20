import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { timeout, catchError } from 'rxjs/operators';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';

@Injectable()
/**
* Service to handle Skills models
*/
export class DiplomasService {
    
  constructor(private httpClient: HttpClient,
    private errorService: ErrorService,
    private httpHeaderService: HttpHeaderService) { }

  /**
   * HTTP Get request to get all Diplomas
   */
  getAllDiplomas() {
    let options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .get(environment.serverAddress + '/diplomas/', options)
      .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }
}
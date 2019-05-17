import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { timeout, catchError } from 'rxjs/operators';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { ErrorService } from 'src/app/services/error.service';

@Injectable()
/**
* Service to handle Skills models
*/
export class DiplomasService {
    
  constructor(private httpClient: HttpClient,
    private errorService: ErrorService) { }

  token = window.sessionStorage.getItem("bearerToken");
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.token != "" ? this.token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
  });
  options = { headers: this.headers };

  /**
   * HTTP Get request to get all Diplomas
   */
  getAllDiplomas() {
    return this.httpClient
      .get(environment.serverAddress + '/diplomas/', this.options)
      .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }
}
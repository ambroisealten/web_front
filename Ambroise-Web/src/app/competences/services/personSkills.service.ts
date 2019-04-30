import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Person, PersonRole } from '../models/person';
import { catchError, timeout } from 'rxjs/operators';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';

@Injectable()
/**
* Service to handle person creation and update in skills module
*/
export class PersonSkillsService {

  constructor(private httpClient: HttpClient) { }

  token = window.sessionStorage.getItem("bearerToken");
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.token != "" ? this.token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
  });
  options = { headers: this.headers };

  /**
   * HTTP Post request to create a new Person in db
   * @param  person Person to create
   */
  createNewPerson(person: Person) {
    let urlRequest :string;

    if(person.role.toUpperCase() === PersonRole.APPLICANT)
    urlRequest = environment.serverAddress + '/applicant';
    else
    urlRequest = environment.serverAddress + '/consultant';

    return this.httpClient
        .post<Person>(urlRequest, person, this.options)
        .pipe(timeout(5000), catchError(err => this.handleError(err)));
  }

  /**
   * HTTP Put request to update a person in db
   * @param  person Person to update
   */
  updatePerson(person: Person) {
    let urlRequest :string;
    if(person.role.toUpperCase() === PersonRole.APPLICANT)
      urlRequest = environment.serverAddress + '/applicant';
    else
      urlRequest = environment.serverAddress + '/consultant';

    return this.httpClient
        .put<Person>(urlRequest, person, this.options)
        .pipe(timeout(5000), catchError(err => this.handleError(err)));
  }

  /**
   * HTTP Get request to get a Person given its mail
   * @param  mail Person's mail
   */
  getPersonByMail(mail: String) {
    return this.httpClient
      .get<Person>(environment.serverAddress + '/person/' + mail, this.options)
      .pipe(timeout(5000), catchError(error => this.handleError(error)));
  }

  handleError(error) {
    LoggerService.log(error, LogLevel.DEBUG);
    return undefined;
  }
}

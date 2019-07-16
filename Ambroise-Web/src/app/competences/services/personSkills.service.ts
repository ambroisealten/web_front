import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Person, PersonRole } from '../models/person';
import { catchError, timeout } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';

@Injectable()
/**
* Service to handle person creation and update in skills module
*/
export class PersonSkillsService {

  constructor(private httpClient: HttpClient,
              private errorService: ErrorService,
              private httpHeaderService: HttpHeaderService) { }

  /**
   * HTTP Get request to get all Skills
   */
  getAllPersons() {
    let options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .get<Person[]>(environment.serverAddress + '/persons/', options)
      .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }

  /**
   * HTTP Post request to create a new Person in db
   * @param  person Person to create
   */
  createNewPerson(person: Person) {
    let urlRequest: string;

    if (person.role.toUpperCase() === PersonRole.APPLICANT) {
      urlRequest = environment.serverAddress + '/applicant';
    } else if (person.role.toUpperCase() === PersonRole.CONSULTANT) {
      urlRequest = environment.serverAddress + '/consultant';
    } else {
      urlRequest = environment.serverAddress + '/archive';
    }
    let options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .post<Person>(urlRequest, person, options)
      .pipe(timeout(5000), catchError(err => this.errorService.handleError(err)));
  }

  createNewPersonAndSkillsSheet(personAndSkillsSheet) {
    let urlRequest: string;
    const person = personAndSkillsSheet.person;

    if (person.role.toUpperCase() === PersonRole.APPLICANT) {
      urlRequest = environment.serverAddress + '/applicantAndSkillsSheet';
    } else if (person.role.toUpperCase() === PersonRole.CONSULTANT) {
      urlRequest = environment.serverAddress + '/consultantAndSkillsSheet';
    } else {
      urlRequest = environment.serverAddress + '/consultantAndSkillsSheet';
    }
    let options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .post<Person>(urlRequest, personAndSkillsSheet, options)
      .pipe(timeout(5000), catchError(err => this.errorService.handleError(err)));
  }

  /**
   * HTTP Put request to update a person in db
   * @param  person Person to update
   */
  updatePerson(person: Person) {
    let urlRequest: string;
    if (person.role.toUpperCase() === PersonRole.APPLICANT) {
      urlRequest = environment.serverAddress + '/applicant';
    } else if (person.role.toUpperCase() === PersonRole.CONSULTANT) {
      urlRequest = environment.serverAddress + '/consultant';
    } else {
      urlRequest = environment.serverAddress + '/archive';
    }
    let options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .put<Person>(urlRequest, person, options)
      .pipe(timeout(5000), catchError(err => this.errorService.handleError(err)));
  }

  /**
   * HTTP Get request to get a Person given its mail
   * @param  mail Person's mail
   */
  getPersonByMail(mail: string) {
    let options = this.httpHeaderService.getHttpHeaders() ;
    return this.httpClient
      .get<Person>(environment.serverAddress + '/person/' + mail, options)
      .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
  }

}

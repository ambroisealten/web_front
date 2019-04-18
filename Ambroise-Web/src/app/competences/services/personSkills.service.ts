import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Person, PersonRole } from '../models/person';
import { catchError, timeout } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';

@Injectable()
/**
* Service to handle person creation and update in skills module
*/
export class PersonSkillsService {

  constructor(private httpClient: HttpClient) { }
  /*
  private personInformation = new BehaviorSubject(undefined);
  personObservable = this.personInformation.asObservable();
  */
  createNewPerson(person: Person) {
    let token = window.sessionStorage.getItem("bearerToken");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    let options = { headers: headers };

    let postParams = {
      mail: person.mail,
      surname: person.surname,
      name: person.name,
      monthlyWage: "0",
      urlDocs: "",
      personInChargeMail: "abc@gmail.com",
      highestDiploma: "",
      highestDiplomaYear: "",
      job: "",
      employer: ""
    }

    let urlRequest :string;
    if(person.role === PersonRole.APPLICANT)
    urlRequest = environment.serverAddress + '/applicant';
    else
    urlRequest = environment.serverAddress + '/consultant';

    return this.httpClient
        .post<Person>(urlRequest, person, options)
        .pipe(timeout(5000), catchError(err => this.handleError(err)));
  }

  updatePerson(person: Person) {
    let token = window.sessionStorage.getItem("bearerToken");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    let options = { headers: headers };

    let urlRequest :string;
    if(person.role === PersonRole.APPLICANT)
      urlRequest = environment.serverAddress + '/applicant';
    else
      urlRequest = environment.serverAddress + '/consultant';

    return this.httpClient
        .patch(urlRequest, person, options)
        .pipe(timeout(5000), catchError(err => this.handleError(err)));
  }


  handleError(error) {
    LoggerService.log(error, LogLevel.DEBUG);
    return undefined;
  }

  /*
  notifyPersoninformation(person: {} | Person){
    this.personInformation.next(person);
  }

  resetPersonInformation(){
    this.personInformation.next(undefined);
  }


  getPersonByMail(mail: string, role: PersonRole) {
    let token = window.sessionStorage.getItem("bearerToken");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    let options = { headers: headers };

    let urlRequest :string;
    if(role === PersonRole.APPLICANT)
      urlRequest = environment.serverAddress + '/applicant/' + mail;
    else
      urlRequest = environment.serverAddress + '/consultant/' + mail;

    return this.httpClient
      .get<Person>(urlRequest, options)
      .pipe(timeout(5000), catchError(error => this.handleError(error)));
    }

  handleError(error) {
    LoggerService.log(error, LogLevel.DEBUG);
    return undefined;
  }
}

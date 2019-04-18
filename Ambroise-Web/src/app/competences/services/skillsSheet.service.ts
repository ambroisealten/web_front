import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { timeout, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Person } from '../models/person';
import { SkillsSheet } from '../models/skillsSheet';

@Injectable()
/**
* Service to handle skillsSheet creation and update
*/
export class SkillsSheetService {

  /**
  * Temporary hardcoded json for data
  */

  skillsArray = [];

  softSkillsArray = [];

  lastModificationsArray = [
    {
      manager: 'Joyce',
      date: '01/03/19',
      action: 'Création'
    },
    {
      manager: 'Joyce',
      date: '15/03/19',
      action: 'Mise à jour'
    }
  ];

  candidateFormItems = [
    {
      label: 'Diplôme',
      type: 'text',
      id: 'diploma'
    },
    {
      label: 'Année de diplôme',
      type: 'text',
      id: 'diplomaYear'
    },
    {
      label: 'Employeur',
      type: 'text',
      id: 'employer'
    },
    {
      label: 'Métier',
      type: 'text',
      id: 'job'
    },
    {
      label: 'Disponibilité',
      type: 'date',
      id: 'disponibility'
    },
    {
      label: 'Années d\'expérience',
      type: 'number',
      id: 'experienceYears'
    },
    {
      label: 'Prétention salariale',
      type: 'number',
      id: 'wageClaim'
    }
  ];

  consultantFormItems = [
    {
      label: 'Diplôme',
      type: 'text',
      id: 'diploma'
    },
    {
      label: 'Année de diplôme',
      type: 'text',
      id: 'diplomaYear'
    },
    {
      label: 'Métier',
      type: 'text',
      id: 'job'
    },
    {
      label: 'Salaire',
      type: 'number',
      id: 'wage'
    }
  ];

  constructor(private httpClient: HttpClient) { }

  private skillSheetInformation = new BehaviorSubject(undefined);
  skillsSheetObservable = this.skillSheetInformation.asObservable();

  createNewSkillsSheet(skillsSheet: SkillsSheet):Observable<{} | SkillsSheet> {
    let token = window.sessionStorage.getItem("bearerToken");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    let options = { headers: headers };

    let postParams = {
        name: skillsSheet.name,
        personMail: skillsSheet.mailPersonAttachedTo,
        softskills: skillsSheet.softskills,
        techskills: skillsSheet.techskills,
        authorMail: skillsSheet.authorMail
    }

    return this.httpClient
        .post(environment.serverAddress + '/skillsheet', postParams, options)
        .pipe(timeout(5000), catchError(error => this.handleSkillsSheetError(error)));
  }

  handleSkillsSheetError(error){
    LoggerService.log(error, LogLevel.DEBUG);
    return undefined;
  }

  notifySkillsSheetinformation(skillsSheet: {} | SkillsSheet){
    this.skillSheetInformation.next(skillsSheet);
  }

  resetSkillsSheetInformation(){
    this.skillSheetInformation.next(undefined);
  }

  getAllSkillSheets():Observable<{} | SkillsSheet[]>{
    let token = window.sessionStorage.getItem("bearerToken");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    let options = { headers: headers };

    return this.httpClient
        .get<{} | SkillsSheet[]>(environment.serverAddress + '/skillsheets', options)
        .pipe(timeout(5000), catchError(error => this.handleskillSheetsListError(error)));
  }

  handleskillSheetsListError(error){
    LoggerService.log(error, LogLevel.DEBUG); // TODO add errors in switch/case
    return undefined;
  }

  /**
  * Get skills for current skillsSheet
  * @return skills array
  */
  getSkills() {
    return this.skillsArray;
  }

  /**
  * Get soft skills for current skillsSheet
  * @return soft skills array
  */
  getSoftSkills() {
    return this.softSkillsArray;
  }

  /**
  * Update skills for current skillsSheet
  * @param newSkillsArray
  */
  updateSkills(newSkillsArray) {
    this.skillsArray = newSkillsArray;
  }

  /**
  * Update soft skills for current skillsSheet
  * @param newSoftSkillsArray
  */
  updateSoftSkills(newSoftSkillsArray) {
    this.softSkillsArray = newSoftSkillsArray;
  }
}

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { timeout, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Person } from '../models/person';

@Injectable()
/**
* Service to handle skillsSheet creation and update
*/
export class SkillsSheetService {

  /**
  * Temporary hardcoded json for data
  */
  ficheCompetence =  [
    {
      NameOfFiche: "010718MM",
      NomPersonne: "MAQUINGHEN",
      PrenomPersonne: "Maxime",
      StatutPersonne: "Consultant",
      DiplomeFiche: "Epitech",
      EmployeurFiche: "Alten",
      metierFiche: "Chef de Projet",
      DisponibiliteFiche: "07/01/2019",
      AnneediplomeFiche: "2019",
      SalaireFiche: "15000€/an",
      AvisFiche: "A",
      CommentaireFiche: "ça va",
    }
  ];

  skillsArray = [
    {
      skillName: 'Python',
      grade: "4",
    },
    {
      skillName: 'C++',
      grade: "3",
    },
    {
      skillName: "Angular",
      grade: "2",
    }
  ];

  softSkillsArray = [
    {
      skillName: 'Gestion de Projet',
      grade: "4",
    },
    {
      skillName: 'Cycle en V',
      grade: "4",
    }
  ];

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

  private personInformation = new BehaviorSubject(undefined);
  personObservable = this.personInformation.asObservable();

  checkPersonExistence(personMail: String, isApplicant: boolean):Observable<Person> {
    let token = window.sessionStorage.getItem("bearerToken");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    let options = { headers: headers };

    let urlRequest :string;
    if(isApplicant)
      urlRequest = environment.serverAddress + '/applicant/' + personMail;
    else
      urlRequest = environment.serverAddress + '/consultant/' + personMail;

    return this.httpClient
        .get<Person>(urlRequest, options)
        .pipe(timeout(5000), catchError(err => this.handleError(err)))
        /*.toPromise()
        .then(personData => {
          if(personData != undefined) {
            this.personInformation.next(personData); // person information from DB
            this.currentPerson = personData as Person;
          }
        })
        .catch(error => {
          switch(error.status) {
            case 404 :
              this.personInformation.next(false); // person not found in DB
              break;
            default:
              LoggerService.log('New error : ' + error, LogLevel.DEBUG); // TODO add errors in switch/case
              break;
          }
    });
    */
  }

  handleError(err){
    switch(err.status) {
      case 404 :
        this.personInformation.next(false); // person not found in DB
        break;
      default:
        LoggerService.log('New error : ' + err, LogLevel.DEBUG); // TODO add errors in switch/case
        break;
    }
    return undefined ; 
  }

  notifyPersoninformation(person: Person){
    this.personInformation.next(person)
  }

  resetPersonInformation(){
    this.personInformation.next(undefined);
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

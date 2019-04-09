import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

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
      type: 'text'
    },
    {
      label: 'Employeur',
      type: 'text'
    },
    {
      label: 'Métier',
      type: 'text'
    },
    {
      label: 'Disponibilité',
      type: 'date'
    },
    {
      label: 'Année de diplôme',
      type: 'text'
    },
    {
      label: 'Années d\'expérience',
      type: 'number'
    },
    {
      label: 'Prétention salariale',
      type: 'number'
    }
  ];

  consultantFormItems = [
    {
      label: 'Diplôme',
      type: 'text'
    },
    {
      label: 'Métier',
      type: 'text'
    },
    {
      label: 'Année de diplôme',
      type: 'text'
    },
    {
      label: 'Salaire',
      type: 'number'
    }
  ];

  MatriceCompetence = {

  };

  CvCompetence = {

  };


  constructor(/*private httpClient: HttpClient*/) { }

  /*getIdentityFromService(callback){
  this.httpClient
  .get('http://localhost:4200/')
  .subscribe(data => {
  callback(JSON.stringify(data));
  },  error => {
  console.log(error);
  });
  }

  //this.ficheCompetence = "toto"//requete;
  */
  getSkills() {
    return this.skillsArray;
  }

  getSoftSkills() {
    return this.softSkillsArray;
  }

  updateSkills(newSkillsArray) {
    this.skillsArray = newSkillsArray;
  }

  updateSoftSkills(newSoftSkillsArray) {
    this.softSkillsArray = newSoftSkillsArray;
  }
}

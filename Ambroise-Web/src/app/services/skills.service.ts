import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to handle skillsSheet creation and update
 */
export class SkillsService {

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

  constructor() { }

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

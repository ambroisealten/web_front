import { Person, PersonRole } from './person';

export class SkillsSheet {
      id: String;
      name: string;
      versionNumber: number;
      mailPersonAttachedTo: String;
      softSkillsList: Skill[];
      techSkillsList: Skill[];
      mailVersionAuthor: String;
      rolePersonAttachedTo: PersonRole;
      averageSoftSkillsGrade: number;

    constructor(name: string, person: Person) {
      this.name = name;
      this.mailPersonAttachedTo = person.mail;
      this.softSkillsList = [];
      this.techSkillsList = [];
      this.versionNumber = 1 ; 
      this.mailVersionAuthor = "";
      this.rolePersonAttachedTo = person.role;
      this.averageSoftSkillsGrade = 0;
    }

    addTechSkill(skill: Skill) {
      this.techSkillsList.push(skill);
    }

    removeTechSkill(skillToRemove: Skill) {
      let skillToRemoveIndex = this.techSkillsList.findIndex(skill => skill === skillToRemove);

      this.techSkillsList.splice(skillToRemoveIndex, 1);
    }

    addSoftSkill(skill: Skill) {
      this.softSkillsList.push(skill);
    }

    removeSoftSkill(skillToRemove: Skill) {
      let skillToRemoveIndex = this.softSkillsList.findIndex(skill => skill === skillToRemove);

      this.softSkillsList.splice(skillToRemoveIndex, 1);
    }

    getAverageSoftSkillGrade() {
      let sumGrades = 0;
      for(let softSkill of this.softSkillsList) {
        sumGrades += softSkill.grade;
      }
      return sumGrades / this.softSkillsList.length;
    }
}

export class Skill {
  name: string;
  grade: number;

  constructor(name: string, grade: number) {
    this.name = name;
    this.grade = grade;
  }
}

export enum Avis {
  PPP,
	PP,
  P,
  M,
  MM,
  MMM,
  NOK
}

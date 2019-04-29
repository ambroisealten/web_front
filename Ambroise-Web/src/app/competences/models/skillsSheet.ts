import { Person, PersonRole } from './person';

/**
 * Class containing skillSheet data
 */
export class SkillsSheet {
      id: String;
      name: string;
      versionNumber: number;
      mailPersonAttachedTo: String;
      skillsList: Skill[] ;
      mailVersionAuthor: String;
      rolePersonAttachedTo: PersonRole;
      averageSoftSkillsGrade: number;

    constructor(name: string, person: Person) {
      this.name = name;
      this.mailPersonAttachedTo = person.mail;
      this.versionNumber = 1 ;
      this.skillsList = [] ;
      this.mailVersionAuthor = "cunmail@mail.com";
      this.rolePersonAttachedTo = person.role;
      this.averageSoftSkillsGrade = 0;
    }

    addSkill(skillToAdd: Skill){
      this.skillsList.push(skillToAdd) ;
    }
    removeSkill(skillToRemove: Skill) {
      let skillToRemoveIndex = this.skillsList.findIndex(skill => skill === skillToRemove);

      this.skillsList.splice(skillToRemoveIndex, 1);
    }

    getAverageSoftSkillGrade():number {
      let sumGrades = 0;
      let countSoft = 0;
      for(let softSkill of this.skillsList) {
        if(softSkill.hasOwnProperty('isSoft')){
          sumGrades += softSkill.grade;
          countSoft += 1 ;
        }
      }
      if(countSoft != 0){
        return sumGrades / countSoft ;
      }
      return 0 ;
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

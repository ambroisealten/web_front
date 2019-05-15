import { Person, PersonRole } from './person';

/**
 * Class containing skillSheet data
 */
export class SkillsSheet {
      id: string;
      name: string;
      versionNumber: number;
      versionDate: string;
      skillsList: SkillGraduated[] ;
      mailPersonAttachedTo: string;
      mailVersionAuthor: string;
      rolePersonAttachedTo: PersonRole;
      averageSoftSkillsGrade: number;

    constructor(name: string, person: Person) {
      this.name = name;
      this.mailPersonAttachedTo = person.mail;
      this.versionNumber = 1 ;
      this.versionDate = "";
      this.skillsList = [] ;
      this.mailVersionAuthor = "manager.manu@alten.com";
      this.rolePersonAttachedTo = person.role;
      this.averageSoftSkillsGrade = 0;
    }

    addSkill(skillToAdd: SkillGraduated){
      this.skillsList.push(skillToAdd) ;
    }

    removeSkill(skillToRemove: SkillGraduated) {
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

export class SkillGraduated {
  skill: Skill;
  grade: number;

  constructor(skill: Skill, grade: number) {
    this.skill = skill;
    this. grade = grade;
  }
}

export class Skill {
  name: string;
  isSoft?: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class SkillsSheetVersions {
  manager: string;
  date: string;
  name: string;
  versionNumber: number;

  constructor(manager: string, date: string, name: string, versionNumber: number) {
    this.manager = manager;
    this.date = date;
    this.name = name;
    this.versionNumber = versionNumber;
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

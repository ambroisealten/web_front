import { Person, PersonRole } from './person';

export class SkillsSheet {
      id: String;
      name: string;
      versionNumber: number;
      rolePersonAttachedTo: PersonRole;
      mailPersonAttachedTo: String;
      softSkillsList: any[];
      techSkillsList: any[];
      mailVersionAuthor: String;

    constructor(name: string, person: Person) {
      this.name = name;
      this.rolePersonAttachedTo = person.role;
      this.mailPersonAttachedTo = person.mail;
      this.softSkillsList = [];
      this.techSkillsList= [];
      this.mailVersionAuthor = "";
      this.versionNumber = 1 ;
    }

    addTechSkill(skill: Skill) {
      this. techSkillsList.push(skill);
    }

    removeTechSkill(skillToRemove: Skill) {
      let skillToRemoveIndex = this. techSkillsList.findIndex(skill => skill.skillName === skillToRemove);

      this. techSkillsList.splice(skillToRemoveIndex, 1);
    }

    addSoftSkill(skill: Skill) {
      this.softSkillsList.push(skill);
    }

    removeSoftSkill(skillToRemove: Skill) {
      let skillToRemoveIndex = this.softSkillsList.findIndex(skill => skill.skillName === skillToRemove);

      this.softSkillsList.splice(skillToRemoveIndex, 1);
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

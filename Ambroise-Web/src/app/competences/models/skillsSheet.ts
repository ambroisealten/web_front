import { Person, PersonRole } from './person';

export class SkillsSheet {
      id: String;
      name: string;
      versionNumber: String;
      mailPersonAttachedTo: String;
      softskills: any[];
      techskills: any[];
      authorMail: String;
      person: Person;

    constructor(name: string, person: Person) {
      this.name = name;
      this.mailPersonAttachedTo = person.mail;
      this.softskills = [];
      this.techskills = [];
      this.authorMail = "";
      this.person = person ; 
    }

    addTechSkill(skill: Skill) {
      this.techskills.push(skill);
    }

    getPerson(){
      return this.person ; 
    }

    removeTechSkill(skillToRemove: Skill) {
      let skillToRemoveIndex = this.techskills.findIndex(skill => skill.skillName === skillToRemove);

      this.techskills.splice(skillToRemoveIndex, 1);
    }

    addSoftSkill(skill: Skill) {
      this.softskills.push(skill);
    }

    removeSoftSkill(skillToRemove: Skill) {
      let skillToRemoveIndex = this.softskills.findIndex(skill => skill.skillName === skillToRemove);

      this.softskills.splice(skillToRemoveIndex, 1);
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

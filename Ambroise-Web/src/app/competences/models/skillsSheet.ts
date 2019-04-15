import { Person } from './person';

export class SkillsSheet {
      id: String;
      name: String;
      versionNumber: String;
      role: String;
      personMail: String;
      softskills: any[];
      techskills: any[];
      authorMail: String;

      personLastname: String;
      personFirstName: String;
      StatutPersonne: String;
      DiplomeFiche: String;
      EmployeurFiche: String;
      metierFiche: String;
      DisponibiliteFiche: String;
      AnneediplomeFiche: String;
      SalaireFiche: String;
      AvisFiche: String;
      CommentaireFiche: String;

    constructor(name: String, person: Person) {
      this.name = name;
      this.role = person.role;
      this.personMail = person.mail;
    }
}

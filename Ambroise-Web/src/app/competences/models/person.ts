export class Person {
  id: String;
  mail: String;
  surname: String;
  name: String;
  job: String;
  employer: String;
  monthlyWage: number;
  role: PersonRole;
  personInCharge: String;
  urlDocs: String[];
  highestDiploma: String;

  StatutPersonne: String;
  DisponibiliteFiche: String;
  AnneediplomeFiche: String;
  AvisFiche: String;
  CommentaireFiche: String;

  constructor(surname:String, name:String, mail:String, role:PersonRole) {
    this.surname = surname;
    this.name = name;
    this.mail = mail;
    this.role = role;
  }
}

export enum PersonRole {
  DEMISSIONAIRE = "demissionaire",
	APPLICANT = "applicant",
	CONSULTANT = "consultant"
}

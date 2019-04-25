export class Person {
  id: String;
  mail: String;
  surname: String;
  name: String;
  job: String;
  employer: String;
  monthlyWage: String;
  role: PersonRole;
  personInChargeMail: String;
  urlDocs: String[];
  highestDiploma: String;
  highestDiplomaYear: String ;

  constructor(surname:String, name:String, mail:String, role:PersonRole) {
    this.surname = surname;
    this.name = name;
    this.mail = mail;
    this.role = role;
    this.job = "" ;
    this.employer = "" ;
    this.monthlyWage = "0" ;
    this.personInChargeMail = "" ;
    this.urlDocs = [] ;
    this.highestDiploma = "" ;
    this.highestDiplomaYear = "" ;
  }
}

export enum PersonRole {
  DEMISSIONAIRE = "DEMISSIONAIRE",
	APPLICANT = "APPLICANT",
	CONSULTANT = "CONSULTANT"
}

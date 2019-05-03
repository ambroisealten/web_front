/**
 * Class containing a Person's data
 */
export class Person {
  id: string;
  mail: string;
  surname: string;
  name: string;
  job: string;
  employer: string;
  monthlyWage: string;
  role: PersonRole;
  personInChargeMail: string;
  urlDocs: string[];
  highestDiploma: string;
  highestDiplomaYear: string ;
  opinion: string;

  constructor(surname:string, name:string, mail:string, role:PersonRole) {
    this.surname = surname;
    this.name = name;
    this.mail = mail;
    this.role = role;
    this.job = "" ;
    this.employer = "" ;
    this.monthlyWage = "0" ;
    this.personInChargeMail = "tempUserAdminManager@mail.com" ;
    this.urlDocs = [] ;
    this.highestDiploma = "" ;
    this.highestDiplomaYear = "" ;
    this.opinion = "";
  }
}

export enum PersonRole {
  DEMISSIONAIRE = "DEMISSIONAIRE",
	APPLICANT = "APPLICANT",
	CONSULTANT = "CONSULTANT"
}

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
  experienceTime: string;
  availability : Availability;


  constructor(surname:string, name:string, mail:string, role:PersonRole,availability : Availability) {
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
    this.experienceTime = "0";
    this.availability = availability;
  }
}

export class Availability{
  duration : number;
  durationType : string;
  initDate : number;
  finalDate : number;
  
  constructor(){
    this.duration = -1;
    this.durationType ="DAYS" ; 
    this.initDate = 0;
    this.finalDate = 0;
  }
}


export enum PersonRole {
  DEMISSIONNAIRE = "DEMISSIONNAIRE",
	APPLICANT = "APPLICANT",
	CONSULTANT = "CONSULTANT"
}

export enum DurationType {
  DAYS = "jour",
  WEEKS = "semaine",
  MONTHS = "mois",
  FOREVER = "toujours"
}

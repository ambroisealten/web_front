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
  onTimeAvailability: OnTimeAvailability;
  onDateAvailability: OnDateAvailability;


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
    this.experienceTime = "0";
  }
}

export class OnTimeAvailability {
  duration: number;
  durationType: string;
  initDate: number;

  constructor() {
    this.duration = 0;
    this.durationType = "WEEK";
    this.initDate = 0;
  }
}

export class OnDateAvailability {
  finalDate: number;
  initDate: number;

  constructor() {
    this.finalDate = -1;
    this.initDate = 0;
  }
}

export enum PersonRole {
  DEMISSIONNAIRE = "DEMISSIONNAIRE",
	APPLICANT = "APPLICANT",
	CONSULTANT = "CONSULTANT"
}

export enum DurationType {
  DAY = "jours",
  WEEK = "semaines",
  MONTH = "mois"
}

export class User {
    mail: string ;
    name: string; 
    forname: string; 
    role: UserRole;
    agency: string;
    pswd : string;

    constructor(name: string, forName: string, mail: string, role: UserRole, pswd : string) {
        this.name = name ; 
        this.forname = forName ; 
        this.mail = mail ; 
        this.role = role ; 
        this.pswd = pswd;
        this.agency = "Strasbourg";
    }

}

export enum UserRole {
    MANAGER_ADMIN = "Manager Admin",
    CDR_ADMIN = "CDR Admin",
    DEACTIVATED = "Deactivated", 
    CONSULTANT = "Consultant", 
    CDR = "CDR", 
    MANAGER = "Manager",
}
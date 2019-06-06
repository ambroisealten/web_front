export class User {
    mail: string ;
    name: string; 
    forname: string; 
    role: UserRole;
    agency: string;

    constructor(name: string, forName: string, mail: string, role: UserRole) {
        this.name = name ; 
        this.forname = forName ; 
        this.mail = mail ; 
        this.role = role ; 
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
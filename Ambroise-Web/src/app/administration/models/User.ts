export class User {
    mail: string ;
    name: string; 
    forname: string; 
    role: UserRole;
    agency: string;
}

export enum UserRole {
    MANAGER_ADMIN = "Manager Admin",
    CDR_ADMIN = "CDR Admin",
    DEACTIVATED = "Deactivated", 
    CONSULTANT = "Consultant", 
    CDR = "CDR", 
    MANAGER = "Manager",
}
import { Person } from './person';
import { SkillsSheet } from './skillsSheet';

export class Skills{

    person:Person;
    skillsSheet:SkillsSheet;

    constructor(person: Person, skillsSheet: SkillsSheet){
        this.person = person ; 
        this.skillsSheet = skillsSheet ;
    }
}
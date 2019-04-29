import { Person } from './person';
import { SkillsSheet } from './skillsSheet';

/**
 * Class containing data of a Person and a SkillsSheet
 */
export class Skills{

    person:Person;
    skillsSheet:SkillsSheet;

    constructor(person: Person, skillsSheet: SkillsSheet){
        this.person = person ;
        this.skillsSheet = skillsSheet ;
    }
}

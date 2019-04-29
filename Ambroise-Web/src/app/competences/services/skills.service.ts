import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Skills } from '../models/skills';

@Injectable()
/**
* Service to handle Skills models
*/
export class SkillsService {

    private skillsInformation = new BehaviorSubject(undefined);
    skillsObservable = this.skillsInformation.asObservable();

    notifySkills(skills: Skills){
        this.skillsInformation.next(skills);
    }

    resetSkills(){
        this.skillsInformation.next(undefined);
    }

}

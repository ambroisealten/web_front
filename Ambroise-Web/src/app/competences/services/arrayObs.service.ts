import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
/**
* Service to observe array Skills Modification
*/
export class ArrayObsService {

    private arraySkillsInformation = new BehaviorSubject([]);
    arraySkillsObservable = this.arraySkillsInformation.asObservable();

    private arraySoftSkillsInformation = new BehaviorSubject([]);
    arraySoftSkillsObservable = this.arraySoftSkillsInformation.asObservable();
  
    notifySkills(arraySkills: any[]){
        this.arraySkillsInformation.next(arraySkills);
    }

    resetSkills(){
        this.arraySkillsInformation.next([]); 
    }

    notifySoftSkills(arraySoftSkills: any[]){
        this.arraySoftSkillsInformation.next(arraySoftSkills);
    }

    resetSoftSkills(){
        this.arraySoftSkillsInformation.next([]);
    }

}

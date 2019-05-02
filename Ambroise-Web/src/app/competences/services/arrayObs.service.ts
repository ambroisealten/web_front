import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
/**
* Service to observe array Skills Modification
*/
export class ArrayObsService {

    EMPTY = [] ; 

    private arraySkillsInformation = new BehaviorSubject([]);
    arraySkillsObservable = this.arraySkillsInformation.asObservable();

    private arraySoftSkillsInformation = new BehaviorSubject([]);
    arraySoftSkillsObservable = this.arraySoftSkillsInformation.asObservable();

    private arraySkillsVersionsInformation = new BehaviorSubject([]);
    arraySkillsVersionsObservable = this.arraySkillsVersionsInformation.asObservable();

    notifySkills(arraySkills: any[]){
        this.arraySkillsInformation.next(arraySkills);
    }

    resetSkills(){
        this.arraySkillsInformation.next(this.EMPTY);
    }

    notifySoftSkills(arraySoftSkills: any[]){
        this.arraySoftSkillsInformation.next(arraySoftSkills);
    }

    resetSoftSkills(){
        this.arraySoftSkillsInformation.next(this.EMPTY);
    }

    notifySkillsVersions(arraySkillsVersions: any[]) {
      this.arraySkillsVersionsInformation.next(arraySkillsVersions);
    }

    resetSkillsVersions() {
      this.arraySkillsVersionsInformation.next(this.EMPTY);
    }

}

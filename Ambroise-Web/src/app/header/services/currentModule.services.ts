import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class CurrentModuleService {

    
    private currentModuleState = new BehaviorSubject('Missions');
    currentModuleObservable = this.currentModuleState.asObservable();

    notifyCurrentModule(currentModule: string){
        this.currentModuleState.next(currentModule) ; 
    }

}
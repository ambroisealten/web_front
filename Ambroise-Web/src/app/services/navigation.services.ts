import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class HeaderNavigation{

    private currentModul : String;

    constructor(){
        this.currentModul = "Mission";
    }

    setCurrrentModul(currentModul: String ){
        this.currentModul = currentModul;
    }

    getCurrentModul(){
        return this.currentModul;
    }

}
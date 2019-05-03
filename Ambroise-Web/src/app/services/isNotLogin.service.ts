import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Injectable()
export class IsNotLoginService {

    private inLoginState = new BehaviorSubject(true);
    inLoginObservable = this.inLoginState.asObservable();

    notifyLoginOut(loginOut: boolean){
        this.inLoginState.next(loginOut) ; 
    }

}

import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { LoggerService, LogLevel } from './logger.service';

@Injectable()
export class ErrorService {

    constructor(
        private router: Router,){}

    handleError(error): any{
        let statusError = error['error']['status'] ; 
        let messageError = error['error']['message'] ; 
        switch(statusError){
            case(401): 
                this.router.navigate(['login']) ; 
                break ; 
                
            default: 
                break ;
        }
        LoggerService.log(statusError + " : " + messageError, LogLevel.DEV) ; 
        return error ; 
    }

}
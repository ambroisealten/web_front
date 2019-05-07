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
            case(401): LoggerService.log(messageError,LogLevel.PROD)
                this.router.navigate(['login']) ; 
                break ; 
                
            default: LoggerService.log(messageError,LogLevel.PROD)
                break ;
        }
        return error ; 
    }

}
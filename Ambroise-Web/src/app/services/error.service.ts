import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { LoggerService, LogLevel } from './logger.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorService {

    constructor(private router: Router,
        private toastr: ToastrService){}

    /**
     * Gere les erreurs http
     * @param error 
     * @author Quentin Della-Pasqua
     */
    handleError(error): any{
        let statusError = error['error']['status'] ; 
        let messageError = error['error']['message'] ; 
        switch(statusError){
            case(401): 
                this.router.navigate(['login']) ; 
                messageError = "Session expirée. Veuillez vous reconnecter";
                break ; 
            case(403):
                if (this.router.url == '/login')
                    messageError = "Requête refusée. Identifiants et/ou mot de passe incorrects";
                break;
            default: 
                break ;
        }
        LoggerService.log(statusError + " : " + messageError, LogLevel.DEV) ; 
        this.toastr.error(statusError + " - " + messageError, "Désolé, une erreur est survenue",{positionClass: 'toast-bottom-full-width' , closeButton: true})
        return error ; 
    }

}
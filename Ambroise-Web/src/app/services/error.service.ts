import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService, LogLevel } from './logger.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';

@Injectable()
export class ErrorService {

    constructor(
        private router: Router,
        private toastr: ToastrService,
        private dialog: MatDialog) { }

    handleResponse(response) {
        if (response.stackTrace != null) {
            const status = response.stackTrace[0].lineNumber;
            let message = response.localizedMessage;
            switch (status) {
                case (200):
                    message = 'Requête effectuée avec succès';
                    this.toastrGood(status, message);
                    break;
                case (201):
                    message = 'Entité créée avec succès';
                    this.toastrSuccess(status, message);
                    break;
                case (401):
                    message = 'Session expirée. Veuillez vous reconnecter';
                    this.toastrError(status, message);
                    break;
                case (403):
                    message = 'Requête refusée, vous n\'avez pas les privilèges requis';
                    this.toastrError(status, message);
                    break;
                case (404):
                    message = 'La ressource demandée n\'a pas été trouvée';
                    this.toastrError(status, message);
                    break;
                case (409):
                    message = 'Conflit dans la base de données, action annulée';
                    this.toastrError(status, message);
                    break;
                case (422):
                    message = 'L’entité fournie avec la requête est incompréhensible ou incomplète.';
                    this.toastrError(status, message);
                    break;
                case (500):
                    message = 'Erreur interne du serveur, veuillez réessayer ultérieurement';
                    this.toastrError(status, message);
                    break;
                default:
                    this.toastrError(status, message);
                    break;
            }
        }
    }

    handleResponses(responses: any[], statusExpected: number) {
        if (responses.filter(response => response.stackTrace[0].lineNumber === statusExpected).length != 0) {
            this.toastrGood(statusExpected.toString(), 'Requête effectuée avec succès');
        } else {
            // TODO : Implement a more viable and efficient way to analyze errors that we get on our multiple requests
            if(responses.length === 1 && responses[0].stackTrace[0].lineNumber === 403){
                this.toastrError('403','Requête refusée, vous n\'avez pas les privilèges requis');
            }
            else{
                this.toastrError('500', 'Une erreur a été rencontrée au cours du processus, veuillez contacter un administrateur');
            }
        }
    }

    toastrError(statusError: string, messageError: string) {
        LoggerService.log(statusError + ' : ' + messageError, LogLevel.DEV);
        this.toastr.error(statusError + ' - ' + messageError,
            '❌ Désolé, une erreur est survenue', { positionClass: 'toast-bottom-full-width', closeButton: true });
    }

    toastrSuccess(status: string, message: string) {
        LoggerService.log(status + ' : ' + message, LogLevel.DEV);
        this.toastr.success(status + ' - ' + message,
            '✔️', { positionClass: 'toast-bottom-full-width', closeButton: true });
    }

    toastrGood(status: string, message: string) {
        LoggerService.log(status + ' : ' + message, LogLevel.DEV);
        this.toastr.info(status + ' - ' + message,
            '👍', { positionClass: 'toast-bottom-full-width', closeButton: true });
    }

    /**
     * Gere les erreurs http
     * @param error
     * @author Quentin Della-Pasqua
     */
    handleError(error): any {
        this.dialog.closeAll() ; 
        const statusError = error.error['status'];
        let messageError = error.error['message'];
        switch (statusError) {
            case (401):
                this.router.navigate(['login']);
                messageError = 'Session expirée. Veuillez vous reconnecter';
                break;
            case (403):
                if (this.router.url === '/login') {
                    messageError = 'Requête refusée. Identifiants et/ou mot de passe incorrects';
                }
                break;
            case (409):
                messageError = 'Conflit dans la base de données, action annulée';
                break;
            default:
                break;
        }
        console.log("ICI") ;
        this.toastrError(statusError, messageError);
        return error;
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService, LogLevel } from '../../services/logger.service';
import { BehaviorSubject } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as sha512 from 'js-sha512';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';

/**
 * Service pour le login
 */
@Injectable()
export class TokenService {

    //Observable pour vérifier que le token est reçu
    private tokenReceptionState = new BehaviorSubject(false);
    tokenReceptionObservable = this.tokenReceptionState.asObservable();

    constructor(private httpClient: HttpClient,
        private router: Router,
        private errorService: ErrorService) { }

    /**
     * Permet de récupérer un token de session valide si l'utilisateur rentre le bon
     * mot de passe et le bon mail associé
     * @param formInputMail
     * @param formInputPswd
     */
    signIn(formInputMail: string, formInputPswd: string) {

        //Paramètres à envoyée au serveur pour vérifier la connexion
        let postParams = {
            mail: formInputMail,
            pswd: sha512.sha512(formInputPswd),
            //pswd: formInputPswd
        }

        LoggerService.log(postParams.mail + ":::" + postParams.pswd, LogLevel.DEBUG);

        //Requête POST au WS : login => Objectif récupérer un token de session valide
        return this.httpClient.post(environment.serverAddress + '/login', postParams)
            //Timeout pour éviter de rester bloquer sur l'authentification si serveur injoignable
            .pipe(timeout(5000), catchError(err => this.errorService.handleError(err)))
            //Effectue une action dès la réception du token
            .subscribe(token => {
                //Check si la propriété Token existe
                if (token.hasOwnProperty('token')){
                    //On store le token dans le sessionStorage du navigateur
                    window.sessionStorage.setItem("bearerToken",token['token']);
                    //Notification de l'observable pour notifier la réception d'un token
                    this.tokenReceptionState.next(true);
                }
            })

    }

    signOut() {
        //TO-DO : redirect login page
        window.sessionStorage.clear();
        this.router.navigate(['login']) ; 
    }

    notifyTokenReception(received:boolean){
        this.tokenReceptionState.next(received) ;
    }
}

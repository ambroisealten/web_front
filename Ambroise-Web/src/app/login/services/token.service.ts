import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService, LogLevel } from '../../services/logger.service';
import { BehaviorSubject } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as sha512 from 'js-sha512';

/**
 * Service pour le login
 */
@Injectable()
export class TokenService {

    //Observable pour vérifier que le token est reçu
    private tokenReceptionState = new BehaviorSubject(false);
    tokenReceptionObservable = this.tokenReceptionState.asObservable();

    constructor(private httpClient: HttpClient) { }

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
            .pipe(timeout(5000))
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
            /*
            .toPromise()
            .then(token => {
                if (token != undefined) {
                    //console.log("Property token exist ? : " + token['token'])  ;
                    window.sessionStorage.setItem("bearerToken",token['token']);
                    this.tokenReceptionState.next(true);
                }
            })
            */
            /*
            .catch(error => {
                console.log(error);
                //  TO-DO : traiter les erreur liée au timeout et les erreur HTTP
            });
            */

        /*switch (error.status) {
            case 0: alert("500 : internal server error"); break;
            case 403: alert("identifiant/mdp incorrect"); break;
            default: console.log("HEIN?  " + error); break;  //TO-LOG
        }*/

    }

    signOut() {
        //TO-DO : redirect login page
        window.sessionStorage.clear();
    }

    notifyTokenReception(received:boolean){
        this.tokenReceptionState.next(received) ;
    }
}

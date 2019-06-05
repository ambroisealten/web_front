import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as sha512 from 'js-sha512';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { environment } from 'src/environments/environment';
import { LoggerService, LogLevel } from '../../services/logger.service';

/**
 * Service pour le login
 */
@Injectable()
export class TokenService {

    // Observable pour vérifier que le token est reçu
    private tokenReceptionState = new BehaviorSubject(false);
    tokenReceptionObservable = this.tokenReceptionState.asObservable();

    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private errorService: ErrorService) { }

    /**
     * Permet de récupérer un token de session valide si l'utilisateur rentre le bon
     * mot de passe et le bon mail associé
     * @param formInputMail
     * @param formInputPswd
     */
    signIn(formInputMail: string, formInputPswd: string, stayConnected: boolean) {
        // Paramètres à envoyée au serveur pour vérifier la connexion
        const postParams = {
            mail: formInputMail,
            pswd: sha512.sha512(formInputPswd),
            stayConnected,
        };

        LoggerService.log('StayConnected:::'
            + postParams.stayConnected
            + ':::' + postParams.mail
            + ':::' + postParams.pswd, LogLevel.DEBUG);

        // Requête POST au WS : login => Objectif récupérer un token de session valide
        this.httpClient.post(environment.serverAddress + '/login', postParams)
            // Timeout pour éviter de rester bloquer sur l'authentification si serveur injoignable
            .pipe(catchError(err => this.errorService.handleError(err)))
            // Effectue une action dès la réception du token
            .subscribe(response => {
                // Check si la propriété Token existe
                if (response.hasOwnProperty('access') && response.hasOwnProperty('refresh')) {
                    // On store le token dans le sessionStorage du navigateur
                    window.sessionStorage.setItem('bearerToken', response['access']['token']);
                    window.sessionStorage.setItem('refreshToken', response['refresh']['token']);
                    // Notification de l'observable pour notifier la réception d'un token
                    this.tokenReceptionState.next(true);
                } else {
                    LoggerService.log('Problème réception token !!', LogLevel.DEV);
                }
            });
    }

    signOut() {
        const token = window.sessionStorage.getItem('refreshToken');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token !== '' ? token : ''
        });
        this.httpClient.post(environment.serverAddress + '/signout', '', { headers })
            .pipe(catchError(err => this.errorService.handleError(err)))
            .subscribe(() => {
                window.sessionStorage.clear();
                this.router.navigate(['login']);
            });
    }

    notifyTokenReception(received: boolean) {
        this.tokenReceptionState.next(received);
    }
}

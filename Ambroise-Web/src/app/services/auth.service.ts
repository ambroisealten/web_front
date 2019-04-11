import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService, LogLevel } from './logger.service';
import { BehaviorSubject } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable()
export class AuthService {

    private tokenReceptionState = new BehaviorSubject(false);
    tokenReceptionObservable = this.tokenReceptionState.asObservable();

    constructor(private httpClient: HttpClient) { }

    signIn(formInputMail: String, formInputPswd: String) {

        let postParams = {
            mail: formInputMail,
            //pswd: sha512.sha512(this.userPswd),
            pswd: formInputPswd
        }
        LoggerService.log(postParams.mail + ":::" + postParams.pswd, LogLevel.DEBUG);

        this.httpClient.post('http://localhost:8080/login', postParams)
            .pipe(timeout(5000))
            .toPromise()
            .then(token => {
                if (token != undefined) {
                    window.sessionStorage.setItem("bearerToken", JSON.parse(JSON.stringify(token))["token"]);
                    this.tokenReceptionState.next(true);
                }
            })
            .catch(error => {
                console.log(error);
                //  TO-DO : traiter les erreur liée au timeout et les erreur HTTP
            });

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


}
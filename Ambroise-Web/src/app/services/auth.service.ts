import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LogLevel, LoggerService } from './logger.service';
=======
import { Injectable } from '@angular/core';
import { LoggerService, LogLevel } from './logger.service';
import { BehaviorSubject } from 'rxjs';
import { timeout } from 'rxjs/operators';
>>>>>>> header_asynch_kge

@Injectable()
export class AuthService {

<<<<<<< HEAD
    constructor(private httpClient: HttpClient, private router: Router) { }
=======
    private tokenReceptionState = new BehaviorSubject(false);
    tokenReceptionObservable = this.tokenReceptionState.asObservable();

    constructor(private httpClient: HttpClient) { }
>>>>>>> header_asynch_kge

    signIn(formInputMail: String, formInputPswd: String) {

        let postParams = {
            mail: formInputMail,
            //pswd: sha512.sha512(this.userPswd),
            pswd: formInputPswd
        }
        LoggerService.log(postParams.mail + ":::" + postParams.pswd, LogLevel.DEBUG);

<<<<<<< HEAD
        let data = this.httpClient.post('http://localhost:8080/login', postParams);

        LoggerService.log(JSON.parse(JSON.stringify(data))["token"], LogLevel.DEBUG);

        return (data != null) ? JSON.parse(JSON.stringify(data))["token"] : null;
=======
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
>>>>>>> header_asynch_kge

    }

    signOut() {
        //TO-DO : redirect login page
        window.sessionStorage.clear();
    }

<<<<<<< HEAD
=======

>>>>>>> header_asynch_kge
}

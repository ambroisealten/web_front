import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LogLevel, LoggerService } from './logger.service';

@Injectable()
export class AuthService {

    constructor(private httpClient: HttpClient, private router: Router) { }

    signIn(formInputMail: String, formInputPswd: String) {

        let postParams = {
            mail: formInputMail,
            //pswd: sha512.sha512(this.userPswd),
            pswd: formInputPswd
        }
        LoggerService.log(postParams.mail + ":::" + postParams.pswd, LogLevel.DEBUG);

        let data = this.httpClient.post('http://localhost:8080/login', postParams);

        LoggerService.log(JSON.parse(JSON.stringify(data))["token"], LogLevel.DEBUG);

        return (data != null) ? JSON.parse(JSON.stringify(data))["token"] : null;

    }

    signOut() {
        //TO-DO : redirect login page
        window.sessionStorage.clear();
    }

}

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LogLevel, LoggerService } from './logger.service';

@Injectable()
export class AuthAsyncService {

    constructor(private httpClient: HttpClient, private router: Router) { }


    signIn(formInputMail: String, formInputPswd: String) {

        let postParams = {
            mail: formInputMail,
            //pswd: sha512.sha512(this.userPswd),
            pswd: formInputPswd
        }
        LoggerService.log(postParams.mail + ":::" + postParams.pswd, LogLevel.DEBUG);

        return this.httpClient.post('http://localhost:8080/login', postParams)
    }
}

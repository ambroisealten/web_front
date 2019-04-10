import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthAsyncService {

    constructor(private httpClient: HttpClient, private router: Router) { }


    signIn(formInputMail: String, formInputPswd: String) {

        let postParams = {
            mail: formInputMail,
            //pswd: sha512.sha512(this.userPswd),
            pswd: formInputPswd
        }
        console.log(postParams.mail + ":::" + postParams.pswd);

        return this.httpClient.post('http://localhost:8080/async', postParams)
    }
}
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    constructor(private httpClient: HttpClient, private router: Router) { }

    signIn(formInputMail: String, formInputPswd: String) {

        let postParams = {
            mail: formInputMail,
            //pswd: sha512.sha512(this.userPswd),
            pswd: formInputPswd
        }
        console.log(postParams.mail + ":::" + postParams.pswd);

        let data = this.httpClient.post('http://localhost:8080/login', postParams);

        return (data != null) ? JSON.parse(JSON.stringify(data))["token"] : null;

    }

    signOut() {
        //TO-DO : redirect login page
        window.sessionStorage.clear();
    }

    redirectToHomePage() {
        //TO-DO : Creer un service de redirection
        this.router.navigate(['content']);
    }
}
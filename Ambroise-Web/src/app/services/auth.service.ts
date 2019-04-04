import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    constructor(private httpClient: HttpClient, private router: Router) {

    }

    signIn(formMail: String, formPswd: String, callback) {
        // password hash with sha512 before POST request

        let postParams = {
            mail: formMail,
            //pswd: sha512.sha512(this.userPswd),
            pswd: formPswd
        }
        console.log(postParams.mail + ":::" + postParams.pswd);
        console.log(this.httpClient);

        //setTimeout(() => {
        this.httpClient.post('http://localhost:8080/login', postParams).subscribe(data => {

            console.log(data);
            window.sessionStorage.setItem("bearerToken", JSON.parse(JSON.stringify(data))["token"]);
            this.redirectToHomePage();

        }, error => {
            console.log('Raté');
            alert("Mauvais identifiant/Mdp");
        });
        // }, 1500);
        console.log('mail : ' + postParams.mail + 'pswd : ' + postParams.pswd);


    }

    signOut() {
        //TO-DO : redirect login page
        window.sessionStorage.clear();
    }

    redirectToHomePage() {
        this.router.navigate(['content']);
    }
}
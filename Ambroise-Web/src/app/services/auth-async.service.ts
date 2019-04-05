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
            /*.pipe(
                catchError(this.handleError('getToken', []))

            )*/;

    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
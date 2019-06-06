import { Injectable } from '@angular/core';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { ErrorService } from 'src/app/services/error.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, timeout } from 'rxjs/operators';
import * as sha512 from 'js-sha512';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AdminUserService {

    constructor(
        private httpClient: HttpClient,
        private httpHeaderService: HttpHeaderService,
        private errorService: ErrorService) { }

    getUsers(): Observable<{} | User[]> {
        let options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .get<User[]>(environment.serverAddress + '/admin/users', options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

    createUser(user: User) {
        let options = this.httpHeaderService.getHttpHeaders();
        user.pswd = sha512.sha512(user.pswd);
        return this.httpClient
            .post<User>(environment.serverAddress + '/admin/user', user, options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

    updateUser(user: User) {
        let options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .put<User>(environment.serverAddress + '/admin/user', user, options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

    deleteUser(mail: string) {
        let options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .delete<User>(environment.serverAddress + '/admin/user' + mail, options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }

    updatePassword(password: string, mail: string){
        let options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .put<User>(environment.serverAddress + '/admin/user', mail, options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
    }
}
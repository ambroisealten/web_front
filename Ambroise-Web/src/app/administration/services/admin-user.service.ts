import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as sha512 from 'js-sha512';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';

@Injectable()
export class AdminUserService {

    constructor(
        private httpClient: HttpClient,
        private httpHeaderService: HttpHeaderService,
        private errorService: ErrorService) { }

    getUsers(): Observable<{} | User[]> {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .get<User[]>(environment.serverAddress + '/admin/users', options)
            .pipe(retry(10), catchError(error => this.errorService.handleError(error)));
    }

    createUser(user: User) {
        const options = this.httpHeaderService.getHttpHeaders();
        user.pswd = sha512.sha512(user.pswd);
        return this.httpClient
            .post<User>(environment.serverAddress + '/admin/user', user, options)
            .pipe(retry(10), catchError(error => this.errorService.handleError(error)));
    }

    updateUser(user: User) {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .put<User>(environment.serverAddress + '/admin/user', user, options)
            .pipe(retry(10), catchError(error => this.errorService.handleError(error)));
    }

    deleteUser(mail: string) {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .delete<User>(environment.serverAddress + '/admin/deleteUser/' + mail, options)
            .pipe(retry(10), catchError(error => this.errorService.handleError(error)));
    }

    resetPassword(mail: string) {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .put<User>(environment.serverAddress + '/admin/user/resetPwd/' + mail, '', options)
            .pipe(retry(10), catchError(error => this.errorService.handleError(error)));
    }

    updatePassword(password: string, mail: string) {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .put<User>(environment.serverAddress + '/admin/user', mail, options)
            .pipe(retry(10), catchError(error => this.errorService.handleError(error)));
    }
}
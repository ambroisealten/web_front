import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { timeout } from 'rxjs/internal/operators/timeout';
import { catchError } from 'rxjs/operators';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { DocumentSet } from '../models/DocumentSet';

@Injectable()
export class AdminService {


    constructor(private httpClient: HttpClient) { }

    baseUrl = 'http://localhost:8080/';

    deleteFile(postParams, callback) {
        const token = window.sessionStorage.getItem('bearerToken');

        const headerParams = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token !== '' ? token : ''
        });

        const options = {
            headers: headerParams,
            params: postParams
        };
        this.httpClient.delete(this.baseUrl + 'file', options).subscribe(data => {
        });
    }

    updateFile(postParams, callback) {
        const token = window.sessionStorage.getItem('bearerToken');

        const headerParams = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token !== '' ? token : ''
        });

        const options = {
            headers: headerParams,
            params: postParams
        };
        this.httpClient.put(this.baseUrl + 'file', postParams, options).subscribe(data => {
        });
    }

    getFile(fileName: string): Observable<{} | File> {
        const token = window.sessionStorage.getItem('bearerToken');

        const headerParams = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token !== '' ? token : ''
        });

        const options = {
            params: { fileName, },
            headers: headerParams,
        };
        return this.httpClient
            .get<{} | File>(this.baseUrl + 'file', options)
            .pipe(timeout(5000), catchError(error => this.handleError(error)));
    }

    getFiles(): Observable<{} | File[]> {
        const token = window.sessionStorage.getItem('bearerToken');

        const headerParams = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token !== '' ? token : ''
        });

        const options = {
            headers: headerParams,
        };
        return this.httpClient
            .get<{} | File[]>(this.baseUrl + 'files', options)
            .pipe(timeout(5000), catchError(error => this.handleError(error)));
    }

    getSetFiles(set: string): Observable<{} | DocumentSet> {
        const token = window.sessionStorage.getItem('bearerToken');

        const headerParams = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token !== '' ? token : ''
        });

        const options = {
            params: { set, },
            headers: headerParams,
        };
        return this.httpClient
            .get<{} | File[]>(this.baseUrl + 'admin/documentset', options)
            .pipe(timeout(5000), catchError(error => this.handleError(error)));
    }

    getAllSet(): Observable<{} | DocumentSet[]> {
        const token = window.sessionStorage.getItem('bearerToken');

        const headerParams = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token !== '' ? token : ''
        });

        const options = {
            headers: headerParams,
        };
        return this.httpClient
            .get<{} | File[]>(this.baseUrl + 'admin/documentset/all', options)
            .pipe(timeout(5000), catchError(error => this.handleError(error)));
    }

    saveSet(postParams) {
        const token = window.sessionStorage.getItem('bearerToken');

        const headerParams = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token !== '' ? token : ''
        });

        const options = {
            headers: headerParams,
        };
        return this.httpClient.put(this.baseUrl + 'admin/documentset', postParams, options).subscribe();
    }

    makeRequest(url: string, method: string, postParams, callback) {
        const token = window.sessionStorage.getItem('bearerToken');

        const headerParams = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token !== '' ? token : ''
        });

        const options = {
            body: postParams,
            headers: headerParams,
        };

        switch (method) {
            case 'get':
                this.httpClient.get(this.baseUrl + url, options).subscribe(data => {
                    callback(JSON.stringify(data));
                });
                break;
            case 'post':
                this.httpClient.post(this.baseUrl + url, postParams, options).subscribe(data => {
                    callback(JSON.stringify(data));
                });
                break;
            case 'put':
                this.httpClient.put(this.baseUrl + url, postParams, options).subscribe(data => {
                    callback(JSON.stringify(data));
                });
                break;
            case 'delete':
                this.httpClient.delete(this.baseUrl + url, options).subscribe(data => {
                    callback(JSON.stringify(data));
                });
                break;
            default:
        }
    }

    handleError(error) {
        LoggerService.log(error, LogLevel.DEBUG);
        return undefined;
    }
}

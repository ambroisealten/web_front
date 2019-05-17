import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/internal/operators/timeout';
import { catchError } from 'rxjs/operators';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { DocumentSet } from '../models/DocumentSet';
import { File as Document } from '../models/File';


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
        return this.httpClient.delete(this.baseUrl + 'file', options);
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
        return this.httpClient.put(this.baseUrl + 'file', postParams, options);
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
        return this.httpClient.put(this.baseUrl + 'admin/documentset', postParams, options);
    }

    uploadFile(file: File, path: string): Observable<HttpEvent<string>> {
        const formdata: FormData = new FormData();
        const token = window.sessionStorage.getItem('bearerToken');

        formdata.append('file', file);
        formdata.append('path', path);

        const headerParams = new HttpHeaders({
            Authorization: token !== '' ? token : ''
        });

        const req = new HttpRequest('POST', this.baseUrl + 'file', formdata, {
            headers: headerParams,
            reportProgress: true,
            responseType: 'text'
        });

        return this.httpClient.request(req);
    }

    makeRequest(url: string, method: string, postParams) {
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
                return this.httpClient.get(this.baseUrl + url, options);
            case 'post':
                return this.httpClient.post(this.baseUrl + url, postParams, options);
            case 'put':
                return this.httpClient.put(this.baseUrl + url, postParams, options);
            case 'delete':
                return this.httpClient.delete(this.baseUrl + url, options);
            default:
        }
    }

    handleError(error) {
        LoggerService.log(error, LogLevel.DEBUG);
        return undefined;
    }
}

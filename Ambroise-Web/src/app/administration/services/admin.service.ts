import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/internal/operators/timeout';
import { catchError } from 'rxjs/operators';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { DocumentSet } from '../models/DocumentSet';
import { environment } from 'src/environments/environment';
import { File as Document } from '../models/File';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { ErrorService } from 'src/app/services/error.service';


@Injectable()
export class AdminService {

    constructor(
        private httpClient: HttpClient,
        private httpHeaderService: HttpHeaderService,
        private errorService: ErrorService) { }

    deleteFile(postParams) {
        const options = {
            headers: this.httpHeaderService.getHttpHeaders()['headers'],
            params: postParams
        };
        return this.httpClient.delete(environment.serverAddress + '/file', options)
            .pipe(catchError(err => this.errorService.handleError(err)));;
    }

    updateFile(postParams) {
        const options = {
            headers: this.httpHeaderService.getHttpHeaders()['headers'],
            params: postParams
        };
        return this.httpClient.put(environment.serverAddress + '/file', postParams, options)
            .pipe(catchError(err => this.errorService.handleError(err)));;
    }

    getFile(fileName: string): Observable<{} | File> {
        const options = {
            params: { fileName, },
            headers: this.httpHeaderService.getHttpHeaders()['headers'],
        };
        return this.httpClient
            .get<{} | File>(environment.serverAddress + '/file', options)
            .pipe(catchError(err => this.errorService.handleError(err)));;
    }

    getFiles(): Observable<{} | File[]> {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .get<{} | File[]>(environment.serverAddress + '/files', options)
            .pipe(catchError(err => this.errorService.handleError(err)));;
    }

    getSetFiles(set: string): Observable<{} | DocumentSet> {
        const options = {
            params: { set, },
            headers: this.httpHeaderService.getHttpHeaders()['headers'],
        };
        return this.httpClient
            .get<{} | File[]>(environment.serverAddress + '/admin/documentset', options)
            .pipe(catchError(err => this.errorService.handleError(err)));;
    }

    getAllSet(): Observable<{} | DocumentSet[]> {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .get<{} | File[]>(environment.serverAddress + '/admin/documentset/all', options)
            .pipe(catchError(err => this.errorService.handleError(err)));;
    }

    saveSet(postParams) {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient.put(environment.serverAddress + '/admin/documentset', postParams, options)
            .pipe(catchError(err => this.errorService.handleError(err)));
    }

    uploadFile(file: File, path: string): Observable<HttpEvent<string>> {
        const formdata: FormData = new FormData();

        formdata.append('file', file);
        formdata.append('path', path);

        const headerParams = this.httpHeaderService.getHttpHeadersWithouContentType()['headers'];

        const req = new HttpRequest('POST', environment.serverAddress + '/file', formdata, {
            headers: headerParams,
            reportProgress: true,
            responseType: 'text'
        });

        return this.httpClient.request(req);
    }
}

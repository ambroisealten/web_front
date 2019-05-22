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


@Injectable()
export class AdminService {

    constructor(private httpClient: HttpClient,private httpHeaderService: HttpHeaderService) { }

    deleteFile(postParams) {
        const options = {
            headers: this.httpHeaderService.getHttpHeaders()['headers'],
            params: postParams
        };
        return this.httpClient.delete(environment.serverAddress + '/file', options);
    }

    updateFile(postParams) {
        const options = {
            headers: this.httpHeaderService.getHttpHeaders()['headers'],
            params: postParams
        };
        return this.httpClient.put(environment.serverAddress + '/file', postParams, options);
    }

    getFile(fileName: string): Observable<{} | File> {
        const options = {
            params: { fileName, },
            headers: this.httpHeaderService.getHttpHeaders()['headers'],
        };
        return this.httpClient
            .get<{} | File>(environment.serverAddress + '/file', options)
            .pipe(timeout(5000), catchError(error => this.handleError(error)));
    }

    getFiles(): Observable<{} | File[]> {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .get<{} | File[]>(environment.serverAddress + '/files', options)
            .pipe(timeout(5000), catchError(error => this.handleError(error)));
    }

    getSetFiles(set: string): Observable<{} | DocumentSet> {
        const options = {
            params: { set, },
            headers: this.httpHeaderService.getHttpHeaders()['headers'],
        };
        return this.httpClient
            .get<{} | File[]>(environment.serverAddress + '/admin/documentset', options)
            .pipe(timeout(5000), catchError(error => this.handleError(error)));
    }

    getAllSet(): Observable<{} | DocumentSet[]> {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient
            .get<{} | File[]>(environment.serverAddress + '/admin/documentset/all', options)
            .pipe(timeout(5000), catchError(error => this.handleError(error)));
    }

    saveSet(postParams) {
        const options = this.httpHeaderService.getHttpHeaders();
        return this.httpClient.put(environment.serverAddress + '/admin/documentset', postParams, options);
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

    makeRequest(url: string, method: string, postParams) {
        const options = {
            body: postParams,
            headers: this.httpHeaderService.getHttpHeaders()['headers'],
        };

        switch (method) {
            case 'get':
                return this.httpClient.get(environment.serverAddress + url, options);
            case 'post':
                return this.httpClient.post(environment.serverAddress + url, postParams, options);
            case 'put':
                return this.httpClient.put(environment.serverAddress + url, postParams, options);
            case 'delete':
                return this.httpClient.delete(environment.serverAddress + url, options);
            default:
        }
    }

    handleError(error) {
        LoggerService.log(error, LogLevel.DEBUG);
        return undefined;
    }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
            body: postParams
        };
        this.httpClient.delete(this.baseUrl + 'file', options);
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
}
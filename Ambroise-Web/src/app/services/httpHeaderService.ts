import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpHeaderService {

    getHttpHeaders(): {} {
        let token = window.sessionStorage.getItem("bearerToken");
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
        });
        return { headers: headers };
    }
}
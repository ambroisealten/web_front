import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpHeaderService {
    static getHttpHeaders(): {} {
        const token = window.sessionStorage.getItem('bearerToken');
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token !== '' ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
        });
        return { headers: headers };
    }

  getHttpHeaders(): {} {
    const token = window.sessionStorage.getItem('bearerToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token !== '' ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    return { headers: headers };
  }

  getHttpHeadersWithouContentType(): {} {
    const token = window.sessionStorage.getItem('bearerToken');
    const headers = new HttpHeaders({
      'Authorization': token !== '' ? token : ''
    });
    return { headers: headers };
  }
}
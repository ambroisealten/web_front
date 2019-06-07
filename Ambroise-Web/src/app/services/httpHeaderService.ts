import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpHeaderService {

  getHttpHeaders(): {} {
    const token = window.sessionStorage.getItem('bearerToken');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token !== '' ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    return { headers: headers };
  }

  getHttpHeadersWithouContentType(): {} {
    const token = window.sessionStorage.getItem('bearerToken');
    let headers = new HttpHeaders({
      'Authorization': token !== '' ? token : ''
    });
    return { headers: headers };
  }

  getHttpHeadersForRefreshToken(): {} {
    const token = window.sessionStorage.getItem('refreshToken');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token !== '' ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    return { headers: headers };
  }
}
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpHeaderService {

  getHttpHeaders(): {} {
    const token = window.sessionStorage.getItem('bearerToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token !== '' ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    return { headers };
  }

  getHttpHeadersWithouContentType(): {} {
    const token = window.sessionStorage.getItem('bearerToken');
    const headers = new HttpHeaders({
      Authorization: token !== '' ? token : ''
    });
    return { headers };
  }

  getHttpHeadersForRefreshToken(): {} {
    const token = window.sessionStorage.getItem('refreshToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token !== '' ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
    });
    return { headers };
  }
}

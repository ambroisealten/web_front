import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class HttpHeaderService {

  constructor(
    private cookieService: CookieService) { }


  getHttpHeaders(): {} {
    const token = window.sessionStorage.getItem('bearerToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token !== '' ? token : ''
    });
    return { headers };
  }

  getHttpHeadersWithoutContentType(): {} {
    const token = window.sessionStorage.getItem('bearerToken');
    const headers = new HttpHeaders({
      Authorization: token !== '' ? token : ''
    });
    return { headers };
  }

  getHttpHeadersForRefreshToken(): {} {
    const token = this.cookieService.get('refreshToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token !== '' ? token : ''
    });
    return { headers };
  }
}

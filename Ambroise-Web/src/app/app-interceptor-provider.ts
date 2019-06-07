import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorInterceptor } from './services/errorInterceptor.interceptor';

export const HttpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
];

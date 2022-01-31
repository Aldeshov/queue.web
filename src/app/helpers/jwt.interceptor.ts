import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // adding authorization header with jwt token 
        let jwt_token = this.authenticationService.currentJWTToken;
        if (jwt_token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `JWT ${jwt_token}`
                }
            });
        }

        return next.handle(request);
    }
}
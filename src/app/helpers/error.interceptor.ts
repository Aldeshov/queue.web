import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.authenticationService.logout();
                return throwError("Unauthorized");
            }

            if (err.status === 400) {
                if (err.error.username) {
                    return throwError("Username already exists");
                }
                return throwError("Username or Password Incorrect");
            }
            
            if (err.status >= 500) {
                alert("Server error occured!")
                const error = err.error || err.statusText;
                return throwError(error);
            }

            const error = err.error || err.statusText;
            return throwError(error);
        }))
    }
}
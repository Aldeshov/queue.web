import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BASE_URL } from './config'

import { jwt, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private tokenSubject: BehaviorSubject<jwt>;
    public jwt_token: Observable<jwt>;
    private userUrl = 'api/user';

    constructor(private http: HttpClient) {
        this.tokenSubject = new BehaviorSubject<jwt>(JSON.parse(localStorage.getItem('jwt_token')));
        this.jwt_token = this.tokenSubject.asObservable();
    }

    public get currentJWTToken(): jwt {
        return this.tokenSubject.value;
    }

    registrate(username: string, password: string, first_name: string, last_name: string){
        return this.http.post<any>(`${BASE_URL}/${this.userUrl}`, {username, password, first_name, last_name})
            .pipe(map(response => {
                return this.login(username, password)
            }));
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${BASE_URL}/api/login/`, { username, password })
            .pipe(map(response => {
                localStorage.setItem('jwt_token', JSON.stringify(response.token));
                this.tokenSubject.next(response.token);
                return true;
            }));
    }

    logout() {
        if(this.currentJWTToken) {
            localStorage.removeItem('jwt_token');
            this.tokenSubject.next(null);
            location.reload();
        }
    }

    user() {
        return this.http.get<User>(`${BASE_URL}/${this.userUrl}`)
        .pipe(map(response => {
            return response;
        }), catchError(this.handleError<any>('User')));
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(operation + " : " + error); // log to console instead
        
            // Let the app keep running by returning an empty result.
            return of(null);
        };
    }
}
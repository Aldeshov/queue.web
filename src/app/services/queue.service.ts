import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { Queue } from '../models';
import { Observable, of } from 'rxjs';

import { BASE_URL } from './config'

@Injectable({ providedIn: 'root' })

export class QueueService {
    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    private queueUrl = 'api/queue';

    getQueueMembers(code: number): Observable<any> {
        return this.http.get<any>(`${BASE_URL}/${this.queueUrl}/${code}/members`).pipe(catchError(this.handleError<any>('Get Queue members')));
    }

    getQueueInfo(code: number): Observable<Queue> {
        return this.http.get<Queue>(`${BASE_URL}/${this.queueUrl}/${code}/info`).pipe(catchError(this.handleError<Queue>('Get Queue info')));
    }

    getQueues(): Observable<any> {
        return this.http.get<any>(`${BASE_URL}/${this.queueUrl}`).pipe(catchError(this.handleError<any>('Get Queues', [])));
    }

    insertQueue(code: number, comment: string): Observable<any> {
        let body = {
            comment: comment
        }
        return this.http.put<any>(`${BASE_URL}/${this.queueUrl}/${code}/members`, body, this.httpOptions).pipe(catchError(this.handleError<any>('Insert Queue')));
    }

    removefromQueue(code: number, by_id = false, id = 0): Observable<any> {
        let body = {
            by_id: by_id,
            id: id
        }
        return this.http.put<any>(`${BASE_URL}/${this.queueUrl}/${code}/removeme`, body, this.httpOptions).pipe(catchError(this.handleError<any>('Remove from Queue')));
    }

    deleteQueue(code: number): Observable<any> {
        return this.http.delete<any>(`${BASE_URL}/${this.queueUrl}/${code}/members`).pipe(catchError(this.handleError<any>('Delete Queue')));
    }

    addQueue(title: string): Observable<any> {
        let body = {
            title: title
        }
        return this.http.post<any>(`${BASE_URL}/${this.queueUrl}`,body, this.httpOptions).pipe(catchError(this.handleError<any>('Add Queue')));
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(operation+ " : " + error); // log to console instead
        
            // Let the app keep running by returning an empty result.
            return of(null);
        };
    }
}
import {Injectable} from '@angular/core';
import { Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from "rxjs/operators";
 
@Injectable({
    providedIn: 'root'
})
export class RecaptchaService {

    constructor(private http: HttpClient) {}

    // getTokenClientModule(token: string): Observable<any> {
    //     return this.http.post<any>('http://localhost:48972/api/v1/Users/ValidarRecaptcha',
    //     {
    //         Token: token
    //     })
    //     .pipe(
    //         map((response) => response),
    //         catchError(this.handlerError)
    //     );
    // }

    // private handlerError(error: HttpErrorResponse) {
    //     let msn = '';
    //     if(error.status == 0){
    //         msn = 'Algo falló. Por favor intente nuevamente.';
    //         console.error(msn);
    //     }
    //     else{
    //         console.error('Backend retornó el código de estado ', error.status, error.error);
    //         msn = error.error.message;
    //     }

    //     return throwError(() => new Error(msn));
    // }
}
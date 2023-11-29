import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { LoginRequest } from './models/loginRequest';
import { LoginResponse } from './models/loginResponse';

import { environment } from 'src/environments/environment';

@Injectable()

export class PublicService{

    currentComponentLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient){}

    // login(credencials: LoginRequest):Observable<LoginResponse>{
    //     return this.http.post<LoginResponse>(environment.urlWebApiTest + 'Users/Authenticate',
    //     {   userName: credencials.usuario, 
    //         password: credencials.password
    //     }).pipe(
    //         catchError(this.handlerError)
    //     );
    // }

    login(credencials: LoginRequest):Observable<any>{
        return this.http.post<any>(environment.urlWebApiShowSecurity + 'Authenticate',
        {   userName: credencials.usuario, 
            password: credencials.password
        }).pipe(
            // tap((response:any) => {
            //     console.log(response);
            // }),
            catchError(this.handlerError)
        );
    }

    validarRecaptchaV3(token: string): Observable<any> {
        return this.http.post<any>(environment.urlWebApiTest + 'Users/ValidarRecaptcha',
        {
            Token: token
        })
        .pipe(
            map((response) => response),
            catchError(this.handlerError)
        );
    }   

    get getCurrentComponentLogin():Observable<boolean>{
        return this.currentComponentLogin.asObservable();
    }

    private handlerError(error: HttpErrorResponse) {
        let msn = '';
        if(error.status == 0){
            msn = 'Algo falló. Por favor intente nuevamente.';
            console.error(msn);
        }
        else{
            console.error('Backend retornó el código de estado ', error.status, error.error);
            msn = error.error.message;
        }

        return throwError(() => new Error(msn));
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { LoginRequest } from './models/loginRequest';

import { environment } from 'src/environments/environment';
import { StatusResponse } from '../core/models/statusResponse.model';
import { UsuarioSession } from './models/usuarioSession';

@Injectable()

export class PublicService{

    currentComponentLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient){}

    login(credencials: LoginRequest):Observable<StatusResponse<UsuarioSession>>{
        return this.http.post<StatusResponse<UsuarioSession>>(environment.urlWebApiEyL + 'Users/Authenticate',
        {   UserName: credencials.usuario, 
            Password: credencials.password
        }).pipe(
            catchError(this.handlerError)
        );
    }

    validarRecaptchaV3(token: string): Observable<any> {
        return this.http.post<any>(environment.urlWebApiEyL + 'Users/ValidarRecaptcha',
        {
            Token: token
        })
        .pipe(
            map((response) => response),
            catchError(this.handlerError)
        );
    }

    //Para que pueden subscribe
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
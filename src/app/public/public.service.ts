import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { LoginRequest } from './models/loginRequest';
import { LoginResponse } from './models/loginResponse';

import { environment } from 'src/environments/environment';

@Injectable()

export class PublicService{

    //inComponentLogin: EventEmitter<boolean> = new EventEmitter();

    currentComponentLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient){}

    login(credencials: LoginRequest):Observable<LoginResponse>{
        return this.http.post<LoginResponse>(environment.urlWebApiSecurity + 'Users/Authenticate',
        {   userName: credencials.usuario, 
            password: credencials.password
        }).pipe(
            catchError(this.handlerError)
        );
    }

    validarRecaptchaV3(token: string): Observable<any> {
        return this.http.post<any>(environment.urlWebApiSecurity + 'Users/ValidarRecaptcha',
        {
            Token: token
        })
        .pipe(
            map((response) => response),
            catchError(this.handlerError)
        );
    }   

    // isComponentLogin(status: boolean) {
    //     console.log('ok');
    //     console.log(status);
    //     this.inComponentLogin.emit(status);
    // }

    // getComponentLogin(){
    //     return this.inComponentLogin;
    // }

    //Para que pueden subscribe
    get getCurrentComponentLogin():Observable<boolean>{
        return this.currentComponentLogin.asObservable();
    }

    // getCharacters(): Observable<any> {
    //     return this.http.get('https://thronesapi.com/api/v2/Characters').pipe(
    //         tap(console.log),
    //         map(response => response.filter((character:any) => character.lastName == 'Stark')),
    //         catchError(this.handlerError)
    //     )
    // }

    // getContinents(): Observable<any> {
    //     return this.http.get('https://thronesapi.com/api/v2/Continents').pipe(
    //         tap(console.log),
    //         catchError(this.handlerError)
    //     )        
    // }

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
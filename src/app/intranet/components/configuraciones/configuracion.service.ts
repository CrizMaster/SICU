import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { PersonaFilter, PersonaRequest, PersonaResponse, UsuarioRequest } from '../../models/personaResponse';
import { environment } from 'src/environments/environment';
import { TipoCambioFilter, TipoCambioRequest, TipoCambioResponse } from '../../models/tipoCambioResponse';

@Injectable( {  providedIn: 'root' })

export class ConfiguracionService implements OnInit {


    constructor(private http: HttpClient){}

    ngOnInit(): void {
        //this.setCatalogoMaster();
    }

    ListarPersonal(filter: PersonaFilter): Observable<StatusResponse<PersonaResponse[]>>{
        return this.http.post<StatusResponse<PersonaResponse[]>>(environment.urlWebApiEyL + 'Users/ListarPersonal', 
        filter)
        .pipe(
            catchError(this.handlerError)            
        );       
    }   

    GestionarPersona(filter: PersonaRequest): Observable<StatusResponse<number>>{
        return this.http.post<StatusResponse<number>>(environment.urlWebApiEyL + 'Users/GestionarPersona', 
        filter)
        .pipe(
            catchError(this.handlerError)            
        );       
    }
    
    GestionarUsuario(filter: UsuarioRequest): Observable<StatusResponse<number>>{
        return this.http.post<StatusResponse<number>>(environment.urlWebApiEyL + 'Users/GestionarUsuario', 
        filter)
        .pipe(
            catchError(this.handlerError)            
        );       
    }    

    ListarTipoCambio(filter: TipoCambioFilter): Observable<StatusResponse<TipoCambioResponse[]>>{
        return this.http.post<StatusResponse<TipoCambioResponse[]>>(environment.urlWebApiEyL + 'Mantenimiento/ListarTipoCambio', 
        filter)
        .pipe(
            catchError(this.handlerError)            
        );       
    }

    GestionarTipoCambio(filter: TipoCambioRequest): Observable<StatusResponse<number>>{
        return this.http.post<StatusResponse<number>>(environment.urlWebApiEyL + 'Mantenimiento/GestionarTipoCambio', 
        filter)
        .pipe(
            catchError(this.handlerError)            
        );       
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
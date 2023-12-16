import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { PersonaFilter, PersonaResponse } from '../../models/personaResponse';
import { environment } from 'src/environments/environment';

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
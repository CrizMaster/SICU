import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { LocalService } from 'src/app/core/shared/services/local.service';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { environment } from 'src/environments/environment';
import { UnidadAdministrativaRequest } from 'src/app/intranet/components/formularios/models/unidadAdministrativaRequest';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';

@Injectable()

export class UnidadAdministrativaService{


    UnidadAdministrativa: BehaviorSubject<StatusResponse<UnidadAdministrativaResponse>> = new BehaviorSubject<StatusResponse<UnidadAdministrativaResponse>>({});

    constructor(private http: HttpClient,
        private _localService: LocalService){
    }
    
    get getUnidadAdministrativa():Observable<StatusResponse<UnidadAdministrativaResponse>>{
        return this.UnidadAdministrativa.asObservable();
    }

    ConsultaDatosUnidadAdministrativa(codigoEdificacion: number):Observable<any>{

        return this.http.post<any>(environment.urlWebApiSICU + 'ConsultaDatosUnidadAdministrativa',
        {
            "codigoEdificacion": codigoEdificacion,
            "codigoUnidadAdministrativa": 0
        })
        .pipe(
            // tap((response: any) => {
            //     if(response.success){
            //         console.log(response);                 
            //     }
            // }),
            catchError(this.handlerError)            
        );
    }

    EliminarUnidadAdministrativa(id: number):Observable<StatusResponse<number>>{
        console.log(id)
        return this.http.post<StatusResponse<number>>(environment.urlWebApiSICU + 'EliminaUnidadAdministrativa',
        {
            codigoUnidadAdministrativa: id
        })
        .pipe(
            catchError(this.handlerError)
        );         
    }

    GuardaDatosUnidadAdministrativa(data: UnidadAdministrativaRequest):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'GuardaDatosUnidadAdministrativa',
        data)
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
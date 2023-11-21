import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { LocalService } from 'src/app/core/shared/services/local.service';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { environment } from 'src/environments/environment';
import { UnidadAdministrativaRequest } from 'src/app/intranet/components/formularios/models/unidadAdministrativaRequest';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';
import { ArmonizacionRequest, ArmonizacionResponse, DireccionResponse } from 'src/app/intranet/components/formularios/models/armonizacionModel';
import { UnidadPredioRequest } from 'src/app/intranet/components/formularios/models/unidadPredioRequest';
import { ConstruccionResponse, ConstruccionesRequest } from 'src/app/intranet/components/formularios/models/construccionesRequest';
import { ObraModel } from 'src/app/intranet/components/formularios/models/obraModel';
import { ObrasComplementariasRequest, ObrasComplementariasResponse } from 'src/app/intranet/components/formularios/models/obrasComplementariasRequest';
import { InteresadoRequest, InteresadoResponse } from 'src/app/intranet/components/formularios/models/interesadoRequest';

@Injectable()

export class UnidadAdministrativaService{


    UnidadAdministrativa: BehaviorSubject<StatusResponse<UnidadAdministrativaResponse>> = new BehaviorSubject<StatusResponse<UnidadAdministrativaResponse>>({});
    InfoArmonizacion: BehaviorSubject<DireccionResponse> = new BehaviorSubject<DireccionResponse>({ index: 0 });

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
            //     console.log(response);
            // }),
            catchError(this.handlerError)            
        );
    }

    EliminarUnidadAdministrativa(id: number):Observable<StatusResponse<number>>{

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

    ConsultaArmonizacion(data: ArmonizacionRequest):Observable<StatusResponse<ArmonizacionResponse>>{
        return this.http.post<any>(environment.urlWebApiArmonization + 'obtenerPersona',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }    

    ConsultaCategoriaConstrucciones():Observable<any>{

        return this.http.post<any>(environment.urlWebApiSICU + 'CategoriaConstruccionesModel',null)
        .pipe(
            catchError(this.handlerError)            
        );
    }

    GuardarUnidadPredio(data: FormData):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'ActualizaUnidadAdministrativa',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    ConsultaUnidadPredio(cua: number):Observable<StatusResponse<UnidadPredioRequest>>{

        return this.http.post<StatusResponse<UnidadPredioRequest>>(environment.urlWebApiSICU + 'ConsultaDatosUnidadAdministrativa01',{
            codigoUnidadAdministrativa: cua
        })
        .pipe(
            catchError(this.handlerError)            
        );
    }

    ConsultaImagenesUnidadPredio(codigoArchivo: number):Observable<StatusResponse<string>>{

        return this.http.post<StatusResponse<string>>(environment.urlWebApiSICU + 'ConsultaFotoUnidadAdmin',{
            codigoArchivo: codigoArchivo
        })
        .pipe(
            // map((response: any) => {
            //     console.log(response);
            //     //this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpeg;base64,${rpt.DataCaptcha}`);
            // }),
            catchError(this.handlerError)            
        );
    }

    GuardarConstrucciones(data: ConstruccionesRequest):Observable<StatusResponse<number>>{
        return this.http.post<StatusResponse<number>>(environment.urlWebApiSICU + 'GuardarConstruccionesUnidadAdmin',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    ConsultaConstrucciones(codigoUnidadAdministrativa: number):Observable<StatusResponse<ConstruccionResponse[]>>{

        return this.http.post<StatusResponse<ConstruccionResponse[]>>(environment.urlWebApiSICU + 'ConsultaConstruccionesUnidadAdmin',{
            codigoUnidadAdministrativa: codigoUnidadAdministrativa
        })
        .pipe(
            catchError(this.handlerError)            
        );
    }

    ListarObrasComplementarias():Observable<StatusResponse<ObraModel[]>>{

        return this.http.post<StatusResponse<ObraModel[]>>(environment.urlWebApiSICU + 'ListarObrasComplementarias',null)
        .pipe(
            catchError(this.handlerError)            
        );
    }

    GuardarObrasInstalaciones(data: ObrasComplementariasRequest):Observable<StatusResponse<number>>{
        return this.http.post<StatusResponse<number>>(environment.urlWebApiSICU + 'GuardarObrasCompUnidadAdmin',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    ConsultaObrasInstalaciones(codigoUnidadAdministrativa: number):Observable<StatusResponse<ObrasComplementariasResponse[]>>{

        return this.http.post<StatusResponse<ObrasComplementariasResponse[]>>(environment.urlWebApiSICU + 'ConsultaObrasCompUnidadAdmin',{
            codigoUnidadAdministrativa: codigoUnidadAdministrativa
        })
        .pipe(
            catchError(this.handlerError)            
        );
    }

    getConsultaReniec(dni: string): Observable<StatusResponse<string>> {
        return this.http.post(environment.urlWebApiPide + 'ConstaReniecDni?nuDniConsulta=' + dni, null)
        .pipe(
            // tap((response: any) => {
            //     console.log(response);
            // }),            
            catchError(this.handlerError)
        )        
    }

    GuardarTitulares(data: InteresadoRequest):Observable<StatusResponse<number>>{
        return this.http.post<StatusResponse<number>>(environment.urlWebApiSICU + 'RegistraInteresadosDrr',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    ConsultarInteresados(codigoUnidadAdministrativa: number):Observable<StatusResponse<InteresadoResponse[]>>{

        return this.http.post<StatusResponse<InteresadoResponse[]>>(environment.urlWebApiSICU + 'ConsultaInteresadosDrrUnidadAdmin',{
            codigoUnidadAdministrativa: codigoUnidadAdministrativa
        })
        .pipe(
            tap((response: any) => {
                console.log('Titulares');
                console.log(response);
            }), 
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
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
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
import { BienesComunesResponse } from 'src/app/intranet/components/formularios/models/bienesComunesResponse';
import { RecapitulacionEdificaResponse } from 'src/app/intranet/components/formularios/models/recapitulacionEdificaResponse';
import { RecapitulacionBCResponse } from 'src/app/intranet/components/formularios/models/recapitulacionBCResponse';

@Injectable()

export class BienesComunesService{


    BienesComunes: BehaviorSubject<StatusResponse<BienesComunesResponse>> = new BehaviorSubject<StatusResponse<BienesComunesResponse>>({});
    InfoArmonizacion: BehaviorSubject<DireccionResponse> = new BehaviorSubject<DireccionResponse>({ index: 0 });

    constructor(private http: HttpClient,
        private _localService: LocalService){
    }
    
    get getBienesComunes():Observable<StatusResponse<BienesComunesResponse>>{
        return this.BienesComunes.asObservable();
    }

    /*
export interface BienesComunesResponse {
    codigoDepartamento?: string,
    codigoDistrito?: string,
    codigoEdificacion?: number,
    codigoEstado?: string,
    nombreEstado?: string,
    codigoProvincia?: string,
    codigoSector?: string,
    codigoManzana?: string,
    codigoLote?: string,
    codigoBienComun: number,
    entrada?: string,
    numeroPiso?: string,
    numeroUnidadAdministrativa?: string,
    terminalCreacion?: string,
    terminalModificacion?: string,    
    usuarioCreacion?: string,    
    usuarioModificacion?: string
}    
    */
    ConsultaDatosBienesComunes(codigoEdificacion: number):Observable<StatusResponse<BienesComunesResponse[]>>{

        let lista: BienesComunesResponse[] = [];
        lista.push({ codigoDepartamento: '15', codigoProvincia: '01', codigoDistrito: '09', codigoSector: '01', codigoManzana: '001', codigoLote: '001', 
        numeroEdificacion: '99', entrada: '99', numeroPiso: '99', numeroUnidadAdministrativa: '999'})

        lista.push({ codigoDepartamento: '15', codigoProvincia: '01', codigoDistrito: '09', codigoSector: '01', codigoManzana: '001', codigoLote: '001', 
        numeroEdificacion: '02', entrada: '99', numeroPiso: '99', numeroUnidadAdministrativa: '999'})

        lista.push({ codigoDepartamento: '15', codigoProvincia: '01', codigoDistrito: '09', codigoSector: '01', codigoManzana: '001', codigoLote: '001', 
        numeroEdificacion: '03', entrada: '99', numeroPiso: '99', numeroUnidadAdministrativa: '999'})

        lista.push({ codigoDepartamento: '15', codigoProvincia: '01', codigoDistrito: '09', codigoSector: '01', codigoManzana: '001', codigoLote: '001', 
        numeroEdificacion: '04', entrada: '99', numeroPiso: '99', numeroUnidadAdministrativa: '999'})

        lista.push({ codigoDepartamento: '15', codigoProvincia: '01', codigoDistrito: '09', codigoSector: '01', codigoManzana: '001', codigoLote: '001', 
        numeroEdificacion: '05', entrada: '99', numeroPiso: '99', numeroUnidadAdministrativa: '999'})

        let status: StatusResponse<BienesComunesResponse[]> = {
            success: true,
            data: lista
        }

        return of(status);
    }

    ConsultaDatosRecapitulacionEdifica(codigoEdificacion: number):Observable<StatusResponse<RecapitulacionEdificaResponse[]>>{

        let lista: RecapitulacionEdificaResponse[] = [];
        lista.push({ codigoDepartamento: '15', codigoProvincia: '01', codigoDistrito: '09', codigoSector: '01', 
        codigoManzana: '001', codigoLote: '001', numeroEdificacion: '01'})

        lista.push({ codigoDepartamento: '15', codigoProvincia: '01', codigoDistrito: '09', codigoSector: '01', 
        codigoManzana: '001', codigoLote: '001', numeroEdificacion: '02'})

        lista.push({ codigoDepartamento: '15', codigoProvincia: '01', codigoDistrito: '09', codigoSector: '01', 
        codigoManzana: '001', codigoLote: '001', numeroEdificacion: '03'})

        lista.push({ codigoDepartamento: '15', codigoProvincia: '01', codigoDistrito: '09', codigoSector: '01', 
        codigoManzana: '001', codigoLote: '001', numeroEdificacion: '04'})

        lista.push({ codigoDepartamento: '15', codigoProvincia: '01', codigoDistrito: '09', codigoSector: '01', 
        codigoManzana: '001', codigoLote: '001', numeroEdificacion: '05'})

        let status: StatusResponse<RecapitulacionEdificaResponse[]> = {
            success: true,
            data: lista
        }

        return of(status);
    }    

    ConsultaDatosRecapitulacionBC(codigoEdificacion: number):Observable<StatusResponse<RecapitulacionBCResponse[]>>{

        let lista: RecapitulacionBCResponse[] = [];
        lista.push({ nro:'01', codigoEdifica: '02', entrada: '01', piso: '02', unidad: '001', areaTerrenoVerificada: 0 })

        lista.push({ nro:'02', codigoEdifica: '02', entrada: '02', piso: '01', unidad: '001', areaTerrenoVerificada: 0 })

        let status: StatusResponse<RecapitulacionEdificaResponse[]> = {
            success: true,
            data: lista
        }

        return of(status);
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
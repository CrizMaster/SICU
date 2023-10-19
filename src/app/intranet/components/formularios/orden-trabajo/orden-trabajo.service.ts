import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { LocalService } from 'src/app/core/shared/services/local.service';
import { environment } from 'src/environments/environment';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { OrdenTrabajo } from '../../asignacion-carga/models/ordenTrabajo.model';
import { OrdenTrabajoFilter } from '../../asignacion-carga/models/ordenTrabajoFilter.model';
import { OrdenTrabajoView } from '../../asignacion-carga/models/ordenTrabajoResponse';
import { LoteFilter, LoteResponse } from '../../asignacion-carga/models/loteResponse';
import { CaracterizacionResponse, FilterCaracterizacion } from '../models/caracterizacionResponse';
import { EdificacionFilter, EdificacionLoteRequest, EdificacionRequest } from '../models/edificacionRequest';
import { EdificacionResponse } from '../models/edificacionResponse';

@Injectable()

export class OrdenTrabajoService{

    listaEstadosOrden: ItemSelect<number>[] = [];
    
    DataTableOT: BehaviorSubject<StatusResponse<OrdenTrabajo[]>> = new BehaviorSubject<StatusResponse<OrdenTrabajo[]>>({
        success: false,
        message: '',
        total: 0,
        data: []
    });

    viewOrdenTrabajo: BehaviorSubject<OrdenTrabajoView> = new BehaviorSubject<OrdenTrabajoView>({});

    filterCaracterizacion: BehaviorSubject<FilterCaracterizacion> = 
        new BehaviorSubject<FilterCaracterizacion>({ codigoCaracterizacion: 0, codigoLoteCaracterizacion: '000', codigoLote: 0, codigoDetalle: 0 });
    
    constructor(private http: HttpClient,
        private _localService: LocalService){
    
        //this.listaTipopuerta = this.getList<number>(CatalogoMasterEnum.EstadoOrden);
    }    

    get getDataTableOT():Observable<StatusResponse<OrdenTrabajo[]>>{
        return this.DataTableOT.asObservable();
    }

    get getViewOrdenTrabajo():Observable<OrdenTrabajoView>{
        return this.viewOrdenTrabajo.asObservable();
    }

    get getFilterCaracterizacion():Observable<FilterCaracterizacion>{
        return this.filterCaracterizacion.asObservable();
    }

    listarOrdenesTrabajoxDistrito(filter: OrdenTrabajoFilter):Observable<StatusResponse<OrdenTrabajo[]>>{

        let cm = this._localService.getData("sicuorg");
        let data = JSON.parse(cm);

        return this.http.post<StatusResponse<OrdenTrabajo[]>>(environment.urlWebApiSICU + 'listarInformacionSectorEnProceso',
        {
            "page": filter.Page,
            "itemsByPage": filter.ItemsByPage,
            "idUbigeo": parseInt(data.idUbigeo),
            "codigoSector": filter.Sector,
            "codigoManzana": filter.Manzana,
            "codigoEstadoOrden": filter.Estado
        })
        .pipe(
            tap((response: StatusResponse<OrdenTrabajo[]>) => {
                if(response.success){
                    let con = 0;
                    response.data.forEach(elem => {
                        con++;
                        elem.id = con + ((filter.Page - 1) * filter.ItemsByPage);
                        elem.personasAsignadas = elem.usuarios.length;
                    });
                }
            }),
            catchError(this.handlerError)            
        );
    }

    listarLotesxOrdenTrabajo(filter: LoteFilter):Observable<StatusResponse<LoteResponse[]>>{

        return this.http.post<StatusResponse<LoteResponse[]>>(environment.urlWebApiSICU + 'listarLotesOrdenTrabajo',
        {
            "page": filter.Page,
            "itemsByPage": filter.ItemsByPage,
            "codigoOrden": filter.codigoOrden
        })
        .pipe(
            tap((response: StatusResponse<LoteResponse[]>) => {
                if(response.success){
                    //console.log(response);
                    let con = 0;
                    response.data.forEach(elem => {
                        con++;
                        elem.id = con + ((filter.Page - 1) * filter.ItemsByPage);
                    });
                }
            }),
            catchError(this.handlerError)            
        );
    }

    obtieneInformacionCaracterizacionLote():Observable<StatusResponse<CaracterizacionResponse>>{

        let filter: FilterCaracterizacion;
        this.getFilterCaracterizacion.subscribe({
            next:(Data) => {
                  filter = Data;
              }
        });

        return this.http.post<StatusResponse<CaracterizacionResponse>>(environment.urlWebApiSICU + 'obtieneInformacionCaracterizacionLote',
        {
            "codigoLoteCaracterizacion": filter.codigoLoteCaracterizacion,
            "codigoCaracterizacion": filter.codigoCaracterizacion,
            "codigoLote": filter.codigoLote
        })
        .pipe(
            // tap((response: StatusResponse<CaracterizacionResponse>) => {
            //     if(response.success){
            //         console.log('response');
            //         console.log(response);
            //     }
            // }),
            catchError(this.handlerError)            
        );
    }    

    GuardaFormularioLote(data: FormData):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'GuardaFormularioLote',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    GenerarLoteEdificaciones(data: EdificacionLoteRequest):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'GenerarLoteEdificaciones',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    ConsultaEdicacionesLote(filter:EdificacionFilter):Observable<StatusResponse<EdificacionResponse[]>>{
    
        return this.http.post<StatusResponse<EdificacionResponse[]>>(environment.urlWebApiSICU + 'ConsultaEdicacionesLote',
        {
            "codigoLote": filter.codigoLote
        })
        .pipe(
            // tap((response: StatusResponse<EdificacionResponse[]>) => {
            //     if(response.success){
            //         console.log('response');
            //         console.log(response);
            //     }
            // }),
            catchError(this.handlerError)            
        );
    }    

    ActualizaDatosEdificacion(data: EdificacionRequest):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'ActualizaDatosEdificacion',
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
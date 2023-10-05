import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { LocalService } from 'src/app/core/shared/services/local.service';
import { environment } from 'src/environments/environment';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { OrdenTrabajo } from '../models/ordenTrabajo.model';
import { OrdenTrabajoFilter } from '../models/ordenTrabajoFilter.model';
import { OrdenTrabajoAction, OrdenTrabajoRequest, OrdenTrabajoResponse, OrdenTrabajoView } from '../models/ordenTrabajoResponse';
import { PersonalAsignado } from '../models/personalAsignado.model';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { Sector } from '../../ficha-individual/models/sector.model';
import { Perfil, PerfilFilter } from '../models/perfil.model';
import { Personal } from '../models/personal.model';

@Injectable()

export class SeguimientoService{

    listaEstadosOrden: ItemSelect<number>[] = [];
    
    DataTableOT: BehaviorSubject<StatusResponse<OrdenTrabajo[]>> = new BehaviorSubject<StatusResponse<OrdenTrabajo[]>>({
        success: false,
        message: '',
        total: 0,
        data: []
    });

    viewOrdenTrabajo: BehaviorSubject<OrdenTrabajoView> = new BehaviorSubject<OrdenTrabajoView>({});    

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

    listarSectores():Observable<StatusResponse<Sector[]>>{   
        
        let cm = this._localService.getData("sicuorg");
        let data = JSON.parse(cm);
        
        return this.http.post<StatusResponse<Sector[]>>(environment.urlWebApiSICU + 'listarSectores',
        {
            'codigoUbigeo': parseInt(data.idUbigeo)
        })
        .pipe(
            tap((response: StatusResponse<Sector[]>) => {
                let con = 0;
                if(response.success){
                    response.data.forEach(item => {
                        con++;
                        item.idSector = con;
                    });
                    response.data.unshift({ idSector: 0, codigoSector: 'Seleccionar'});
                }
            }),
            catchError(this.handlerError)
        );        
    }

    listarManzanas(id: string):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'listarManzanasPorSector',
        {
            'codigoSector': id
        })
        .pipe(
            tap((response: any) => {
                if(response.success){
                    let con = 0;            
                    response.data.forEach(item => {
                        con++;
                        item.idManzana = con;
                    });
                    response.data.unshift({ idManzana: 0, codigoManzana: 'Seleccionar'});
                }
            }),
            catchError(this.handlerError)
        );         
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
    
    listarPerfiles():Observable<StatusResponse<Perfil[]>>{
        return this.http.post<StatusResponse<Perfil[]>>(environment.urlWebApiSecurity + 'listarPerfiles',
        null)
        .pipe(
            tap((response: StatusResponse<Perfil[]>) => {
                if(response.success){
                    response.data.unshift({ idPerfil: 0, nombrePerfil: 'Seleccionar'});
                }
            }),
            catchError(this.handlerError)
        );
    }

    listarPersonasPerfil(filter: PerfilFilter):Observable<StatusResponse<Personal[]>>{

        return this.http.post<StatusResponse<Personal[]>>(environment.urlWebApiSecurity + 'listarUsuariosPorPerfil'
        , filter)
        .pipe(
            tap((response: any) => {
                if(response.success){
                    response.data.unshift({ codigoUsuario: 0, persona: 'Seleccionar', usuario: 'Seleccionar'});
                }
            }),
            catchError(this.handlerError)
        );
    }

    crearOrden(data: OrdenTrabajoRequest):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'setOrdenTrabajo',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    anularOrden(data: OrdenTrabajoAction):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'anularOrdenTrabajo',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    agregarUsuario(data: OrdenTrabajoRequest):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'agregarUsuario',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    quitarUsuario(data: OrdenTrabajoAction):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'quitarUsuario',
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
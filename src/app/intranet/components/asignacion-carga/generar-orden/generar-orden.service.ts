import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { LocalService } from 'src/app/core/shared/services/local.service';
import { environment } from 'src/environments/environment';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { OrdenTrabajo } from '../models/ordenTrabajo.model';
import { OrdenTrabajoFilter } from '../models/ordenTrabajoFilter.model';
import { OrdenTrabajoResponse } from '../models/ordenTrabajoResponse';
import { PersonalAsignado } from '../models/personalAsignado.model';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { Sector } from '../../ficha-individual/models/sector.model';
import { Perfil, PerfilFilter } from '../models/perfil.model';
import { Personal } from '../models/personal.model';

@Injectable()

export class GenerarOrdenService{

    listaEstadosOrden: ItemSelect<number>[] = [];
    
    DataTableOT: BehaviorSubject<StatusResponse<OrdenTrabajo[]>> = new BehaviorSubject<StatusResponse<OrdenTrabajo[]>>({
        success: false,
        message: '',
        total: 0,
        data: []
    });

    constructor(private http: HttpClient,
        private _localService: LocalService){
    
        //this.listaTipopuerta = this.getList<number>(CatalogoMasterEnum.EstadoOrden);
    }    

    get getDataTableOT():Observable<StatusResponse<OrdenTrabajo[]>>{
        return this.DataTableOT.asObservable();
    }

    listarSectores():Observable<StatusResponse<Sector[]>>{   
        
        let cm = this._localService.getData("sicuorg");
        let data = JSON.parse(cm);
        
        return this.http.post<StatusResponse<Sector[]>>(environment.urlWebApiSICU + 'getSectors',
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
        return this.http.post<any>(environment.urlWebApiSICU + 'getManzanas',
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

        return this.http.post<StatusResponse<OrdenTrabajo[]>>(environment.urlWebApiSICU + 'getInformationSector',
        {
            "page": filter.Page,
            "itemsByPage": filter.ItemsByPage,
            "idUbigeo": parseInt(data.idUbigeo),
            "codigoSector": filter.Sector,
            "codigoManzana": filter.Manzana,
            "idEstado": filter.Estado
        });
        // .pipe(
        //     tap((response: any) => {
        //         if(response.success){
        //             let con = 0;            
        //             response.data.forEach(item => {
        //                 con++;
        //                 item.idManzana = con;
        //             });
        //             response.data.unshift({ idManzana: 0, codigoManzana: 'Seleccionar'});
        //         }
        //     }),
        //     catchError(this.handlerError)
        // ); 


        // let ot: OrdenTrabajo[] = [];

        // let det: PersonalAsignado[] = [
        //     { idPerfil: 1, perfil: 'SUPERVISOR', idPersonal: 1, personal: 'CRISTIAN AREVALO SOLIS', idTipo: 1, tipo: 'RESPONSABLE' },
        //     { idPerfil: 1, perfil: 'SUPERVISOR', idPersonal: 1, personal: 'JORGE FLORES DANTE', idTipo: 2, tipo: 'APOYO' },
        //     { idPerfil: 2, perfil: 'TECNICO', idPersonal: 1, personal: 'MANUEL MANTILLA SOLANO', idTipo: 2, tipo: 'APOYO' }];

        // if(filter.Page == 1){
        //     ot = [
        //         { id: 1, Dpto: '15', Prov: '01', Dist: '09', Sec: '01', Mz: '001', TotalLotes: 10, NroOrden:'', EstadoOrden: '', IdEstadoOrden: 0, FechaAsignacion: '', PersonalAsignado: '', seleccion: false, expandir: false },
        //         { id: 2, Dpto: '15', Prov: '01', Dist: '09', Sec: '01', Mz: '002', TotalLotes: 6, NroOrden:'', EstadoOrden: '', IdEstadoOrden: 0, FechaAsignacion: '', PersonalAsignado: '', seleccion: false, expandir: false },
        //         { id: 3, Dpto: '15', Prov: '01', Dist: '09', Sec: '01', Mz: '003', TotalLotes: 8, NroOrden:'0001', EstadoOrden: 'ASIGNADO', IdEstadoOrden: 1, FechaAsignacion: '25/09/2023 19:56', PersonalAsignado: 'CRISTIAN AREVALO SOLIS', seleccion: false, expandir: false, PersonasAsignadas: det },
        //         { id: 4, Dpto: '15', Prov: '01', Dist: '09', Sec: '01', Mz: '004', TotalLotes: 12, NroOrden:'', EstadoOrden: '', IdEstadoOrden: 0, FechaAsignacion: '', PersonalAsignado: '', seleccion: false, expandir: false },
        //         { id: 5, Dpto: '15', Prov: '01', Dist: '09', Sec: '01', Mz: '005', TotalLotes: 10, NroOrden:'', EstadoOrden: '', IdEstadoOrden: 0, FechaAsignacion: '', PersonalAsignado: '', seleccion: false, expandir: false },
        //         { id: 6, Dpto: '15', Prov: '01', Dist: '09', Sec: '01', Mz: '006', TotalLotes: 20, NroOrden:'', EstadoOrden: '', IdEstadoOrden: 0, FechaAsignacion: '', PersonalAsignado: '', seleccion: false, expandir: false },
        //         { id: 7, Dpto: '15', Prov: '01', Dist: '09', Sec: '01', Mz: '007', TotalLotes: 4, NroOrden:'', EstadoOrden: '', IdEstadoOrden: 0, FechaAsignacion: '', PersonalAsignado: '', seleccion: false, expandir: false }
        //     ];
        //     return of({ data: ot, total: 7 });
        // }
        // else{
        //     ot = [
        //         { id: 6, Dpto: '15', Prov: '01', Dist: '09', Sec: '01', Mz: '006', TotalLotes: 20, NroOrden:'', EstadoOrden: '', IdEstadoOrden: 0, FechaAsignacion: '', PersonalAsignado: '', seleccion: false, expandir: false },
        //         { id: 7, Dpto: '15', Prov: '01', Dist: '09', Sec: '01', Mz: '007', TotalLotes: 4, NroOrden:'', EstadoOrden: '', IdEstadoOrden: 0, FechaAsignacion: '', PersonalAsignado: '', seleccion: false, expandir: false }
        //     ];
        //     return of({ data: ot, total: 7 });
        // }
    }
    
    listarPerfiles():Observable<StatusResponse<Perfil[]>>{
        return this.http.post<StatusResponse<Perfil[]>>(environment.urlWebApiSecurity + 'getPerfiles',
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

        return this.http.post<StatusResponse<Personal[]>>(environment.urlWebApiSecurity + 'getPersonas'
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
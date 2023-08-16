import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { LocalService } from 'src/app/core/shared/services/local.service';
import { FichaCatastralFilter } from './models/fichaCatastralFilter.model'

import { environment } from 'src/environments/environment';
import { FichaCatastralResponse } from './models/fichaCatastralResponse.model';
import { Ubigeo } from 'src/app/core/models/ubigeo.model';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { SaveFichaIndividual, UbicacionPredioModel } from './models/saveFichaIndividual.model';
import { ResponseFichaIndividual } from './models/responseFichaIndividual.model';
import { SharedFirstData, SharedThirdData } from './models/sharedFirstData.model';
import { HabilitacionEdificacion } from './models/habilitacionEdificacion.model';
//import { internalIpV4 } from 'internal-ip';
import { OwnershipCharacteristicsRequest } from './models/OwnershipCharacteristics/ownership-characteristics-request.model';

@Injectable()

export class FichaIndividualService{

    DataTableFI: BehaviorSubject<FichaCatastralResponse> = new BehaviorSubject<FichaCatastralResponse>({
        total: 0,
        data: []
    });

    obsHabilitacionEdificacion: BehaviorSubject<HabilitacionEdificacion> = new BehaviorSubject<HabilitacionEdificacion>({});

    obsSharedThirdData: BehaviorSubject<SharedThirdData> = new BehaviorSubject<SharedThirdData>({ codigoCondicionTitular: ''});

    //obsCatalogoMaster: BehaviorSubject<CatalogoMaster[]> = new BehaviorSubject<CatalogoMaster[]>([]);

    dataCatalogoMaster: CatalogoMaster[] = [];

    constructor(private http: HttpClient,
        private _localService: LocalService){
            this.setCatalogoMaster();
        }

    get getDataTableFI():Observable<FichaCatastralResponse>{
        return this.DataTableFI.asObservable();
    }

    get getHabilitacionEdificacion():Observable<HabilitacionEdificacion>{
        return this.obsHabilitacionEdificacion.asObservable();
    }

    get getSharedThirdData():Observable<SharedThirdData>{
        return this.obsSharedThirdData.asObservable();
    }

    getCatalogoMaster(): CatalogoMaster[]{
              
        let cm = this._localService.getData("cmsicu");
        return JSON.parse(cm);
    }

    setCatalogoMaster():void{
            this.http.post<CatalogoMaster[]>(environment.urlWebApiSICU + 'C0001G0001', null).subscribe({
                next: data => {
                    let ctd = 0;
                    let datosCatalogoMaster: CatalogoMaster[] = [];
                    data.forEach(cv => {
                        cv.id = ctd + 1;
                        datosCatalogoMaster.push(cv);
                        ctd++;
                    });

                    this._localService.removeData("cmsicu");
                    this._localService.saveData("cmsicu", JSON.stringify(datosCatalogoMaster))                    
                },
                error: error => {                    
                    console.error('Error al recuperar el catalogo maestro:', error.message);
                }
            });
    }    

    listarFichasCatastrales(filter: FichaCatastralFilter):Observable<FichaCatastralResponse>{
        
        let tk = this._localService.getData("Token");
        let user = JSON.parse(tk);        

        const headers = new HttpHeaders().append(
                    'Authorization',
                    'Bearer ' + user.data.token
                );

        return this.http.post<FichaCatastralResponse>(environment.urlWebApiSecurity + 'Customers/ListFichasIndividualesAsync',
        filter,
        {
            headers: headers
        })
        .pipe(
            catchError(this.handlerError)
        );
    }

    listarDepartamentos():Observable<Ubigeo[]>{
        
        // let tk = this._localService.getData("Token");
        // let user = JSON.parse(tk);        

        // const headers = new HttpHeaders().append(
        //             'Authorization',
        //             'Bearer ' + user.data.token
        //         );

        // return this.http.get<Ubigeo[]>(environment.urlWebApiSICU + 'Customers/GetDepartamentosList',
        // {
        //     headers: headers
        // })
        // .pipe(
        //     tap((response:any) => {
        //         response.unshift({ id: 0, ubigeo: '000000', nombreDepartamento: 'Seleccionar', ubigeoDepartamento: '00' });
        //     }),            
        //     catchError(this.handlerError)
        // );

        return this.http.post<any>(environment.urlWebApiSICU + 'C0002G0001', null)
        .pipe(
            tap((response:any) => {
                response.unshift({ id: 0, ubigeo: '000000', nombreDepartamento: 'Seleccionar', ubigeoDepartamento: '00' });
            }),
            catchError(this.handlerError)
        );

    }
    
    listarProvincias(id: string):Observable<any>{
        
        // let tk = this._localService.getData("Token");
        // let user = JSON.parse(tk);
     
        // const httpOptions = {
        //     headers: { 'Authorization': 'Bearer ' + user.data.token },
        //     params: {'CodigoDepartamento': id}
        // }

        // return this.http.get<any>(environment.urlWebApiSICU + 'Customers/GetProvinciasListByCodigoDepartamento',
        // httpOptions)
        // .pipe(
        //     tap((response:any) => {
        //         response.unshift({ id: 0, ubigeo: '000000', nombreProvincia: 'Seleccionar', ubigeoProvincia: '00' });
        //     }),             
        //     catchError(this.handlerError)
        // );

        return this.http.post<any>(environment.urlWebApiSICU + 'C0002G0002',
        {'ubigeoDepartamento': id})
        .pipe(
            tap((response: any) => {
                response.unshift({ id: 0, ubigeo: '000000', nombreProvincia: 'Seleccionar', ubigeoProvincia: '00' });
            }),
            catchError(this.handlerError)
        );
    }

    listarDistritos(idProv: string, idDpto: string):Observable<Ubigeo[]>{

        return this.http.post<any>(environment.urlWebApiSICU + 'C0002G0003',
        {
            'ubigeoProvincia': idProv,
            'ubigeoDepartamento': idDpto
        })
        .pipe(
            tap((response: any) => {
                response.unshift({ id: 0, ubigeo: '000000', nombreDistrito: 'Seleccionar', ubigeoDistrito: '00' });
            }),
            catchError(this.handlerError)
        );
    }

    listarSectores(id: number):Observable<any>{        
        return this.http.post<any>(environment.urlWebApiSICU + 'LocalizacionSectorList',
        {
            'codigoUbigeo': id
        })
        .pipe(
            tap((response: any) => {
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
        return this.http.post<any>(environment.urlWebApiSICU + 'LocalizacionManzanaList',
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


    saveCodigoReferenciaCatastral(data: SaveFichaIndividual):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'f0025CodigoReferenciaCatastral',
        {
            'idObjeto': data.idObjeto,
            'codigoDepartamento': data.codigoDepartamento,
            'codigoProvincia': data.codigoProvincia,
            'codigoDistrito': data.codigoDistrito,
            'sector': data.sector,
            'manzana': data.manzana,
            'lote': data.lote,
            'edifica': data.edifica,
            'entrada': data.entrada,
            'piso': data.piso,
            'unidad': data.unidad,
            'dc': data.dc
        })
        .pipe(
            catchError(this.handlerError)
        );         
    }

    saveUbicacionPredial(data: UbicacionPredioModel):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'f0026TmpS2UbicacionPredio',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    saveCaracteristicasTitularidad(data: OwnershipCharacteristicsRequest):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'f0029TmpS3TitularPredio',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    listarVias(data: SharedFirstData):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'LocalizacionViaList',
        {
            'codigoSector': data.codigoSector,
            'codigoManzana': data.codigoManzana
        })
        .pipe(
            tap((result)=>{

                console.log(result);

                this.GetHabilitacionEdificacion(data).subscribe(response => {
                    this.obsHabilitacionEdificacion.next(response.data);
                });
            }),
            catchError(this.handlerError)
        );         
    }

    GetHabilitacionEdificacion(data: SharedFirstData):Observable<any>{
        return this.http.post(environment.urlWebApiSICU + 'localizacionHabiEdiList',
        {
            'codigoSector': data.codigoSector,
            'codigoManzana': data.codigoManzana
        })
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
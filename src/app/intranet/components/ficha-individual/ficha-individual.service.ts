import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { LocalService } from 'src/app/core/shared/services/local.service';
import { FichaCatastralFilter } from './models/fichaCatastralFilter.model';

import { environment } from 'src/environments/environment';
import { FichaCatastralResponse } from './models/fichaCatastralResponse.model';
import { Ubigeo } from 'src/app/core/models/ubigeo.model';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { SaveFichaIndividual, UbicacionPredioModel } from './models/saveFichaIndividual.model';
import { SharedThirdData } from './models/sharedFirstData.model';
import { Habilitacion } from './models/habilitacionEdificacion.model';
//import { internalIpV4 } from 'internal-ip';
import { OwnershipCharacteristicsRequest } from './models/OwnershipCharacteristics/ownership-characteristics-request.model';
import { DescriptionPropertyRequest } from './models/DescriptionProperty/description-property-request.model';
import { IdentityOwnerRequest } from './models/IdentityOwner/identity-owner-request.model';
import { BuildingsRequest } from './models/Buildings/buildings-request.model';
import { FichaCatastralIndividual } from './models/fichaCatastralIndividual.model';

@Injectable()

export class FichaIndividualService{

    DataTableFI: BehaviorSubject<FichaCatastralResponse> = new BehaviorSubject<FichaCatastralResponse>({
        total: 0,
        data: []
    });

    obsEditFichaCatastralIndividual: BehaviorSubject<FichaCatastralIndividual> = new BehaviorSubject<FichaCatastralIndividual>({});

    obsHabilitacionEdificacion: BehaviorSubject<Habilitacion> = new BehaviorSubject<Habilitacion>({});

    obsSharedThirdData: BehaviorSubject<SharedThirdData> = new BehaviorSubject<SharedThirdData>({ codigoCondicionTitular: ''});

    dataCatalogoMaster: CatalogoMaster[] = [];

    constructor(private http: HttpClient,
        private _localService: LocalService
        ){
            //this.setCatalogoMaster();
        }

    get getEditFichaCatastralIndividual():Observable<FichaCatastralIndividual>{
        return this.obsEditFichaCatastralIndividual.asObservable();
    }

    get getDataTableFI():Observable<FichaCatastralResponse>{
        return this.DataTableFI.asObservable();
    }

    get getHabilitacionEdificacion():Observable<Habilitacion>{
        return this.obsHabilitacionEdificacion.asObservable();
    }

    get getSharedThirdData():Observable<SharedThirdData>{
        return this.obsSharedThirdData.asObservable();
    }

    getCatalogoMaster(): CatalogoMaster[]{
        let cm = this._localService.getData("sicucm");
        console.log(JSON.parse(cm));
        return JSON.parse(cm);      
    }

    // setCatalogoMaster():void{

    //     let cm = this._localService.getData("sicucm");
    //     if(cm.length == 0){
            
    //         this.http.post<CatalogoMaster[]>(environment.urlWebApiSICU + 'C0001G0001', null).subscribe({
    //             next: data => {
    //                 let ctd = 0;
    //                 let datosCatalogoMaster: CatalogoMaster[] = [];
    //                 data.forEach(cv => {
    //                     cv.id = ctd + 1;
    //                     datosCatalogoMaster.push(cv);
    //                     ctd++;
    //                 });

    //                 this._localService.removeData("sicucm");
    //                 this._localService.saveData("sicucm", JSON.stringify(datosCatalogoMaster))                    
    //             },
    //             error: error => {                    
    //                 console.error('Error al recuperar el catalogo maestro:', error.message);
    //             }
    //         });
    //     }
    // }    

    listarFichasCatastrales(filter: FichaCatastralFilter):Observable<FichaCatastralResponse>{
        
        let tk = this._localService.getData("Token");
        let user = JSON.parse(tk);        

        const headers = new HttpHeaders().append(
                    'Authorization',
                    'Bearer ' + user.data.token
                );

        let a:FichaCatastralResponse;
        return of(a);
        // return this.http.post<FichaCatastralResponse>(environment.urlWebApiTest + 'Customers/ListFichasIndividualesAsync',
        // filter,
        // {
        //     headers: headers
        // })
        // .pipe(
        //     catchError(this.handlerError)
        // );
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

    listarCategoriaValoresUnitarios():Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'f0031CategoriaValoresUnitarios',
        null)
        .pipe(
            // map((response: any) => {
            //     if(response.success){
            //         let con = 0;
            //         let lista: ItemSelect<number>[] = [];
            //         response.data.forEach(item => {
            //             con++;
            //             lista.push({
            //                 value: con,
            //                 code: item.codigoCategoria,
            //                 text: item.nombreCategoria
            //             })
            //         });
            //         lista.unshift({ value: 0, code: 'Seleccionar', text: 'Seleccionar' });
            //         response.data = lista;
            //     }
            // }),
            catchError(this.handlerError)
        );         
    }    

    save1CodigoReferenciaCatastral(data: SaveFichaIndividual):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'f0001TmpS1UnidadAdministrativa',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    save2UbicacionPredial(data: UbicacionPredioModel):Observable<any>{ 
        return this.http.post<any>(environment.urlWebApiSICU + 'f0026TmpS2UbicacionPredio',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    save3CaracteristicasTitularidad(data: OwnershipCharacteristicsRequest):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'f0029TmpS3TitularPredio',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    save4IdentificacionTitular(data: IdentityOwnerRequest):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'f0030TmpS4IdentificacionTitular',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    save5DescripcionPredio(data: DescriptionPropertyRequest):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'TmpS5DescripcionPredio',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    save6Construcciones(data: BuildingsRequest[]):Observable<any>{
        return this.http.post<any>(environment.urlWebApiSICU + 'TmpS6Construcciones',
        data)
        .pipe(
            catchError(this.handlerError)
        );         
    }

    
    // listarVias(data: SharedFirstData):Observable<any>{
    //     return this.http.post<any>(environment.urlWebApiSICU + 'LocalizacionViaList',
    //     {
    //         'codigoSector': data.codigoSector,
    //         'codigoManzana': data.codigoManzana
    //     })
    //     .pipe(
    //         tap((result)=>{

    //             console.log(result);

    //             this.GetHabilitacionEdificacion(data).subscribe(response => {
    //                 this.obsHabilitacionEdificacion.next(response.data);
    //             });
    //         }),
    //         catchError(this.handlerError)
    //     );         
    // }

    // GetHabilitacionEdificacion(data: SharedFirstData):Observable<any>{
    //     return this.http.post(environment.urlWebApiSICU + 'localizacionHabiEdiList',
    //     {
    //         'codigoSector': data.codigoSector,
    //         'codigoManzana': data.codigoManzana
    //     })
    //     .pipe( 
    //         catchError(this.handlerError)
    //     );         
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
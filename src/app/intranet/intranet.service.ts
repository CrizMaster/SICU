import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { LocalService } from '../core/shared/services/local.service';

import { environment } from 'src/environments/environment';
import { CatalogoMaster } from '../core/models/catalogo-master.model';
import { StatusResponse } from '../core/models/statusResponse.model';

@Injectable( {  providedIn: 'root' })

export class IntranetService implements OnInit {


    currentComponentMenu: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    constructor(private http: HttpClient,
        private _localService: LocalService){}

    ngOnInit(): void {
        //this.setCatalogoMaster();
    }

    get getCurrentComponentMenu():Observable<any>{
        return this.currentComponentMenu.asObservable();
    }

    setMasterCatalog(): Observable<StatusResponse<CatalogoMaster[]>>{
        let cm = this._localService.getData("sicucm");
        if(cm.length == 0){
            return this.http.post<StatusResponse<CatalogoMaster[]>>(environment.urlWebApiSICU + 'obtener', null);
        }
        else{
            let resp = JSON.parse(cm);
            let data: StatusResponse<CatalogoMaster[]> = { success:true, data: resp, message: '', total:1, validations: [] };
            
            return of(data);
        }        
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

    //                 console.log('carga del catalogo');

    //                 let estados: CatalogoMaster[] = [];
    //                 estados.push({ id: ctd + 1, orden: '1', nombre: 'ASIGNADO', grupo: '999' });
    //                 estados.push({ id: ctd + 2, orden: '2', nombre: 'EN PROCESO', grupo: '999' });

    //                 this._localService.removeData("sicucm");
    //                 this._localService.saveData("sicucm", JSON.stringify(datosCatalogoMaster))                    
    //             },
    //             error: error => {                    
    //                 console.error('Error al recuperar el catalogo maestro:', error.message);
    //             }
    //         });
    //     }
    // }

    listaOrganizaciones():Observable<any>{
        
        // let tk = this._localService.getData("Token");
        // let user = JSON.parse(tk);
     
        // const headers = { 'Authorization': 'Bearer ' + user.data.token }

        // return this.http.get<any>(environment.urlWebApiTest + 'Customers/GetListOrganizacionesAsync',
        // { headers })
        // .pipe(
        //     catchError(this.handlerError)
        // );
        return this.http.post<any>(environment.urlWebApiShowSecurity + 'GetListOrganizacionesAsync',{})
        .pipe(
            catchError(this.handlerError)
        );
    }

    listaPerfiles(id: string):Observable<any>{
        
        // let tk = this._localService.getData("Token");
        // let user = JSON.parse(tk);
     
        // const httpOptions = {
        //     headers: { 'Authorization': 'Bearer ' + user.data.token },
        //     params: {'idOrganizacion': id}
        // }

        // return this.http.get<any>(environment.urlWebApiTest + 'Customers/GetListPerfilesAsync',
        // httpOptions)
        // .pipe(
        //     catchError(this.handlerError)
        // );
        return this.http.post<any>(environment.urlWebApiShowSecurity + 'GetListPerfilesAsync',
        {
            idOrganizacion: id
        })
        .pipe(
            catchError(this.handlerError)
        );        
    }
    
    listaMenu(idOrg: number, idPer: number):Observable<any>{
        
        let tk = this._localService.getData("Token");
        let user = JSON.parse(tk);
     
        let queryParams = new HttpParams();
        queryParams = queryParams.append("idOrganizacion",idOrg);
        queryParams = queryParams.append("idPerfil",idPer);

        const httpOptions = {
            headers: { 'Authorization': 'Bearer ' + user.data.token },
            params: queryParams            
        }

        // return this.http.get<any>(environment.urlWebApiTest + 'Customers/GetListMenuAsync',
        // httpOptions)
        // .pipe(
        //     catchError(this.handlerError)
        // );

        return this.http.post<any>(environment.urlWebApiShowSecurity + 'GetListMenuAsync',
        {
            idPerfil: idPer
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
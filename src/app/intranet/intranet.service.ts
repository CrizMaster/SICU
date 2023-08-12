import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { LocalService } from '../core/shared/services/local.service';

import { environment } from 'src/environments/environment';

@Injectable()

export class IntranetService{


    currentComponentMenu: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    constructor(private http: HttpClient,
        private _localService: LocalService){}


    get getCurrentComponentMenu():Observable<any>{
        return this.currentComponentMenu.asObservable();
    }

    listaOrganizaciones():Observable<any>{
        
        let tk = this._localService.getData("Token");
        let user = JSON.parse(tk);
     
        const headers = { 'Authorization': 'Bearer ' + user.data.token }

        return this.http.get<any>(environment.urlWebApiSecurity + 'Customers/GetListOrganizacionesAsync',
        { headers })
        .pipe(
            catchError(this.handlerError)
        );
    }

    listaPerfiles(id: string):Observable<any>{
        
        let tk = this._localService.getData("Token");
        let user = JSON.parse(tk);
     
        const httpOptions = {
            headers: { 'Authorization': 'Bearer ' + user.data.token },
            params: {'idOrganizacion': id}
        }

        return this.http.get<any>(environment.urlWebApiSecurity + 'Customers/GetListPerfilesAsync',
        httpOptions)
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

        //const headers = { 'Authorization': 'Bearer ' + user.data.token }

        return this.http.get<any>(environment.urlWebApiSecurity + 'Customers/GetListMenuAsync',
        httpOptions)
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
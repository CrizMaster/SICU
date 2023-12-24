import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { ProductoFilter, ProductoRequest, ProductoResponse } from '../../models/productoResponse';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/shared/services/auth.service';
import { Router } from '@angular/router';

@Injectable( {  providedIn: 'root' })

export class MantenimientoService implements OnInit {


    constructor(
        private http: HttpClient,
        private _authService: AuthService,
        private route: Router
        ){}

    ngOnInit(): void {
        //this.setCatalogoMaster();
    }

    ListarProducto(filter: ProductoFilter): Observable<StatusResponse<ProductoResponse[]>>{
        return this.http.post<StatusResponse<ProductoResponse[]>>(environment.urlWebApiEyL + 'Mantenimiento/ListarProducto', 
        filter);      
    }

    GestionarProducto(request: ProductoRequest): Observable<StatusResponse<number>>{
        return this.http.post<StatusResponse<number>>(environment.urlWebApiEyL + 'Mantenimiento/GestionarProducto', 
        request);
        // .pipe(
        //     catchError(this.handlerError)            
        // );       
    }    

    private handlerError(error: HttpErrorResponse) {
        let msn = '';
        if(error.status == 0){
            msn = 'Algo falló. Por favor intente nuevamente.';
            console.error(msn);
        }
        else{
            console.error('Backend retornó el código de estado ' + error.status);
            msn = error.message;
        }
        if(error.status == 401) { 
            this._authService.isLoggedIn.next(false); 
            this.route.navigateByUrl('/login');
        }
        //return throwError(() => new Error(msn));
        //return Observable.throw('');
        return of({ 
            success: false, 
            codeStatus: error.status,
            message: msn
        });
    }
}
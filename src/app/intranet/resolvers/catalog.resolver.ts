import { IntranetService } from "../intranet.service";
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { CatalogoMaster } from "src/app/core/models/catalogo-master.model";
import { LocalService } from "src/app/core/shared/services/local.service";
import { StatusResponse } from "src/app/core/models/statusResponse.model";

export const CatalogResolver: ResolveFn<{ success:boolean }> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    _localService: LocalService = inject(LocalService),
    _intranetService: IntranetService = inject(IntranetService)
): Observable<{ success: boolean }> => _intranetService.setMasterCatalog().pipe(   
    tap((response: StatusResponse<CatalogoMaster[]>) => {
        let con = 0;
        response.data.forEach(cv => {
            cv.id = con + 1;
            con++;
        });
   
        let item = response.data.find((obj) => { return obj.grupo === '998'; })
        if(item == undefined) {

            // response.data.push({ id: con + 1, orden: '01', nombre: 'RESPONSABLE', grupo: '997' });
            // response.data.push({ id: con + 2, orden: '02', nombre: 'APOYO', grupo: '997' });

            response.data.push({ id: con + 3, orden: '01', nombre: 'SUPERVISOR', grupo: '998' });
            response.data.push({ id: con + 4, orden: '02', nombre: 'TÉCNICO', grupo: '998' });

            // response.data.push({ id: con + 5, orden: '01', nombre: 'ASIGNADO', grupo: '999' });
            // response.data.push({ id: con + 6, orden: '02', nombre: 'EN PROCESO', grupo: '999' });
        }       

        _localService.removeData("sicucm");
        _localService.saveData("sicucm", JSON.stringify(response.data));
    }),
    map((data: StatusResponse<CatalogoMaster[]>) => ({ success : true })),
    catchError((error) => {
        console.log('Error no se puede recuperar el catalogo maestro.');
        return of({ success: false });
    })
);
import { IntranetService } from "../intranet.service";
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { CatalogoMaster } from "src/app/core/models/catalogo-master.model";
import { LocalService } from "src/app/core/shared/services/local.service";
import { StatusResponse } from "src/app/core/models/statusResponse.model";
import { CatalogoModel } from "src/app/core/models/catalogo.model";

export const CatalogResolver: ResolveFn<{ success:boolean }> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    _localService: LocalService = inject(LocalService),
    _intranetService: IntranetService = inject(IntranetService)
): Observable<{ success: boolean }> => _intranetService.setMasterCatalog().pipe(   
    tap((response: StatusResponse<CatalogoModel[]>) => {
        _localService.removeData("catmaster");
        _localService.saveData("catmaster", JSON.stringify(response.data));
    }),
    map((data: StatusResponse<CatalogoModel[]>) => ({ success : true })),
    catchError((error) => {
        console.log('Error no se puede recuperar el catalogo maestro.');
        return of({ success: false });
    })
);
import { IntranetService } from "../intranet.service";
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { LocalService } from "src/app/core/shared/services/local.service";
import { StatusResponse } from "src/app/core/models/statusResponse.model";
import { MenuResponse } from "../models/menuResponse";

export const MenuResolver: ResolveFn<{ Success:boolean }> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    _localService: LocalService = inject(LocalService),
    _intranetService: IntranetService = inject(IntranetService)
): Observable<{ Success: boolean }> => _intranetService.ListarMenu().pipe(   
    tap((response: StatusResponse<MenuResponse[]>) => {
        if(response.success){
            _localService.removeData("eylmenu");
            _localService.saveData("eylmenu", JSON.stringify(response.data));
        }        
    }),
    map((data: StatusResponse<MenuResponse[]>) => ({ Success : true })),
    catchError((error) => {
        console.log('Error no se puede recuperar el catalogo maestro.');
        return of({ Success: false });
    })
);
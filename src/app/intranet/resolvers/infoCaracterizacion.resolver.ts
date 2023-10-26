import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StatusResponse } from "src/app/core/models/statusResponse.model";
import { OrdenTrabajoService } from "../components/formularios/orden-trabajo/orden-trabajo.service";
import { CaracterizacionResponse } from "../components/formularios/models/caracterizacionResponse";

export const InfoCaracterizacionResolver: ResolveFn<StatusResponse<CaracterizacionResponse>> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    _ordenTrabajoService: OrdenTrabajoService = inject(OrdenTrabajoService)
): Observable<StatusResponse<CaracterizacionResponse>> => _ordenTrabajoService
    .obtieneInformacionCaracterizacionLote()
    .pipe(
        catchError((error) => {
            console.log('Error no se puede recuperar los datos de caracterización.');
            let rpto: StatusResponse<CaracterizacionResponse> = { success: false, total: 0, message: 'Error no se puede recuperar los datos de caracterización.' }
            return of(rpto);
        })
    );
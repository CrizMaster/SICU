import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GenerarOrdenService } from "../components/asignacion-carga/generar-orden/generar-orden.service";
import { StatusResponse } from "src/app/core/models/statusResponse.model";
import { Sector } from "../components/ficha-individual/models/sector.model";

export const SectorResolver: ResolveFn<StatusResponse<Sector[]>> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    _generarOrdenService: GenerarOrdenService = inject(GenerarOrdenService)
): Observable<StatusResponse<Sector[]>> => _generarOrdenService.listarSectores().pipe(
    catchError((error) => {
        console.log('Error no se puede recuperar los sectores.');
        let rpto: StatusResponse<Sector[]> = { success: false, total: 0, data: [], message: 'No se pudo recuperar los sectores.' }
        return of(rpto);
    })
);
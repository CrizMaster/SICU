import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';
import { UnidadAdministrativaService } from '../unidad-administrativa.service';

@Component({
    selector: 'app-vincular-unidad-administrativa',
    templateUrl: './vincular-unidad-administrativa.component.html',
    styleUrls: ['./vincular-unidad-administrativa.component.css']
})
export class VincularUnidadAdministrativaComponent implements OnInit, OnDestroy {

    displayedColumns: string[] = ['Dpto', 'Prov', 'Dist', 'Sec', 'Mz', 'Lote', 
    'Edifica', 'Entrada', 'Piso', 'Unidad'];

    dataSource = new MatTableDataSource<UnidadAdministrativaResponse>();
    
    constructor(
        private _unidadAdministrativaService: UnidadAdministrativaService
    ){}

    ngOnInit(): void {
        this._unidadAdministrativaService.UnidadAdministrativa.subscribe({
            next:(Data:StatusResponse<UnidadAdministrativaResponse>) => {
                let lista:UnidadAdministrativaResponse[] = [];
                lista.push(Data.data);
                this.dataSource = new MatTableDataSource<UnidadAdministrativaResponse>(lista);
                this.dataSource._updateChangeSubscription();                  
            }
        });         
    }

    ngOnDestroy(): void {}

    regresar(){
        let datos: StatusResponse<UnidadAdministrativaResponse> = {
            success: false
        };
  
        this._unidadAdministrativaService.UnidadAdministrativa.next(datos);         
    }
}
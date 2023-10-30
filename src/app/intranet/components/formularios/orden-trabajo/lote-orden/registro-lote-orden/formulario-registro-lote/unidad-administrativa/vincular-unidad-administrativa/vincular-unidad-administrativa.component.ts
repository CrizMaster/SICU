import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';
import { UnidadAdministrativaService } from '../unidad-administrativa.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-vincular-unidad-administrativa',
    templateUrl: './vincular-unidad-administrativa.component.html',
    styleUrls: ['./vincular-unidad-administrativa.component.css']
})
export class VincularUnidadAdministrativaComponent implements OnInit, OnDestroy {

    index: number = 1;
    displayedColumns: string[] = ['Dpto', 'Prov', 'Dist', 'Sec', 'Mz', 'Lote', 
    'Edifica', 'Entrada', 'Piso', 'Unidad'];

    dataSource = new MatTableDataSource<UnidadAdministrativaResponse>();
    
    constructor(
        private _unidadAdministrativaService: UnidadAdministrativaService,
        private route: Router,
        private _activatedRoute:ActivatedRoute
    ){
        this._unidadAdministrativaService.UnidadAdministrativa.subscribe({
            next:(Data:StatusResponse<UnidadAdministrativaResponse>) => {
                let lista:UnidadAdministrativaResponse[] = [];
                lista.push(Data.data);
                this.dataSource = new MatTableDataSource<UnidadAdministrativaResponse>(lista);
                this.dataSource._updateChangeSubscription();                  
            }
        });         
    }

    ngOnInit(): void {
        
    }

    ngOnDestroy(): void {}

    getIndex(ind: number){
        this.index = ind;
        switch(ind){
            case 1: this.route.navigate(['vincular'], { relativeTo: this._activatedRoute })
                    break;
            case 2: this.route.navigate(['titularidad'], { relativeTo: this._activatedRoute })
                    break;
            case 3: this.route.navigate(['unidad'], { relativeTo: this._activatedRoute })
                    break;
            case 4: this.route.navigate(['construcciones'], { relativeTo: this._activatedRoute })
                    break;
            case 5: this.route.navigate(['otras-instalaciones'], { relativeTo: this._activatedRoute })
                    break;
        }        
    }
    
    regresar(){
        let datos: StatusResponse<UnidadAdministrativaResponse> = {
            success: false
        };
  
        this._unidadAdministrativaService.UnidadAdministrativa.next(datos);         
    }
}
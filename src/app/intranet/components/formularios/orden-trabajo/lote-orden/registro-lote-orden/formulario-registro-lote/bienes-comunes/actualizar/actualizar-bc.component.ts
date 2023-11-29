import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { BienesComunesService } from '../bienes-comunes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BienesComunesResponse } from 'src/app/intranet/components/formularios/models/bienesComunesResponse';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-actualizar-bc',
    templateUrl: './actualizar-bc.component.html',
    styleUrls: ['./actualizar-bc.component.css']
})
export class ActualizarBcComponent implements OnInit, OnDestroy {

    index: number = 1;
    matriz: boolean = false;
    displayedColumns: string[] = ['Dpto', 'Prov', 'Dist', 'Sec', 'Mz', 'Lote', 'Edifica', 'Entrada', 'Piso', 'Unidad'];;

    dataSource = new MatTableDataSource<BienesComunesResponse>();

    public itemBC$: Subscription = new Subscription;
    
    constructor(
        private _BienesComunesService: BienesComunesService,
        private route: Router,
        private _activatedRoute:ActivatedRoute
    ){
        this.itemBC$ = this._BienesComunesService.BienesComunes.subscribe({
            next:(Data:StatusResponse<BienesComunesResponse>) => {
                if(Data.data != undefined){

                    let lista:BienesComunesResponse[] = [];
                    lista.push(Data.data);

                    if(Data.data.numeroEdificacion == '99') this.matriz = true;

                    this.dataSource = new MatTableDataSource<BienesComunesResponse>(lista);
                    this.dataSource._updateChangeSubscription(); 
                }                 
            }
        }); 
        
    }

    ngOnInit(): void {
        this.getIndex(1);
    }

    ngOnDestroy(): void {
        this.itemBC$.unsubscribe();
    }

    getIndex(ind: number){
        this.index = ind;
        switch(ind){
            case 1: this.route.navigate(['ubicacion'], { relativeTo: this._activatedRoute })
                    break;
            case 2: this.route.navigate(['predio'], { relativeTo: this._activatedRoute })
                    break;
            case 3: this.route.navigate(['construcciones-bc'], { relativeTo: this._activatedRoute })
                    break;
            case 4: this.route.navigate(['otras-instalaciones-bc'], { relativeTo: this._activatedRoute })
                    break;
            case 5: this.route.navigate(['recapitulacion-bc'], { relativeTo: this._activatedRoute })
                    break;
            case 6: this.route.navigate(['recapitulacion-matriz'], { relativeTo: this._activatedRoute })
                    break;                    
        }        
    }
    
    regresar(){
        let datos: StatusResponse<BienesComunesResponse> = {
            success: false
        };
  
        this._BienesComunesService.BienesComunes.next(datos);         
    }
}
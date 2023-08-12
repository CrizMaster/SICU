import { Component, OnInit } from '@angular/core';
import { FichaCatastralFilter } from '../models/fichaCatastralFilter.model';
import { FichaIndividualService } from '../ficha-individual.service';

  
@Component({
    selector: 'app-panel-filter',
    templateUrl: './panel-filter.component.html',
    styleUrls: ['./panel-filter.component.css']
})
export class PanelFilterComponent implements OnInit{

    step = 0;
    customCollapsedHeight: string = '36px';
    customExpandedHeight: string = '36px';    
    filter: FichaCatastralFilter;

    NumeroFicha: string = '';
    FichaLote: string = '';
    CUC: string = '';
    IdCondicionTitular: number = 0;
    IdTipoTitular: number = 0;
    
    constructor(private _fichaIndividualService: FichaIndividualService){
        this.filter = { Page:1, ItemsByPage: 5, NroFicha: '', FichaLote: '', CUC: '', IdCondicion: 0, IdTipoTitular: 0 }
    }

    ngOnInit(): void {
    } 

    buscar(){
        this.filter = { Page:1, ItemsByPage: 5, 
            NroFicha: this.NumeroFicha, 
            FichaLote: this.FichaLote, 
            CUC: this.CUC, 
            IdCondicion: this.IdCondicionTitular, 
            IdTipoTitular: this.IdTipoTitular }

        this._fichaIndividualService.listarFichasCatastrales(this.filter).subscribe({
            next:(Data: any) => {
                this._fichaIndividualService.DataTableFI.next(Data);
            }
          })
    }
}
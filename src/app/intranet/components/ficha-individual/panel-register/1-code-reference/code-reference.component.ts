import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CodeReferenceModalComponent } from '../1-code-reference-modal/code-reference-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FichaIndividualService } from '../../ficha-individual.service';

import { SaveFichaIndividual } from 'src/app/intranet/components/ficha-individual/models/saveFichaIndividual.model';
import { Subscription } from 'rxjs';
import { SharedData, SharedFirstData } from '../../models/sharedFirstData.model';

@Component({
    selector: 'app-code-reference',
    templateUrl: './code-reference.component.html',
    styleUrls: ['./code-reference.component.css']
})
export class CodeReferenceComponent implements OnInit, OnDestroy {

    @Output() firstComplete = new EventEmitter<SharedData<SharedFirstData>>();

    @Input() codRefCatastral: any[] = ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'];
    
    @Input() Stepper: MatStepper;
    
    btnNextDisabled: boolean = true;
    dataFirst: any;
    progress: boolean = false;
    titleBtn: string = 'Agregar';

    public saveCRC$: Subscription = new Subscription;

    constructor(
        public dialog: MatDialog,
        private _fichaIndividualService: FichaIndividualService) { }

    ngOnInit(): void { }

    ngOnDestroy(): void {
        this.saveCRC$.unsubscribe();
    }

    Agregar(enterAnimationDuration: string, exitAnimationDuration: string):void {
        
        const dialogRef = this.dialog.open(CodeReferenceModalComponent, {
            width: '500px',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data: this.dataFirst
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result != ''){
            this.dataFirst = result;
            let codigo = result.codigoUbigeo + result.codigoSector + result.codigoManzana + result.lote + 
            result.edifica + result.entrada + result.piso + result.unidad + result.dc;
            this.dataFirst.CRC = codigo;

            this.codRefCatastral = codigo.split('');
            this.btnNextDisabled = false;            
            this.titleBtn = 'Modificar';

            let data: SharedData<SharedFirstData> = { complete: false, data: null }
            this.firstComplete.emit(data);            
          }            
        });        
    }

    goNext(){
        this.progress = true;
        console.log(this.dataFirst);

        let request: SaveFichaIndividual = 
        {   idObjeto: this.dataFirst.idObjeto, 
            codigoDepartamento: this.dataFirst.departamento,
            codigoProvincia: this.dataFirst.provincia,
            codigoDistrito: this.dataFirst.codigoDistrito,
            sector: this.dataFirst.codigoSector,
            manzana: this.dataFirst.codigoManzana,
            lote: this.dataFirst.lote,
            edifica: this.dataFirst.edifica,
            entrada: this.dataFirst.entrada,
            piso: this.dataFirst.piso,
            unidad: this.dataFirst.unidad,
            dc: this.dataFirst.dc
        };

        this.saveCRC$ = this._fichaIndividualService.saveCodigoReferenciaCatastral(request).subscribe(result => {
            
            let shDataFirst: SharedFirstData = {          
                codigoSector: this.dataFirst.codigoSector,
                codigoManzana: this.dataFirst.codigoManzana
            }
            let data: SharedData<SharedFirstData> = { complete: true, data: shDataFirst }
            this.firstComplete.emit(data);
            
            setTimeout(() => {
                this.dataFirst.idObjeto = result.idObjeto;
                this.progress = false;
                this.btnNextDisabled = true;
                this.Stepper.next();
              }, 500);  
        });
    }

}
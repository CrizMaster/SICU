import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CodeReferenceModalComponent } from '../1-code-reference-modal/code-reference-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FichaIndividualService } from '../../ficha-individual.service';

import { SaveFichaIndividual } from 'src/app/intranet/components/ficha-individual/models/saveFichaIndividual.model';
import { Subscription } from 'rxjs';
import { SharedData, SharedFirstData } from '../../models/sharedFirstData.model';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-code-reference',
    templateUrl: './code-reference.component.html',
    styleUrls: ['./code-reference.component.css']
})
export class CodeReferenceComponent implements OnInit, OnDestroy {

    @Output() firstComplete = new EventEmitter<SharedData<SharedFirstData>>();

    @Input() codRefCatastral: any[] = ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'];    
    @Input() Stepper: MatStepper;
    @Input() idFicha: number = 0;
    
    btnNextDisabled: boolean = true;
    dataFirst: any;
    progress: boolean = false;
    titleBtn: string = 'Agregar';

    public saveCRC$: Subscription = new Subscription;

    constructor(
        public dialog: MatDialog,
        private _fichaIndividualService: FichaIndividualService) { }

    ngOnInit(): void { 
    }

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
            result.edifica + result.entrada + result.piso + result.unidad;
            this.dataFirst.CRC = codigo;

            let codigoRefCatastral = codigo.split('');

            //calculando el DC
            let cont = 0;
            codigoRefCatastral.forEach(item => {
                cont = cont + parseInt(item);
                if(cont >= 9) cont = cont - 9;
            });

            codigo = codigo + String(cont);

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

        let request: SaveFichaIndividual = 
        {   idObjeto: this.dataFirst.idFicha, 
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

        this.saveCRC$ = this._fichaIndividualService.saveCodigoReferenciaCatastral(request)
        .subscribe(result => {           

            if(result.success){
                let shDataFirst: SharedFirstData = {
                    idFicha: result.data.idObjeto,
                    codigoSector: this.dataFirst.codigoSector,
                    codigoManzana: this.dataFirst.codigoManzana
                }
                let data: SharedData<SharedFirstData> = { complete: true, data: shDataFirst }
                this.firstComplete.emit(data);
    
                setTimeout(() => {
                    this.dataFirst.idFicha = result.idObjeto;
                    this.progress = false;
                    this.btnNextDisabled = true;
                    this.Stepper.next();
                  }, 500); 
            }
            else{
                this.progress = false;
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                      confirmButton: 'btn btn-primary bg-cofopri'
                      
                    },
                    buttonsStyling: false
                  });
                  
                swalWithBootstrapButtons.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: result.message,
                    confirmButtonText: 'Cerrar'
                  });
                console.log(result.message);
            } 
        });
    }

    Popup(){
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-primary bg-cofopri',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          });
          
        swalWithBootstrapButtons.fire({
            icon: 'error',
            title: 'Oops...',
            confirmButtonText: 'Cerrar',
            text: 'Este es un nuevo mensaje de error ocurrido durante el registro de la ubicación catastral....'
          });
    }

    Popup2(){

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 4000
          })
    }

}
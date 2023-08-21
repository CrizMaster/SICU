import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CodeReferenceModalComponent } from '../1-code-reference-modal/code-reference-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FichaIndividualService } from '../../ficha-individual.service';

import { SaveFichaIndividual } from 'src/app/intranet/components/ficha-individual/models/saveFichaIndividual.model';
import { Subscription } from 'rxjs';
import { SharedData, SharedFirstData } from '../../models/sharedFirstData.model';
import { Title } from 'src/app/core/models/title.model';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { Via } from '../../models/via.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';


@Component({
    selector: 'app-code-reference',
    templateUrl: './code-reference.component.html',
    styleUrls: ['./code-reference.component.css']
})
export class CodeReferenceComponent implements OnInit, OnDestroy {

    @Output() firstComplete = new EventEmitter<SharedFirstData<ItemSelect<Via>[]>>();

    @Input() codRefCatastral: any[] = ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'];    
    @Input() Stepper: MatStepper;
    @Input() idFicha: number = 0;
    
    btnNextDisabled: boolean = true;
    dataFirst: any;
    //progress: boolean = false;
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

            let data: SharedFirstData<ItemSelect<Via>[]> = { complete: false, idFicha: this.idFicha }
            this.firstComplete.emit(data);            
          }            
        });        
    }

    goNext(){
        //this.progress = true;
        let dg = this.ModalMessage();

        let request: SaveFichaIndividual = 
        {   idObjeto: this.dataFirst.idFicha,
            usuarioCreacion: 'carevalo',
            terminalCreacion: '',
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

        this.saveCRC$ = this._fichaIndividualService.save1CodigoReferenciaCatastral(request)
        .subscribe(result => {

            dg.close();

            if(result.success){

                this.codRefCatastral[23] = result.data[0].controlDigit;

                let items: ItemSelect<Via>[] = [];
                if(result.data && result.data.length > 0){
                    
                    let info = result.data[0];

                    items.unshift({ value: 0, text: 'Seleccionar', data: { id: 0, codigoVia: 'Seleccione', nombreVia: '' }});

                    let con = 0;
                    if(info.listVias && info.listVias.length > 0){
                        info.listVias.forEach(item => {
                            con++;
                            items.push({
                                value: con,
                                text: item.nombreVia,
                                code: item.codigoEspecifico,
                                data: item
                            });
                        });
                    }

                    let resp: SharedFirstData<ItemSelect<Via>[]> = { 
                        complete: true, 
                        idFicha: info.idObjeto, 
                        habUrbana: {
                            codigoHabilitacion: info.codigoHabilitacion,
                            nombreHabilitacion: info.nombreHabilitacion,
                            sectorZonaEtapa: info.sectorZonaEtapa,
                            manzanaUrbana: info.manzanaUrbana
                        },
                        data: items 
                    }

                    this.firstComplete.emit(resp);

                    setTimeout(() => {
                        this.dataFirst.idFicha = result.idObjeto;
                        //this.progress = false;
                        this.btnNextDisabled = true;
                        this.Stepper.next();
                      }, 500);                     
                }
                else{
                    //this.progress = false;
                    let modal: Title = { 
                      Title: 'Opss...', 
                      Subtitle: 'No se puedo recuperar la información para continuar con el registro. Por favor contacte con el administrador del sistema.',
                      Icon: 'error' }
                    this.dialog.open(ModalMessageComponent, {
                        width: '500px',
                        enterAnimationDuration: '300ms',
                        exitAnimationDuration: '300ms',
                        disableClose: true,
                        data: modal
                    });
                }

            }
            else{
                //this.progress = false;
                let modal: Title = { 
                    Title: 'Opss...', 
                    Subtitle: result.message, 
                    Icon: 'error' 
                };
                this.dialog.open(ModalMessageComponent, {
                    width: '500px',
                    enterAnimationDuration: '300ms',
                    exitAnimationDuration: '300ms',
                    disableClose: true,
                    data: modal
                });
            } 
        });
    }

    ModalMessage(): any {     
      let modal: Title = { 
        Title: 'Registrando ficha catastral individual urbana...'}
      let dgRef = this.dialog.open(ModalLoadingComponent, {
          width: '400px',
          height: '95px',
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          disableClose: true,
          data: modal
      }); 

      return dgRef;
    }

    // Popup(){
    //     const swalWithBootstrapButtons = Swal.mixin({
    //         customClass: {
    //           confirmButton: 'btn btn-primary bg-cofopri',
    //           cancelButton: 'btn btn-danger'
    //         },
    //         buttonsStyling: false
    //       });
          
    //     swalWithBootstrapButtons.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         confirmButtonText: 'Cerrar',
    //         text: 'Este es un nuevo mensaje de error ocurrido durante el registro de la ubicación catastral....'
    //       });
    // }

    // Popup2(){

    //       Swal.fire({
    //         position: 'top-end',
    //         icon: 'success',
    //         title: 'Your work has been saved',
    //         showConfirmButton: false,
    //         timer: 4000
    //       })
    // }   

}
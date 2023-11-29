import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { ViasCaracterizacion } from 'src/app/intranet/components/formularios/models/vias.model';
import { OrdenTrabajoService } from 'src/app/intranet/components/formularios/orden-trabajo/orden-trabajo.service';
import { BienesComunesService } from '../../bienes-comunes.service';
import { UbicacionBCRequest } from 'src/app/intranet/components/formularios/models/ubicacionBCRequest';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { BienesComunesResponse } from 'src/app/intranet/components/formularios/models/bienesComunesResponse';

@Component({
    selector: 'app-ubicacion-bc',
    templateUrl: './ubicacion-bc.component.html',
    styleUrls: ['./ubicacion-bc.component.css']
})
export class UbicacionBcComponent implements OnInit, OnDestroy {

    form : FormGroup;

    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    listEntrada: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listCondicionNumerica: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listTipopuerta: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    
    public listEntrada$: Subscription = new Subscription;
    public saveUbi$: Subscription = new Subscription;
    public itemBC$: Subscription = new Subscription;
    
    codigoUnidadAdministrativa: number = 0;
    
    constructor(
        private route: Router,
        private _activatedRoute:ActivatedRoute,
        private _ordenTrabajoService: OrdenTrabajoService,
        private _bienesComunesService: BienesComunesService,
        private fb: FormBuilder,
        private changeDetector: ChangeDetectorRef,
        public subDialog: MatDialog
    ){

        this.itemBC$ = this._bienesComunesService.BienesComunes.subscribe({
            next:(Data:StatusResponse<BienesComunesResponse>) => {
                if(Data.data != undefined){
                    this.codigoUnidadAdministrativa = Data.data.codigoUnidadAdministrativa;
                }                 
            }
        }); 

        this.form = this.fb.group({
            entrada: [0, Validators.required],
            tipopuerta: [0, Validators.required],
            condicionnumerica: [0, Validators.required],
            nromunicipalbc: ['', Validators.required]
          });

        this.listTipopuerta = getFilterMasterCatalog(CatalogoMasterEnum.TipoPuerta);
        this.listCondicionNumerica = getFilterMasterCatalog(CatalogoMasterEnum.CondicionNumeracion);
    }

    ngOnInit(): void {
        this.listEntrada$ = this._ordenTrabajoService.listaVias.subscribe({
            next:(Data:ViasCaracterizacion[]) => {

                this.listEntrada = [{ value:0, text:'Seleccionar' }];
                Data.forEach(elem => {
                    if(elem.checkedAct){
                        this.listEntrada.push({
                            code: elem.codigoVia,
                            value: elem.codigoViaLote, 
                            text: elem.nombreVia + ' - ' + elem.nombreTipoPuerta + ' ' + ( elem.numeroMunicipal || '')
                        });
                    }                    
                });
            }
        });    
        
        this._bienesComunesService.ConsultaUbicacionBienesComunes(this.codigoUnidadAdministrativa)
        .subscribe(result => {

            if(result.success && result.data.length > 0){
                let ubicacion = result.data[0];

                this.form.patchValue({ 
                    entrada: this.getValue(ubicacion.codigoVia, this.listEntrada), 
                    tipopuerta: this.getValue(ubicacion.codigoTipoPuerta, this.listTipopuerta), 
                    condicionnumerica: this.getValue(ubicacion.codigoCondicion, this.listCondicionNumerica),
                    nromunicipalbc: ubicacion.numeroMunicipal
                  });                
            }
        });
    }

    ngOnDestroy(): void {
        this.listEntrada$.unsubscribe();
        this.saveUbi$.unsubscribe();
        this.itemBC$.unsubscribe();
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }    

    getCode(value: number, ds: any[]) {
        let code = '';
        ds.forEach(elem => {
            if(elem.value == value) code = elem.code;
        }); 
        return code;
    }

    getValue(code: string, ds: any[]){
        let id = 0;
        ds.forEach(item => {
          if(item.code == code) id = item.value;
        });
    
        return id;
    }    

    onChangeCondicionNumerica(cn: string){
        const numeroMunicipal = this.form.get('nromunicipalbc');        
        let idCondicion = parseInt(cn);
        if(idCondicion == 4){            
            numeroMunicipal.setValue('S/N');
            numeroMunicipal.disable();
        }
        else if(idCondicion == 5){
            numeroMunicipal.setValue('');
            numeroMunicipal.disable();
            numeroMunicipal.clearValidators();
        }
        else{
            numeroMunicipal.setValue('');
            numeroMunicipal.enable();
            numeroMunicipal.setValidators([Validators.required]);
        }
        numeroMunicipal.updateValueAndValidity();
        numeroMunicipal.markAsUntouched();         
    }

    limpiar(){}
    guardar(){
        let modal1: Title = { Title: '¿Está seguro de registrar la ubicación?' }
        
        const sdm = this.subDialog.open(ModalQuestionComponent, {
            width: '450px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal1
        });

        sdm.afterClosed().subscribe(resp => {
            if(resp){
              let dg = this.ModalLoading();

              let info = this.form.value;

              let ubicacionBC: UbicacionBCRequest = {
                usuarioCreacion: 'carevalo',
                terminalCreacion: '',
                usuarioModificacion: 'carevalo',
                terminalModificacion: '',
                codigoVia: this.getCode(info.entrada, this.listEntrada),
                codigoTipoPuerta: this.getCode(info.tipopuerta, this.listTipopuerta),
                codigoCondicion: this.getCode(info.condicionnumerica, this.listCondicionNumerica),
                numeroMunicipal: info.nromunicipalbc,
                codigoUnidadAdministrativa: this.codigoUnidadAdministrativa
              }
  
              this.saveUbi$ = this._bienesComunesService.GuardarUbicacionBienesComunes(ubicacionBC)
              .subscribe(result => {    
                setTimeout(() => {
                    dg.close();
                
                    if(result.success){ 
                        let modal: Title = { 
                            Title: 'Ubicación registrada', 
                            Subtitle: 'La ubicación se registró satisfactoriamente.', 
                            Icon: 'ok' 
                        }
                        const okModal = this.subDialog.open(ModalMessageComponent, {
                            width: '500px',
                            enterAnimationDuration: '300ms',
                            exitAnimationDuration: '300ms',
                            disableClose: true,
                            data: modal
                        });
                        okModal.afterClosed().subscribe(resp => {
                            //this.listarEdificaciones();
                        });
                    }
                    else{
                        let modal: Title = { 
                            Title: 'Opss...', 
                            Subtitle: result.message, 
                            Icon: 'error' }
    
                        this.subDialog.open(ModalMessageComponent, {
                                  width: '500px',
                                  enterAnimationDuration: '300ms',
                                  exitAnimationDuration: '300ms',
                                  disableClose: true,
                                  data: modal
                              });
                    }
                }, 500);
              });
            }            
        }); 
    }


    ModalLoading(): any {     
        let modal: Title = { 
          Title: 'Procesando su solicitud...'}
        let dgRef = this.subDialog.open(ModalLoadingComponent, {
            width: '400px',
            height: '95px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal
        }); 
  
        return dgRef;
    }     

}
import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { OrdenTrabajoService } from '../../../../../orden-trabajo.service';
import { Subscription } from 'rxjs';
import { ViasCaracterizacion } from 'src/app/intranet/components/formularios/models/vias.model';
import { UnidadAdministrativaRequest } from 'src/app/intranet/components/formularios/models/unidadAdministrativaRequest';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';

@Component({
    selector: 'app-editar-unidad-administrativa-modal',
    templateUrl: './editar-unidad-administrativa-modal.component.html',
    styleUrls: ['./editar-unidad-administrativa-modal.component.css']
})
export class EditarUnidadAdministrativaModalComponent implements OnInit, OnDestroy {

    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    form: FormGroup;

    resp:UnidadAdministrativaRequest = {};
    title:string = 'Generar Unidad Administrativa';

    public listaVias$: Subscription = new Subscription;

    listEntrada: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listTipointerior: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];

    constructor(
      public dialogHabEdif: MatDialogRef<EditarUnidadAdministrativaModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: UnidadAdministrativaResponse,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef,
      private _ordenTrabajoService: OrdenTrabajoService
    ){
        this.form = this.fb.group({
            entrada: [0, Validators.required],
            piso: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
            unidadadministrativa: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
            nrointerior: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
            tipointerior: [0, Validators.required],
        });

        this.listTipointerior = getFilterMasterCatalog(CatalogoMasterEnum.TipoInterior);
    }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnInit(): void {

        this.listaVias$ = this._ordenTrabajoService.listaVias.subscribe({
            next:(Data:ViasCaracterizacion[]) => {
                
                this.listEntrada = [{ value:0, text:'Seleccionar' }];
                Data.forEach(elem => {
                    if(elem.checkedAct){
                        this.listEntrada.push({
                            value: elem.codigoViaLote, 
                            text: elem.nombreVia + ' - ' + elem.nombreTipoPuerta + ' ' + ( elem.numeroMunicipal || '')
                        });
                    }                    
                });
            }
        });

        if(this.data.codigoUnidadAdministrativa == 0){    
            this.title = 'Generar Unidad Administrativa';
        }
        else{

            let identrada: number;
            this.listEntrada.forEach(el => {
                if(el.value == this.data.codigoViaLote) identrada = el.value;
            });
            let idti: number;
            this.listTipointerior.forEach(el => {
                if(el.code == this.data.codigoTipoInterior) idti = el.value;
            });

            this.form.patchValue({ 
                entrada: identrada,
                piso: this.data.numeroPiso,
                unidadadministrativa: this.data.numeroUnidadAdministrativa,
                nrointerior: this.data.numeroInterior,
                tipointerior: idti
            });

            this.title = 'Editar Unidad Administrativa';
        }
    }

    ngOnDestroy(): void {
        this.listaVias$.unsubscribe();
    }

    guardar(){
        let info = this.form.value;

        this.listTipointerior.forEach(tp => {
            if(tp.value == info.tipointerior) {
              this.resp.codigoTipoInterior = tp.code;
            }
        });

        this.resp.codigoUnidadAdministrativa = this.data.codigoUnidadAdministrativa;
        this.resp.codigoViaLote = info.entrada;
        this.resp.numeroPiso = info.piso;
        this.resp.numeroUnidadAdministrativa = info.unidadadministrativa;
        this.resp.numeroInterior = info.nrointerior;

        this.resp.usuarioCreacion = "carevalo";
        this.resp.terminalCreacion = "127.0.0.1";

        this.dialogHabEdif.close(this.resp);
    }

}
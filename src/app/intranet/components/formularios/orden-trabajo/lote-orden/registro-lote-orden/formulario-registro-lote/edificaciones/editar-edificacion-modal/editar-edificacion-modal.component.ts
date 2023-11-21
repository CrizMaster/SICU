import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef, Input  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { UbicacionPredial } from 'src/app/intranet/components/ficha-individual/models/ubicacionPredial.model';
import { EdificacionResponse } from 'src/app/intranet/components/formularios/models/edificacionResponse';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { EdificacionRequest } from 'src/app/intranet/components/formularios/models/edificacionRequest';

@Component({
    selector: 'app-editar-edificacion-modal',
    templateUrl: './editar-edificacion-modal.component.html',
    styleUrls: ['./editar-edificacion-modal.component.css']
})
export class EditarEdificacionModalComponent implements OnInit, OnDestroy {

    pattern1Digs = '^[1-9]|([1-9][0-9])$';

    form: FormGroup;

    resp:EdificacionRequest = { codigoEdificacion: 0 };

    listTipoedificacion: ItemSelect<number>[] = [];

    codigo: string = '';

    constructor(
      public dialogHabEdif: MatDialogRef<EditarEdificacionModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: EdificacionResponse,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){
        this.form = this.fb.group({
            tipoedificacion: [0, Validators.required],
            nombreedificacion: ['', Validators.required]
        });

        this.listTipoedificacion = getFilterMasterCatalog(CatalogoMasterEnum.TipoEdificacion);
    }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnInit(): void {

        this.codigo = this.data.codigoDepartamento + this.data.codigoProvincia + this.data.codigoDistrito
                        + this.data.codigoSector + this.data.codigoManzana + this.data.codigoLoteCaracterizacion + this.data.numeroEdificacion;

        if(this.data.codigoTipoEdificacion == null){
            console.log('nuevo');          
        }
        else{
            console.log(this.data);
            let idte: number;
            this.listTipoedificacion.forEach(el => {
                if(el.code == this.data.codigoTipoEdificacion) idte = el.value;
            });
            this.form.patchValue({ 
                tipoedificacion: idte,
                nombreedificacion: this.data.nombreEdificacion
            });
        }
    }

    ngOnDestroy(): void {
    }

    guardar(){
        let info = this.form.value;

        this.listTipoedificacion.forEach(tp => {
            if(tp.value == info.tipoedificacion) {
              this.resp.codigoTipoEdificacion = tp.code;
            }
        });

        this.resp.nombreEdificacion = info.nombreedificacion;
        this.resp.codigoEdificacion = this.data.codigoEdificacion;
        this.resp.usuarioCreacion = "carevalo";
        this.resp.terminalCreacion = "127.0.0.1";

        this.dialogHabEdif.close(this.resp);
    }

}
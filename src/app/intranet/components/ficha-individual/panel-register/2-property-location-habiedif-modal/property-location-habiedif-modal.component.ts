import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef, Input  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FichaIndividualService } from '../../ficha-individual.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { Via } from '../../models/via.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';  
import { UbicacionPredial } from '../../models/ubicacionPredial.model';

@Component({
    selector: 'app-property-location-habiedif-modal',
    templateUrl: './property-location-habiedif-modal.component.html',
    styleUrls: ['./property-location-habiedif-modal.component.css']
})
export class PropertyLocationHabiedifModalComponent implements OnInit, OnDestroy {

    pattern1Digs = '^[1-9]|([1-9][0-9])$';

    form: FormGroup;

    resp:UbicacionPredial = { id:0 };

    listCatalogoMaster: CatalogoMaster[] = [];
    listTipoedificacion: ItemSelect<number>[] = [];
    listTipointerior: ItemSelect<number>[] = [];

    constructor(
      public dialogHabEdif: MatDialogRef<PropertyLocationHabiedifModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: UbicacionPredial,
      private _fichaIndividualService: FichaIndividualService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){
        this.form = this.fb.group({
            tipoedificacion: [0],
            nombreedificacion: [''],
            tipointerior: [0],
            numerointerior: [''],
            lote: [''],                      
            sublote: ['']
        });

        this.listCatalogoMaster = _fichaIndividualService.getCatalogoMaster();
        this.listTipoedificacion = this.getList<number>(CatalogoMasterEnum.TipoEdificacion);
        this.listTipointerior = this.getList<number>(CatalogoMasterEnum.TipoInterior);
    }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnInit(): void {
        if(this.data.IdTipoEdificacion == 0){
            console.log('nuevo');          
        }
        else{
            this.form.patchValue({ 
                tipoedificacion: this.data.IdTipoEdificacion ? this.data.IdTipoEdificacion : 0,
                nombreedificacion: this.data.NombreEdificacion,
                tipointerior: this.data.IdTipoInterior ? this.data.IdTipoInterior : 0,
                numerointerior: this.data.NumeroInterior,
                lote: this.data.Lote,
                sublote: this.data.Sublote
            });
        }
    }

    ngOnDestroy(): void {
    }

    getList<T>(Grupo: string) : ItemSelect<T>[]{
        let list: ItemSelect<T>[] = [];

        this.listCatalogoMaster.forEach(item => {
            if(item.grupo == Grupo){
                list.push({
                    value: item.id,
                    text: item.nombre,
                    code: item.orden
                });
            };
        });

        list = list.sort((n1,n2) => {
            if (n1.text > n2.text) {
                return 1;
            }
            if (n1.text < n2.text) {
                return -1;
            }
            return 0;
        });

        list.unshift({ value: 0, text: 'Seleccionar'});

        return list;
    }

    guardar(){
        let info = this.form.value;

        this.listTipoedificacion.forEach(tp => {
            if(tp.value == info.tipoedificacion) {
              this.resp.IdTipoEdificacion = tp.value;
              this.resp.CodeTipoEdificacion = tp.code;
            }
        });

        this.listTipointerior.forEach(tp => {
          if(tp.value == info.tipointerior) {
            this.resp.IdTipoInterior = tp.value;
            this.resp.CodeTipoInterior = tp.code;
          }
        });

        this.resp.NombreEdificacion = info.nombreedificacion;
        this.resp.NumeroInterior = info.numerointerior;
        this.resp.Lote = info.lote;
        this.resp.Sublote = info.sublote;
        this.resp.id = this.resp.IdTipoEdificacion;

        //this.form.reset();
        console.log('respuesta modal');
        console.log(this.resp);
        this.dialogHabEdif.close(this.resp);
    }

}
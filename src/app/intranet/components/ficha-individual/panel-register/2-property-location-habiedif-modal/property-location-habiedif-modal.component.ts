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

    resp:UbicacionPredial = { id: 0 };

    listCatalogoMaster: CatalogoMaster[] = [];
    listTipointerior: ItemSelect<number>[] = [];

    constructor(
      public dialogRef: MatDialogRef<PropertyLocationHabiedifModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: UbicacionPredial,
      private _fichaIndividualService: FichaIndividualService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){
        this.form = this.fb.group({
            tipointerior: [0, Validators.required],
            numerointerior: ['', Validators.required],  
            lote: ['', Validators.required],                      
            sublote: ['', Validators.required]
        });

        this.listCatalogoMaster = _fichaIndividualService.getCatalogoMaster();
        this.listTipointerior = this.getList<number>(CatalogoMasterEnum.TipoInterior);          
    }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnInit(): void {      
    }

    ngOnDestroy(): void {
    //   this.listProv$.unsubscribe();
    //   this.listDist$.unsubscribe();
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

    onChangeSelTipointerior(newValueCodevia: string, sw: boolean){

    }

    guardar(){
        let info = this.form.value;

        this.listTipointerior.forEach(tp => {
          if(tp.value == info.tipointerior) {
            this.resp.IdTipoInterior = tp.value;
            this.resp.CodeTipoInterior = tp.code;
          }
        });

        this.resp.NumeroInterior = info.numerointerior;
        this.resp.Lote = info.lote;
        this.resp.Sublote = info.sublote;

        this.form.reset();
        this.dialogRef.close(this.resp);
    }

}
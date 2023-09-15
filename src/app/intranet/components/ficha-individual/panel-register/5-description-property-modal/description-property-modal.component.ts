import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef, Input  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FichaIndividualService } from '../../ficha-individual.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { DescriptionPredio } from '../../models/DescriptionProperty/descriptionProperty.model';

@Component({
    selector: 'app-description-property-modal',
    templateUrl: './description-property-modal.component.html',
    styleUrls: ['./description-property-modal.component.css']
})
export class DescriptionPropertyModalComponent implements OnInit, OnDestroy {

    pattern1Digs = '^[1-9]|([1-9][0-9])$';

    form: FormGroup;

    mDescPredio: DescriptionPredio = { IdClasificacionPredio: 0, CodeUso: ['','','','','',''] };
    resp: DescriptionPredio = { IdClasificacionPredio: 0, CodeUso: ['','','','','',''] };

    listCatalogoMaster: CatalogoMaster[] = [];
    listClasificacionPredio: ItemSelect<number>[] = [];
    listPredioCatastralEn: ItemSelect<number>[] = [];

    constructor(
      public dialogRef: MatDialogRef<DescriptionPropertyModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DescriptionPredio,
      private _fichaIndividualService: FichaIndividualService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){
        this.form = this.fb.group({
            clasificacionpredio: [0, Validators.required],
            prediocatastralen: [0, Validators.required],  
            codigouso: ['', Validators.required],                      
            descripcionuso: ['', Validators.required],
            areaterrenoverificada: ['', Validators.required]
        });

        this.listCatalogoMaster = _fichaIndividualService.getCatalogoMaster();
        this.listClasificacionPredio = this.getList<number>(CatalogoMasterEnum.ClasificacionPredio);
        this.listPredioCatastralEn = this.getList<number>(CatalogoMasterEnum.PrecioCatastradoEn);
    }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnInit(): void {
        if(this.data.IdClasificacionPredio == 0){
            console.log('nuevo');
        }
        else {
            this.form.patchValue({ 
                clasificacionpredio: this.data.IdClasificacionPredio, 
                prediocatastralen: this.data.IdPredioCatastralEn,
                codigouso: this.data.CodigoUso,
                descripcionuso: this.data.DescripcionUso,
                areaterrenoverificada: this.data.AreaTerrenoVerificada
              });
        }
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

    onChangeSelClasificacionPredio(newValue: string){
        let codigo = '';
        const prediocatastralen = this.form.get('prediocatastralen');
        //prediocatastralen.enable();

        this.listClasificacionPredio.forEach(item => {
            if(item.value == parseInt(newValue)){
                if(item.code=='04'){
                    this.listPredioCatastralEn.forEach(it => {
                        if(it.code == '07'){
                            this.form.patchValue({ prediocatastralen: it.value });
                            //prediocatastralen.disable();
                        };
                    });
                }
            };
        });

        // const nrodocidentidadconyuge = this.form.get('nrodocidentidadconyuge');
        // if(codigo == "01"){            
        //     this.form.patchValue({ nrodocidentidadconyuge: '' });
        //     nrodocidentidadconyuge.disable();
        //     nrodocidentidadconyuge.clearValidators();            
        //     //this.form.get('nrodocidentidad').updateValueAndValidity();
        // }
        // else{
        //     nrodocidentidadconyuge.addValidators(Validators.required);
        //     nrodocidentidadconyuge.enable();
        // }

        // nrodocidentidadconyuge.updateValueAndValidity();
    }

    guardar(){
        let info = this.form.value;

        this.listClasificacionPredio.forEach(cp => {
            if(cp.value == info.clasificacionpredio) {
              this.resp.IdClasificacionPredio = cp.value;
              this.resp.CodeClasificacionPredio = cp.code;
              this.resp.ClasificacionPredio = cp.text;
            }
          });
  
        this.listPredioCatastralEn.forEach(td => {
            if(td.value == info.prediocatastralen) {
                this.resp.IdPredioCatastralEn = td.value;
                this.resp.CodePredioCatastralEn = td.code;
                this.resp.PredioCatastralEn = td.text;
            }
        });       
            
        this.resp.CodigoUso = info.codigouso;
        this.resp.DescripcionUso = info.descripcionuso;
        this.resp.AreaTerrenoVerificada = info.areaterrenoverificada;

        this.form.reset();
        this.dialogRef.close(this.resp);
    }
}
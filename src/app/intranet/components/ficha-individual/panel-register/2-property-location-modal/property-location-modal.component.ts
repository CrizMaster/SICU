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
    selector: 'app-property-location-modal',
    templateUrl: './property-location-modal.component.html',
    styleUrls: ['./property-location-modal.component.css']
})
export class PropertyLocationModalComponent implements OnInit, OnDestroy {

    color:any = 'primary';
    dataFirst: UbicacionPredial;
    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    listCatalogoMaster: CatalogoMaster[] = [];

    listCodevia: ItemSelect<Via>[];
    //listaTipovia: ItemSelect<number>[] = [];
    listaTipopuerta: ItemSelect<number>[] = [];
    listaCondNumeracion: ItemSelect<number>[] = [];

    resp:UbicacionPredial = { id: 0 };

    readOnlyNroMuni: boolean = false;

    constructor(
      public dialogRef: MatDialogRef<PropertyLocationModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: UbicacionPredial,
      private _fichaIndividualService: FichaIndividualService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){
        this.form = this.fb.group({
            codigovia: ['0', Validators.required],
            tipovia: ['', Validators.required],
            nombrevia: ['', Validators.required],
            tipopuerta: ['0', Validators.required],                       
            nromunicipal: ['', Validators.required],
            condnumeracion: ['0', Validators.required]
        });

        this.listCatalogoMaster = _fichaIndividualService.getCatalogoMaster();
        
        //this.listaTipovia = this.getList<number>(CatalogoMasterEnum.TipoVia);
        this.listaTipopuerta = this.getList<number>(CatalogoMasterEnum.TipoPuerta);
        this.listaCondNumeracion = this.getList<number>(CatalogoMasterEnum.CondicionNumeracion);

        this.dataFirst = data;
        this.listCodevia = this.dataFirst.listaVias;
    }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnInit(): void {

        if(this.dataFirst.id == 0){
            console.log('nuevo');
        }
        else{
            this.listCodevia = this.dataFirst.listaVias;
            this.form.patchValue({ 
                codigovia: this.dataFirst.IdVia,
                tipovia: this.dataFirst.TipoVia,
                nombrevia: this.dataFirst.NombreVia,
                tipopuerta: this.dataFirst.IdTipoPuerta,
                nromunicipal: this.dataFirst.NroMunicipal,
                condnumeracion: this.dataFirst.IdCondNumeracion
            });

            let nromuni = this.form.get('nromunicipal');
            if(this.dataFirst.CodeCondNumeracion == "04" || this.dataFirst.CodeCondNumeracion == "05") this.readOnlyNroMuni = true;

            if(this.dataFirst.CodeCondNumeracion == "05") nromuni.clearValidators();

            nromuni.updateValueAndValidity();
            // setTimeout(() => {
            //     this.swSincodigo = this.dataFirst.swSinCodigo;

            //     if(this.swSincodigo){
            //         this.form.get('tipoviasel').setValidators([Validators.required, Validators.pattern(this.pattern1Digs)]);
            //         this.form.get('tipovia').clearValidators();
            //     }
            //     else{
            //         this.form.get('tipovia').setValidators([Validators.required]);
            //         this.form.get('tipoviasel').clearValidators();
            //     }
            //     this.form.get('tipoviasel').updateValueAndValidity();
            //     this.form.get('tipovia').updateValueAndValidity();
            //     this.form.get('codigovia').updateValueAndValidity();
            //   }, 500);

        }
    }

    getList<T>(Grupo: string) : ItemSelect<T>[]{
        let list: ItemSelect<T>[] = [{ value: 0, text: 'Seleccione' }];

        this.listCatalogoMaster.forEach(item => {
            if(item.grupo == Grupo){
                list.push({
                    value: item.id,
                    text: item.nombre,
                    code: item.orden
                });
            };
        });

        return list;
    }

    ngOnDestroy(): void {
    //   this.listProv$.unsubscribe();
    //   this.listDist$.unsubscribe();
    //   this.listSect$.unsubscribe();
    //   this.listManz$.unsubscribe();
    }


    // onChangeSelSinCode(event: MatSlideToggleChange){

    //     this.swSincodigo = event.checked;
    //     if(this.swSincodigo){
    //         this.form.get('tipoviasel').setValidators([Validators.required, Validators.pattern(this.pattern1Digs)]);
    //         this.form.get('tipovia').clearValidators();
    //     }
    //     else{
    //         this.form.get('tipovia').setValidators([Validators.required]);
    //         this.form.get('tipoviasel').clearValidators();
    //     }
    //     this.form.get('tipoviasel').updateValueAndValidity();
    //     this.form.get('tipovia').updateValueAndValidity();

    //     this.form.patchValue({ codigovia:0, tipoviasel: 0, nombrevia: '', tipovia: ''});
    //     this.form.markAsUntouched();
    // }

    onChangeSelCodevia(newValueCodevia: string, sw: boolean){
        this.listCodevia.forEach(cv => {
            if(cv.value == parseInt(newValueCodevia)){
                let info = cv.data;
                this.form.patchValue({
                    tipovia: info?.nombreEspecifico, 
                    nombrevia: info?.nombreVia });
            }
        });
    }

    onChangeSelCondNumeracion(newValueCondNum: string, sw: boolean){

        const nromuni = this.form.get('nromunicipal');
        nromuni.setValidators(Validators.required);
        this.readOnlyNroMuni = false;

        this.form.patchValue({ nromunicipal: '' });

        if(parseInt(newValueCondNum) == 4) { 
            this.form.patchValue({ nromunicipal: 'S/N' });
            this.readOnlyNroMuni = true;
        }        
        else if(parseInt(newValueCondNum) == 5) 
        {         
            nromuni.clearValidators();
            this.readOnlyNroMuni = true;
        }

        nromuni.updateValueAndValidity();
        this.form.markAsUntouched();        
    }

    guardar(){
        let info = this.form.value;

        this.listCodevia.forEach(cv => {
            if(cv.value == info.codigovia){
              let codeVia = cv.data.codigoVia.split('');
              this.resp.IdVia = cv.value;
              this.resp.CodeVia = cv.data.codigoVia;
              this.resp.CodeVia1 = codeVia[0];
              this.resp.CodeVia2 = codeVia[1];
              this.resp.CodeVia3 = codeVia[2];
              this.resp.CodeVia4 = codeVia[3];
              this.resp.CodeVia5 = codeVia[4];
              this.resp.CodeVia6 = codeVia[5];

              this.resp.CodeTipoVia = cv.data.codigoEspecifico;
              this.resp.TipoVia = cv.data.nombreEspecifico;
              this.resp.NombreVia = cv.data.nombreVia;
            }
          });        

        this.listaTipopuerta.forEach(tp => {
          if(tp.value == info.tipopuerta) {
            this.resp.TipoPuerta = tp.text;
            this.resp.CodeTipoPuerta = tp.code;
            this.resp.IdTipoPuerta = tp.value;
          }
        });
  
        this.listaCondNumeracion.forEach(cn => {
          if(cn.value == info.condnumeracion){
            this.resp.CodeCondNumeracion = cn.code;
            this.resp.CondNumeracion = cn.text;
            this.resp.IdCondNumeracion = cn.value;
          }
        });

        this.resp.NroMunicipal = info.nromunicipal;

        this.resp.id = this.dataFirst.id;
        this.resp.listaVias = this.dataFirst.listaVias;

        this.form.reset();
        this.dialogRef.close(this.resp);
    }

}
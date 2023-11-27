import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef, Input  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { Subscription } from 'rxjs';
import { ConstruccionResponse, ConstruccionesRequest } from 'src/app/intranet/components/formularios/models/construccionesRequest';
import { ConstruccionModalComponent } from '../../../unidad-administrativa/vincular/construccion-modal/construccion-modal.component';
import { UnidadAdministrativaService } from '../../../unidad-administrativa/unidad-administrativa.service';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
    selector: 'app-construccion-bc-modal',
    templateUrl: './construccion-bc-modal.component.html',
    styleUrls: ['./construccion-bc-modal.component.css'],
    providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ]
})
export class ConstruccionBcModalComponent implements OnInit, OnDestroy {

    maxDate: Date;

    pattern1Digs = '^[1-9]|([1-9][0-9])$';

    form: FormGroup;

    conConyuge: boolean = false;
    natural: boolean = true;

    //resp:Owner = { Titular: { IdEstadoCivil: 0, DocIdentidad: ['','','','','','','','','',''] }, Conyuge: { DocIdentidad: ['','','','','','','','','',''] }};
    public listCatValUnit$: Subscription = new Subscription;

    listaMEP: ItemSelect<number>[] = [];
    listaECS: ItemSelect<number>[] = [];
    listaECC: ItemSelect<number>[] = [];
    listaUCA: ItemSelect<number>[] = [];
    listaPuertasVentanas: ItemSelect<number>[] = [];
    listaMurosColumnas: ItemSelect<number>[] = [];
    listaTecho: ItemSelect<number>[] = [];
        

    constructor(
      public dialogRef: MatDialogRef<ConstruccionBcModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: ConstruccionResponse,
      private _unidadAdministrativaService: UnidadAdministrativaService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){
        this.form = this.fb.group({
            nro: [{ value: '', disabled: true }],
            ecc: [0, Validators.required],
            puertasventanas: [0, Validators.required],
            mesanio: ['', Validators.required],
            piso: ['', [Validators.required, Validators.pattern('[0-9]+')]],
            ecs: [0, Validators.required],  
            muroscolumnas: [0, Validators.required],
            //ciiu: ['', [Validators.required, Validators.pattern('[0-9]+')]],
            mep: [0, Validators.required],
            techo: [0, Validators.required],
            uca: [0, Validators.required],
            areaverificada: ['', [Validators.required, Validators.pattern('[0-9]+([\.,][0-9]+\d{0,2})?')]]
        });

        this.listaMEP = getFilterMasterCatalog(CatalogoMasterEnum.MaterialEstructuralPredominante);
        this.listaECS = getFilterMasterCatalog(CatalogoMasterEnum.EstadoConservacion);
        this.listaECC = getFilterMasterCatalog(CatalogoMasterEnum.EstadoConstruccion);
        this.listaUCA = getFilterMasterCatalog(CatalogoMasterEnum.UbicacionContruccAntirreglamentario);
    }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnInit(): void {

        this.listCatValUnit$ = this._unidadAdministrativaService.ConsultaCategoriaConstrucciones()
        .subscribe(result => {
  
          let lista: ItemSelect<number>[] = [];
          if(result.success){
            let con = 0;
              
            result.data.forEach(item => {
              con++;
              lista.push({
                value: con,
                code: item.codigoCategoria,
                text: item.nombreCategoria
              })
            });
          }
          lista.unshift({ value: 0, code: 'Seleccionar', text: 'Seleccionar' });
  
          this.listaPuertasVentanas = lista;
          this.listaMurosColumnas = lista;
          this.listaTecho = lista;

          if(this.data.codigoConstruccion != 0){
            this.getCargarData();
          }
        });
    }

    getCargarData(){

      let mom = moment('');
      if(this.data.mesAnioConstruccion){
        let fec = this.data.mesAnioConstruccion;
        mom = moment(fec);
      }

      this.form.patchValue({ 
        nro: this.data.nro,
        mesanio: mom,
        ecc: this.getValue(this.data.codigoEstadoConstruccion, this.listaECC),
        puertasventanas: this.getValue(this.data.categoriaPuertaVentana, this.listaPuertasVentanas),
        piso: this.data.numeroPiso,
        areaverificada: this.data.areaVerificada,
        ecs: this.getValue(this.data.codigoEstadoConservacion, this.listaECS),
        muroscolumnas: this.getValue(this.data.categoriaMuroColumna, this.listaMurosColumnas),
        //ciiu: this.data.codigoCiiu,
        mep: this.getValue(this.data.codigoMaterialPredominante, this.listaMEP),
        techo: this.getValue(this.data.categoriaTecho, this.listaTecho),
        uca: this.getValue(this.data.codigoUca, this.listaUCA),
      });
    }

    ngOnDestroy(): void {
        this.listCatValUnit$.unsubscribe();
    }

    getValue(code: string, lista: ItemSelect<number>[]){
      let id = 0;
      lista.forEach(item => {
        if(item.code == code) id = item.value;
      });
  
      return id;
    }

    agregar(){
        let info = this.form.value;

        let constr: ConstruccionResponse = {
          codigoConstruccion: this.data.codigoConstruccion
        };

        this.listaECC.forEach(ec => {
          if(ec.value == info.ecc) {
            constr.codigoEstadoConstruccion = ec.code;
          }
        });

        this.listaPuertasVentanas.forEach(ec => {
          if(ec.value == info.puertasventanas) {
            constr.categoriaPuertaVentana = ec.code;
          }
        });

        const ctrlValue = info.mesanio.toDate();
        constr.mesAnioConstruccion = ctrlValue;

        constr.numeroPiso = info.piso;
        constr.areaVerificada = info.areaverificada;

        this.listaECS.forEach(ec => {
          if(ec.value == info.ecs) {
            constr.codigoEstadoConservacion = ec.code;
          }
        });

        this.listaMurosColumnas.forEach(ec => {
          if(ec.value == info.muroscolumnas) {
            constr.categoriaMuroColumna = ec.code;
          }
        });

        //constr.codigoCiiu = info.ciiu;

        this.listaMEP.forEach(ec => {
          if(ec.value == info.mep) {
            constr.codigoMaterialPredominante = ec.code;
          }
        });

        this.listaTecho.forEach(ec => {
          if(ec.value == info.techo) {
            constr.categoriaTecho = ec.code;
          }
        });

        this.listaUCA.forEach(ec => {
          if(ec.value == info.uca) {
            constr.codigoUca = ec.code;
          }
        });        

        this.form.reset();
        this.dialogRef.close({ success: true, datos: constr });
    }

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {

      this.form.patchValue({ mesanio: normalizedMonthAndYear });
  
      datepicker.close();
    }

}
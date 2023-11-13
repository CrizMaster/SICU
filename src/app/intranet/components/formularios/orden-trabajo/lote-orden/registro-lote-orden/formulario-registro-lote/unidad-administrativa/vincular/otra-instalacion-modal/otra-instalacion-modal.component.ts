import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef, Input  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { FichaIndividualService } from 'src/app/intranet/components/ficha-individual/ficha-individual.service';
import { Owner } from 'src/app/intranet/components/ficha-individual/models/IdentityOwner/owner.model';
import { PersonaModel } from 'src/app/intranet/components/formularios/models/personaModel';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { Observable, map, startWith } from 'rxjs';
import { ObrasComplementariasResponse } from 'src/app/intranet/components/formularios/models/obrasComplementariasRequest';
import { UnidadAdministrativaService } from '../../unidad-administrativa.service';
import { ObraModel } from 'src/app/intranet/components/formularios/models/obraModel';

const moment = _rollupMoment || _moment;

// export interface Obra {
//   id?: number,
//   name: string;
//   obras?: Obra[];
// }

export const _filter = (opt: ObraModel[], value: string): ObraModel[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.descripcionObra.toLowerCase().includes(filterValue));
};

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
    selector: 'app-otra-instalacion-modal',
    templateUrl: './otra-instalacion-modal.component.html',
    styleUrls: ['./otra-instalacion-modal.component.css'],
    providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ]
})
export class OtraInstalacionModalComponent implements OnInit, OnDestroy {

    maxDate: Date;

    pattern1Digs = '^[1-9]|([1-9][0-9])$';

    form: FormGroup;

    stateGroups: ObraModel[] = [];
      // {
      //   id: 1,
      //   name: 'Cajas de Registro de Concreto',
      //   obras: [
      //     {id: 2, name : 'Caja de registro de concreto de 24”x24”'}, 
      //     {id: 3, name : 'Caja de registro de concreto de 12”x24”'}, 
      //     {id: 4, name : 'Caja de registro de concreto de 10”x20”'}],
      // },
      // {
      //   id: 5,
      //   name: 'Piscinas, espejos de agua',
      //   obras: [
      //     { id: 6, name : 'Piscina, Espejo de agua concreto armado con mayolica con capacidad hasta 5.00 m3.'}, 
      //     { id: 6, name : 'Piscina, Espejo de agua concreto armado con mayolica con capacidad hasta 10.00 m3.'}, 
      //     { id: 6, name : 'Piscina, Espejo de agua concreto armado con mayolica con capacidad mayores a 10.00 m3.'}, 
      //     { id: 6, name : 'Piscina de ladrillo kk con pintura.'}],
      // }];

    obraComp: ObrasComplementariasResponse = { codigoOtrasInstalaciones: 0 }

    stateGroupOptions: Observable<ObraModel[]>;

    listaMEP: ItemSelect<number>[] = [];
    listaECS: ItemSelect<number>[] = [];
    listaECC: ItemSelect<number>[] = [];
    listaUCA: ItemSelect<number>[] = [];
    listaUnidadMedida: ItemSelect<number>[] = [];
        

    constructor(
      public dialogRef: MatDialogRef<OtraInstalacionModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: ObrasComplementariasResponse,
      private _UnidadAdministrativaService: UnidadAdministrativaService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){
        this.form = this.fb.group({
            nro: [{ value: '', disabled: true }],
            ecc: [0, Validators.required],
            unidadmedida: [0, Validators.required],
            mesanio: ['', Validators.required],
            ecs: [0, Validators.required],
            mep: [0, Validators.required],
            uca: [0, Validators.required],
            productototal: ['', [Validators.required, Validators.pattern('[0-9]+([\.,][0-9]+\d{0,2})?')]],
            grupoobrainstalacion: ['', Validators.required]
        });

        this.listaMEP = getFilterMasterCatalog(CatalogoMasterEnum.MaterialEstructuralPredominante);
        this.listaECS = getFilterMasterCatalog(CatalogoMasterEnum.EstadoConservacion);
        this.listaECC = getFilterMasterCatalog(CatalogoMasterEnum.EstadoConstruccion);
        this.listaUCA = getFilterMasterCatalog(CatalogoMasterEnum.UbicacionContruccAntirreglamentario);
        this.listaUnidadMedida = getFilterMasterCatalog(CatalogoMasterEnum.UnidadMedida);        

        this.obraComp.codigoOtrasInstalaciones = this.data.codigoOtrasInstalaciones

        //this.listUA$ = 
        this._UnidadAdministrativaService.ListarObrasComplementarias()
        .subscribe(data => {
          if(data.success){
            this.stateGroups = data.data;
          }
        });
    }

    

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnInit(): void { 

      this.stateGroupOptions = this.form.get('grupoobrainstalacion')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterGroup(value || '')),
      );

      if(this.data.codigoOtrasInstalaciones != 0){
        this.getCargarData();
      }      
    }

    getCargarData(){

      let mom = moment('');
      if(this.data.mesAnioConstruccion){
        let fec = this.data.mesAnioConstruccion;
        mom = moment(fec);
      }

/*
            nro: [{ value: '', disabled: true }],
            ecc: [0, Validators.required],
            unidadmedida: [0, Validators.required],
            mesanio: ['', Validators.required],
            ecs: [0, Validators.required],
            mep: [0, Validators.required],
            uca: [0, Validators.required],
            productototal: ['', [Validators.required, Validators.pattern('[0-9]+([\.,][0-9]+\d{0,2})?')]],
            grupoobrainstalacion: ['', Validators.required]
*/

      this.form.patchValue({ 
        nro: this.data.nro,
        mesanio: mom,
        ecc: this.getValue(this.data.codigoEstadoConstruccion, this.listaECC),
        unidadmedida: this.getValue(this.data.codigoUnidadMedida, this.listaUnidadMedida),
        productototal: this.data.productoTotal,
        ecs: this.getValue(this.data.codigoEstadoConservacion, this.listaECS),
        mep: this.getValue(this.data.codigoMaterialPredominante, this.listaMEP),
        uca: this.getValue(this.data.codigoUca, this.listaUCA),
        grupoobrainstalacion: this.data.descripcionObra
      });

      this.obraComp.codigoObra = this.data.codigoObra;
      this.obraComp.descripcionObra = this.data.descripcionObra;
    }

    getValue(code: string, lista: ItemSelect<number>[]){
      let id = 0;
      lista.forEach(item => {
        if(item.code == code) id = item.value;
      });
  
      return id;
    }

    private _filterGroup(value: string): ObraModel[] {
      if (value) {
        return this.stateGroups
          .map(group => ({descripcionObra: group.descripcionObra, obras: _filter(group.obras, value)}))
          .filter(group => group.obras.length > 0);
      }
  
      return this.stateGroups;
    }    

    getIdGrupoObra(event, data) {
      if(event.isUserInput) {
        this.obraComp.codigoObra = data.codigoObra;
        this.obraComp.descripcionObra = data.descripcionObra;
      }
    }

    ngOnDestroy(): void {
    }

    agregar(){
      let info = this.form.value;

      this.listaECC.forEach(ec => {
        if(ec.value == info.ecc) {
          this.obraComp.codigoEstadoConstruccion = ec.code;
        }
      });

      this.listaUnidadMedida.forEach(ec => {
        if(ec.value == info.unidadmedida) {
          this.obraComp.codigoUnidadMedida = ec.code;
          this.obraComp.nombreEspecifico = ec.text;
        }
      });

      const ctrlValue = info.mesanio.toDate();
      this.obraComp.mesAnioConstruccion = ctrlValue;

      this.obraComp.numeroPiso = info.piso;
      this.obraComp.productoTotal = info.productototal;

      this.listaECS.forEach(ec => {
        if(ec.value == info.ecs) {
          this.obraComp.codigoEstadoConservacion = ec.code;
        }
      });

      this.listaMEP.forEach(ec => {
        if(ec.value == info.mep) {
          this.obraComp.codigoMaterialPredominante = ec.code;
        }
      });

      this.listaUCA.forEach(ec => {
        if(ec.value == info.uca) {
          this.obraComp.codigoUca = ec.code;
        }
      });
      

      this.form.reset();
      this.dialogRef.close({ success: true, datos: this.obraComp });
    }

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {

        this.form.patchValue({ mesanio: normalizedMonthAndYear });
  
        datepicker.close();
    }

}
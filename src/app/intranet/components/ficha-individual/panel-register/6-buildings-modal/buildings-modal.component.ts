import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FichaIndividualService } from '../../ficha-individual.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { BuildingsRequest } from '../../models/Buildings/buildings-request.model';

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
    selector: 'app-buildings-modal',
    templateUrl: './buildings-modal.component.html',
    styleUrls: ['./buildings-modal.component.css'],
    providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ]
})
export class BuildingsModalComponent implements OnInit, OnDestroy {

    maxDate: Date;
    //dataFirst: any;
    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$';

    datos: BuildingsRequest = { idObjeto: 0 };

    listCatalogoMaster: CatalogoMaster[] = [];
    listaMEP: ItemSelect<number>[] = [];
    listaECS: ItemSelect<number>[] = [];
    listaECC: ItemSelect<number>[] = [];
    listaUCA: ItemSelect<number>[] = [];
    
    listaCatMurosColumnas: ItemSelect<number>[] = [];
    listaCatTechos: ItemSelect<number>[] = [];
    listaCatPuertasVentanas: ItemSelect<number>[] = [];

    public listaCategoriaValUnit$: Observable<ItemSelect<number>[]> = new Observable;

    // provincias: Ubigeo[] = [{ id: 0, ubigeo: '000000', nombreProvincia: 'Seleccionar', ubigeoProvincia: '00' }];
    // distritos: Ubigeo[] = [{ id: 0, ubigeo: '000000', nombreDistrito: 'Seleccionar', ubigeoDistrito: '00' }];
    // sectores: Sector[] = [{ idSector:0 , codigoSector: 'Seleccionar'}];
    // manzanas: Manzana[] = [{ idManzana:0 , codigoManzana: 'Seleccionar'}];     

    public listCatValUnit$: Subscription = new Subscription;
    // public listDist$: Subscription = new Subscription;
    // public listSect$: Subscription = new Subscription;
    // public listManz$: Subscription = new Subscription;

    constructor(
      public dialogRef: MatDialogRef<BuildingsModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _fichaIndividualService: FichaIndividualService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef,
      private adapter: DateAdapter<any>
    ){

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      this.maxDate = new Date(currentYear, currentMonth, 1);

      let m = moment('');
      
      this.form = this.fb.group({
        pisosotano: ['', [Validators.required, Validators.pattern('[0-9]+')]],
        mesanio: [m, Validators.required],
        mep: [0, Validators.required],
        ecs: [0, Validators.required],
        ecc: [0, Validators.required],
        muroscolumnas: [0, Validators.required],
        techos: [0, Validators.required],
        puertasventanas: [0, Validators.required],
        areaverificada: ['', [Validators.required, Validators.pattern('[0-9]+([\.,][0-9]+\d{0,2})?')]],
        ciiu: ['', [Validators.required, Validators.pattern('[0-9]+')]],
        uca: [0, Validators.required]
        // lote: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
        // edifica: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        // entrada: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        // piso: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        // unidad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
      });

      this.listCatalogoMaster = _fichaIndividualService.getCatalogoMaster();
      this.listaMEP = this.getList<number>(CatalogoMasterEnum.MaterialEstructuralPredominante);
      this.listaECS = this.getList<number>(CatalogoMasterEnum.EstadoConservacion);
      this.listaECC = this.getList<number>(CatalogoMasterEnum.EstadoConstruccion);
      this.listaUCA = this.getList<number>(CatalogoMasterEnum.UbicacionContruccAntirreglamentario);
    
    }
    
    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
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

    ngOnDestroy(): void {
      this.listCatValUnit$.unsubscribe();
    }

    ngOnInit(): void {
      this.adapter.setLocale(moment.locale('es-PE'));

      this.listCatValUnit$ = this._fichaIndividualService.listarCategoriaValoresUnitarios()
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

        this.listaCatMurosColumnas = lista;
        this.listaCatTechos = lista;
        this.listaCatPuertasVentanas = lista;
      });

      if(this.data.id == 0){
        console.log('Nuevo registro');
      }
      else{

        let mom = moment('');
        if(this.data.c44FechaConstruccion){
          let fec = this.data.c44FechaConstruccion;
          mom = moment(fec);
        }

        this.form.patchValue({ 
          pisosotano: this.data.c43PisoSotano,
          mesanio: mom,
          mep: this.data.c45IdMep,
          ecs: this.data.c46IdEcs,
          ecc: this.data.c47IdEcc,
          muroscolumnas: this.data.c48IdMurosColumna,
          techos: this.data.c49IdTecho,
          puertasventanas: this.data.c50IdPuertasVentanas,
          areaverificada: this.data.c51AreaVerificada,
          ciiu: this.data.c52ActividadEconomica,
          uca: this.data.c53IdUca
        });
      }
    }

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
      // const ctrlValue = this.date.value!;
      // ctrlValue.month(normalizedMonthAndYear.month());
      // ctrlValue.year(normalizedMonthAndYear.year());
      // this.date.setValue(ctrlValue);

      this.form.patchValue({ mesanio: normalizedMonthAndYear });

      // let info = this.form.value;
      // const ctrlValue = info.mesanio.toDate();
      // console.log(ctrlValue.getMonth() + 1);
      // console.log(ctrlValue.getFullYear());

      // console.log('desde aqui');
      // console.log(this.form.get('mesanio'));

      datepicker.close();
    }

    guardar(){
      let info = this.form.value;

      this.datos.id = this.data.id;
      this.datos.usuarioCreacion = 'carevalo';
      this.datos.terminalCreacion = '';
      this.datos.c43PisoSotano = info.pisosotano;

      const ctrlValue = info.mesanio.toDate();
      this.datos.c44FechaConstruccion = ctrlValue;
      let mes = ctrlValue.getMonth() + 1;      
      if(mes < 10) this.datos.c44FechaMes = '0' + mes;
      else this.datos.c44FechaMes = '0' + String(mes);

      let anio = ctrlValue.getFullYear();
      this.datos.c44FechaAnio = String(anio);

      this.listaMEP.forEach(mep => {
        if(mep.value == info.mep) { 
          this.datos.c45Mep = mep.code;
          this.datos.c45IdMep = mep.value;
        }
      });

      this.listaECS.forEach(ecs => {
        if(ecs.value == info.ecs) { 
          this.datos.c46Ecs = ecs.code;
          this.datos.c46IdEcs = ecs.value;
        }
      });

      this.listaECC.forEach(ecc => {
        if(ecc.value == info.ecc) { 
          this.datos.c47Ecc = ecc.code;
          this.datos.c47IdEcc = ecc.value;
        }
      });

      this.listaCatMurosColumnas.forEach(mc => {
        if(mc.value == info.muroscolumnas) { 
          this.datos.c48MurosColumna = mc.text;
          this.datos.c48IdMurosColumna = mc.value;
        }
      });

      this.listaCatTechos.forEach(t => {
        if(t.value == info.techos) { 
          this.datos.c49Techo = t.text;
          this.datos.c49IdTecho = t.value;
        }
      });

      this.listaCatPuertasVentanas.forEach(pv => {
        if(pv.value == info.puertasventanas) { 
          this.datos.c50PuertasVentanas = pv.text;
          this.datos.c50IdPuertasVentanas = pv.value;
        }
      });

      this.datos.c51AreaVerificada = info.areaverificada;
      this.datos.c52ActividadEconomica = info.ciiu;
      this.datos.c52CIIU = info.ciiu.split('');

      this.listaUCA.forEach(uca => {
        if(uca.value == info.uca) { 
          this.datos.c53Uca = uca.code;
          this.datos.c53IdUca = uca.value;
        }
      });
      
      this.dialogRef.close(this.datos);
    }
}
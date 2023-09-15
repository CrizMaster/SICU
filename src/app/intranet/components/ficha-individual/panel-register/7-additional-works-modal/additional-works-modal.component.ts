import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FichaIndividualService } from '../../ficha-individual.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith, Subscription } from 'rxjs';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { AdditionalWorksRequest } from '../../models/AdditionalWorks/additions-works-request.model';

const moment = _rollupMoment || _moment;

export interface Obra {
  id?: number,
  name: string;
  obras?: Obra[];
}

// export const _filter = (opt: string[], value: string): string[] => {
//   const filterValue = value.toLowerCase();

//   return opt.filter(item => item.toLowerCase().includes(filterValue));
// };

export const _filter = (opt: Obra[], value: string): Obra[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.name.toLowerCase().includes(filterValue));
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
    selector: 'app-additional-works-modal',
    templateUrl: './additional-works-modal.component.html',
    styleUrls: ['./additional-works-modal.component.css'],
    providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ]
})
export class AdditionalWorksModalComponent implements OnInit, OnDestroy {

  stateGroups: Obra[] = [
    {
      id: 1,
      name: 'Cajas de Registro de Concreto',
      obras: [
        {id: 2, name : 'Caja de registro de concreto de 24”x24”'}, 
        {id: 3, name : 'Caja de registro de concreto de 12”x24”'}, 
        {id: 4, name : 'Caja de registro de concreto de 10”x20”'}],
    },
    {
      id: 5,
      name: 'Piscinas, espejos de agua',
      obras: [
        { id: 6, name : 'Piscina, Espejo de agua concreto armado con mayolica con capacidad hasta 5.00 m3.'}, 
        { id: 6, name : 'Piscina, Espejo de agua concreto armado con mayolica con capacidad hasta 10.00 m3.'}, 
        { id: 6, name : 'Piscina, Espejo de agua concreto armado con mayolica con capacidad mayores a 10.00 m3.'}, 
        { id: 6, name : 'Piscina de ladrillo kk con pintura.'}],
    }];

    stateGroupOptions: Observable<Obra[]>;

    maxDate: Date;
    //dataFirst: any;
    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$';

    datos: AdditionalWorksRequest = { idObjeto: 0 };

    listCatalogoMaster: CatalogoMaster[] = [];
    listaMEP: ItemSelect<number>[] = [];
    listaECS: ItemSelect<number>[] = [];
    listaECC: ItemSelect<number>[] = [];
    listaUCA: ItemSelect<number>[] = [];
    listaUnidadMedida: ItemSelect<number>[] = [{ value: 0, text: 'Seleccione'},
    { value: 1, text: 'm'},
    { value: 2, text: 'm²'},
    { value: 3, text: 'm³'},
    { value: 4, text: 'UND'}];
    
    // listaCatMurosColumnas: ItemSelect<number>[] = [];
    // listaCatTechos: ItemSelect<number>[] = [];
    // listaCatPuertasVentanas: ItemSelect<number>[] = [];

    listGrupoObraInstalacion: ItemSelect<number>[] = [];
    listObraInstalacion: ItemSelect<number>[] = [];

    // options: User[] = [{name: 'Mary', value: 1}, {name: 'Shelley', value: 2}, {name: 'Igor', value: 3}];
    // filteredOptions: Observable<User[]>;

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
      public dialogRef: MatDialogRef<AdditionalWorksModalComponent>,
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
        grupoobrainstalacion: ['', Validators.required],
        mesanio: [m, Validators.required],
        mep: [0, Validators.required],
        ecs: [0, Validators.required],
        ecc: [0, Validators.required],        
        productototal: ['', [Validators.required, Validators.pattern('[0-9]+([\.,][0-9]+\d{0,2})?')]],
        unidadmedida: [0, Validators.required],
        uca: [0, Validators.required]
      });

      this.listCatalogoMaster = _fichaIndividualService.getCatalogoMaster();
      this.listaMEP = this.getList<number>(CatalogoMasterEnum.MaterialEstructuralPredominante);
      this.listaECS = this.getList<number>(CatalogoMasterEnum.EstadoConservacion);
      this.listaECC = this.getList<number>(CatalogoMasterEnum.EstadoConstruccion);
      this.listaUCA = this.getList<number>(CatalogoMasterEnum.UbicacionContruccAntirreglamentario);
    
    }
    
    // displayFn(user: User): string {
    //   return user && user.name ? user.name : '';
    // }

    // private _filter(name: string): User[] {
    //   const filterValue = name.toLowerCase();
  
    //   return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
    // }

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

    // getHeroes(): Observable<User[]> {
    //   return of(this.options.slice());
    // }

    ngOnInit(): void {
      this.adapter.setLocale(moment.locale('es-PE'));

      //this.filteredOptions = this.getHeroes();

      // this.listCatValUnit$ = this._fichaIndividualService.listarCategoriaValoresUnitarios()
      // .subscribe(result => {

      //   let lista: ItemSelect<number>[] = [];
      //   if(result.success){
      //     let con = 0;
            
      //     result.data.forEach(item => {
      //       con++;
      //       lista.push({
      //         value: con,
      //         code: item.codigoCategoria,
      //         text: item.nombreCategoria
      //       })
      //     });
      //   }
      //   lista.unshift({ value: 0, code: 'Seleccionar', text: 'Seleccionar' });

      //   this.listaCatMurosColumnas = lista;
      //   this.listaCatTechos = lista;
      //   this.listaCatPuertasVentanas = lista;
      // });

      if(this.data.idObjeto == 0){
        console.log('Nuevo registro');
      }
      else{

        let mom = moment('');
        if(this.data.c57FechaConstruccion){
          let fec = this.data.c57FechaConstruccion;
          mom = moment(fec);
        }

        this.form.patchValue({
          grupoobrainstalacion: this.data.c56Descripcion,
          mesanio: mom,
          mep: this.data.c58IdMep,
          ecs: this.data.c59IdEcs,
          ecc: this.data.c60IdEcc,
          productototal: this.data.c61ProductoTotal,
          unidadmedida: this.data.c62IdUnidadMedida,
          uca: this.data.c63IdUca
        });
      }

      this.stateGroupOptions = this.form.get('grupoobrainstalacion')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterGroup(value || '')),
      );

      this.datos.c55Codigo = this.data.c55Codigo;
    }

    private _filterGroup(value: string): Obra[] {
      if (value) {
        return this.stateGroups
          .map(group => ({name: group.name, obras: _filter(group.obras, value)}))
          .filter(group => group.obras.length > 0);
      }
  
      return this.stateGroups;
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

    getIdGrupoObra(event, data) {
      if(event.isUserInput) {
        this.datos.c55Codigo = String(data.id);
      }
    }

    guardar(){
      let info = this.form.value;

      this.datos.idObjeto = 1;
      this.datos.id = this.data.id;
      this.datos.usuarioCreacion = 'carevalo';
      this.datos.terminalCreacion = '';
      
      this.datos.c56Descripcion = info.grupoobrainstalacion;

      const ctrlValue = info.mesanio.toDate();
      this.datos.c57FechaConstruccion = ctrlValue;
      let mes = ctrlValue.getMonth() + 1;      
      if(mes < 10) this.datos.c57FechaMes = '0' + mes;
      else this.datos.c57FechaMes = '0' + String(mes);

      let anio = ctrlValue.getFullYear();
      this.datos.c57FechaAnio = String(anio);

      this.listaMEP.forEach(mep => {
        if(mep.value == info.mep) { 
          this.datos.c58Mep = mep.code;
          this.datos.c58IdMep = mep.value;
        }
      });

      this.listaECS.forEach(ecs => {
        if(ecs.value == info.ecs) { 
          this.datos.c59Ecs = ecs.code;
          this.datos.c59IdEcs = ecs.value;
        }
      });

      this.listaECC.forEach(ecc => {
        if(ecc.value == info.ecc) { 
          this.datos.c60Ecc = ecc.code;
          this.datos.c60IdEcc = ecc.value;
        }
      });

      this.listaUnidadMedida.forEach(pv => {
        if(pv.value == info.unidadmedida) { 
          this.datos.c62UnidadMedida = pv.text;
          this.datos.c62IdUnidadMedida = pv.value;
        }
      });

      this.datos.c61ProductoTotal = info.productototal;

      this.listaUCA.forEach(uca => {
        if(uca.value == info.uca) { 
          this.datos.c63Uca = uca.code;
          this.datos.c63IdUca = uca.value;
        }
      });
      
      this.dialogRef.close(this.datos);
    }
}
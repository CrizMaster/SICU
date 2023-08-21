import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef  } from '@angular/core';
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

    dataFirst: any;
    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$';

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

      const m = moment('');
      // let fec = new Date(2021,8,1);
      // let newFec = moment(fec);
      // m.set(newFec.toObject());

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

      // this.dataFirst = data;
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
      // this.listDist$.unsubscribe();
      // this.listSect$.unsubscribe();
      // this.listManz$.unsubscribe();
    }

    ngOnInit(): void {
      this.adapter.setLocale(moment.locale('es-PE'));

      this.listCatValUnit$ = this._fichaIndividualService.listarCategoriaValoresUnitarios().subscribe(result => {

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

      // if(this.dataFirst === undefined){
      //   console.log('nuevo');
      // }
      // else{

      //   this.form.patchValue({ 
      //     lote: this.dataFirst.lote, 
      //     edifica: this.dataFirst.edifica, 
      //     entrada: this.dataFirst.entrada,
      //     piso: this.dataFirst.piso,
      //     unidad: this.dataFirst.unidad,
      //     //dc: this.dataFirst.dc,
      //     departamento: this.dataFirst.departamento
      //   });

      //   this.onChangeSelDepa(this.dataFirst.departamento, true);
      // }
    }

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
      // const ctrlValue = this.date.value!;
      // ctrlValue.month(normalizedMonthAndYear.month());
      // ctrlValue.year(normalizedMonthAndYear.year());
      // this.date.setValue(ctrlValue);

      this.form.patchValue({ mesanio: normalizedMonthAndYear });

      let info = this.form.value;
      const ctrlValue = info.mesanio.toDate();
      console.log(ctrlValue.getMonth() + 1);
      console.log(ctrlValue.getFullYear());

      console.log('desde aqui');
      console.log(this.form.get('mesanio'));

      datepicker.close();
    }

    // onChangeSelDepa(newValueDpto: string, sw: boolean){

    //   this.listProv$ = this._fichaIndividualService.listarProvincias(newValueDpto).subscribe({
    //     next:(result) => {
    //       this.provincias = result;
          
    //       this.distritos = [];
    //       this.sectores = [];
    //       this.manzanas = [];
    //       this.distritos.unshift({ id: 0, ubigeo: '000000', nombreDistrito: 'Seleccionar', ubigeoDistrito: '00' });
    //       this.sectores.unshift({ idSector: 0, codigoSector: 'Seleccionar'});
    //       this.manzanas.unshift({ idManzana: 0, codigoManzana: 'Seleccionar'});          

    //       if(sw) {
    //         this.form.patchValue({ provincia: this.dataFirst.provincia, distrito: parseInt(this.dataFirst.distrito) });
    //         this.onChangeSelProv(this.dataFirst.provincia, this.dataFirst.departamento, true);
    //       }
    //       else{
    //         this.form.patchValue({ provincia: '00', distrito: 0, sector: 0, manzana: 0 });
    //       }
    //     }
    //   });
    // }

    // onChangeSelProv(newValueProv: string, newValueDpto: string, sw: boolean){

    //   this.listDist$ = this._fichaIndividualService.listarDistritos(newValueProv, newValueDpto).subscribe(result => {

    //     this.distritos = result;

    //     this.sectores = [];
    //     this.manzanas = [];
    //     this.sectores.unshift({ idSector: 0, codigoSector: 'Seleccionar'});
    //     this.manzanas.unshift({ idManzana: 0, codigoManzana: 'Seleccionar'});        

    //     if(sw) {
    //       this.form.patchValue({ distrito: parseInt(this.dataFirst.distrito) });
    //       this.onChangeSelDist(this.dataFirst.distrito, true);
    //     }
    //     else{
    //       this.form.patchValue({ distrito: 0, sector: 0, manzana: 0 });
    //     }
    //   });
    // }

    // onChangeSelDist(newValueDist: string, sw: boolean){

    //   this.listSect$ = this._fichaIndividualService.listarSectores(parseInt(newValueDist)).subscribe(result => {

    //     this.sectores = result.data;

    //     this.manzanas = [];
    //     this.manzanas.unshift({ idManzana: 0, codigoManzana: 'Seleccionar'});

    //     if(sw) {
    //       this.form.patchValue({ sector: parseInt(this.dataFirst.sector) });
    //       this.onChangeSelSector(this.dataFirst.sector, true);
    //     }
    //     else{
    //       this.form.patchValue({ sector: 0, manzana: 0 });
    //     }
    //   });
    // }

    // onChangeSelSector(newValueSect: string, sw: boolean){
    //   let codSector = '';
    //   this.sectores.forEach(sec => {
    //     if(sec.idSector == parseInt(newValueSect)) codSector = sec.codigoSector;
    //   });

    //   this.listManz$ = this._fichaIndividualService.listarManzanas(codSector).subscribe(result => {

    //     this.manzanas = result.data;
        
    //     if(sw) {
    //       this.form.patchValue({ manzana: parseInt(this.dataFirst.manzana) });
    //     }
    //     else{
    //       this.form.patchValue({ manzana: 0 });
    //     }
    //   });
    // } 

    guardar(){
    //   let info = this.form.value;

    //   if(this.dataFirst === undefined){
    //     info.idFicha = 0
    //   }
    //   else{ 
    //     info.idFicha = this.dataFirst.idFicha; 
    //   }

    //   this.distritos.forEach(dist => {
    //     if(dist.id == info.distrito) { 
    //       info.codigoUbigeo = dist.ubigeo; 
    //       info.codigoDistrito = dist.ubigeoDistrito; 
    //     }
    //   });

    //   this.sectores.forEach(sect => {
    //     if(sect.idSector == info.sector) info.codigoSector = sect.codigoSector;
    //   });

    //   this.manzanas.forEach(manz => {
    //     if(manz.idManzana == info.manzana) info.codigoManzana = manz.codigoManzana;
    //   });

    //   this.dialogRef.close(info);
    }


}
import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Ubigeo } from 'src/app/core/models/ubigeo.model';
import { FichaIndividualService } from '../../ficha-individual.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sector } from '../../models/sector.model';
import { Manzana } from '../../models/manzana.model';
import { Observable, Subscription } from 'rxjs';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { OwnershipCharacteristics } from '../../models/OwnershipCharacteristics/ownership-characteristics.model';


@Component({
    selector: 'app-ownership-characteristics-modal',
    templateUrl: './ownership-characteristics-modal.component.html',
    styleUrls: ['./ownership-characteristics-modal.component.css']
})
export class OwnershipCharacteristicsModalComponent implements OnInit, OnDestroy {

    //dataFirst: any;
    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    listCatalogoMaster: CatalogoMaster[] = [];

    listCondTitular: ItemSelect<number>[] = [];
    listFormaAdquision: ItemSelect<number>[] = [];
    listTipoDocumento: ItemSelect<number>[] = [];
    listTipoPartidaRegistral: ItemSelect<number>[] = [];

    //public listCondTitular$: Observable<ItemSelect<number>[]> = new Observable;

    // provincias: Ubigeo[] = [{ id: 0, ubigeo: '000000', nombreProvincia: 'Seleccionar', ubigeoProvincia: '00' }];
    // distritos: Ubigeo[] = [{ id: 0, ubigeo: '000000', nombreDistrito: 'Seleccionar', ubigeoDistrito: '00' }];
    // sectores: Sector[] = [{ idSector:0 , codigoSector: 'Seleccionar'}];
    // manzanas: Manzana[] = [{ idManzana:0 , codigoManzana: 'Seleccionar'}];     

    // public listCondTitular$: Subscription = new Subscription;
    // public listDist$: Subscription = new Subscription;
    // public listSect$: Subscription = new Subscription;
    // public listManz$: Subscription = new Subscription;

    constructor(
      public dialogRef: MatDialogRef<OwnershipCharacteristicsModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _fichaIndividualService: FichaIndividualService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){

      this.form = this.fb.group({
        condiciontitular: [0, Validators.required],
        formaadquisicion: [0, Validators.required],
        tipodocumento: [0, Validators.required],
        tipopartidaregistral: [0, Validators.required],
        numero: ['', Validators.required]
      });

      this.listCatalogoMaster = _fichaIndividualService.getCatalogoMaster();

      this.listCondTitular = this.getList<number>(CatalogoMasterEnum.CondicionTitular);
      this.listFormaAdquision = this.getList<number>(CatalogoMasterEnum.FormaAdquisicion);
      this.listTipoDocumento = this.getList<number>(CatalogoMasterEnum.TipoDocumentoTitularidad);
      this.listTipoPartidaRegistral = this.getList<number>(CatalogoMasterEnum.TipoPartidaRegistral);
      
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

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnDestroy(): void {
      // this.listDist$.unsubscribe();
      // this.listSect$.unsubscribe();
      // this.listManz$.unsubscribe();
    }

    ngOnInit(): void {
      if(this.data.IdCondicionTitular == undefined){
        console.log('Nuevo');
      }
      else{
        this.form.patchValue({ 
          condiciontitular: this.data.IdCondicionTitular, 
          formaadquisicion: this.data.IdFormaAdquision,
          tipodocumento: this.data.IdTipoDocumento,
          tipopartidaregistral: this.data.IdTipoPartidaRegistral,
          numero: this.data.NumeroPartidaRegistral
          });
      }
    }

    //onChangeSelCondTitular(newValue: string, sw: boolean){

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
    //}

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

    //     this.sectores = result;

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

    //     this.manzanas = result;
        
    //     if(sw) {
    //       this.form.patchValue({ manzana: parseInt(this.dataFirst.manzana) });
    //     }
    //     else{
    //       this.form.patchValue({ manzana: 0 });
    //     }
    //   });
    // } 

    guardar(){
      let info = this.form.value;
      let resp: OwnershipCharacteristics = {};

      this.listCondTitular.forEach(item => {
        if(item.value == info.condiciontitular){
          resp.IdCondicionTitular = item.value;
          resp.CodeCondicionTitular = item.code;
          resp.CondicionTitular = item.text;
        }
      });

      this.listFormaAdquision.forEach(item => {
        if(item.value == info.formaadquisicion){
          resp.IdFormaAdquision = item.value;
          resp.CodeFormaAdquision = item.code;
          resp.FormaAdquision = item.text;
        }
      });

      this.listTipoDocumento.forEach(item => {
        if(item.value == info.tipodocumento){
          resp.IdTipoDocumento = item.value;
          resp.CodeTipoDocumento = item.code;
          resp.TipoDocumento = item.text;
        }
      });

      this.listTipoPartidaRegistral.forEach(item => {
        if(item.value == info.tipopartidaregistral){
          resp.IdTipoPartidaRegistral = item.value;
          resp.CodeTipoPartidaRegistral = item.code;
          resp.TipoPartidaRegistral = item.text;
        }
      });

      resp.NumeroPartidaRegistral = info.numero;
      this.dialogRef.close(resp);
    }
}
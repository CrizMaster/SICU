import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Manzana } from '../../../ficha-individual/models/manzana.model';
import { Sector } from '../../../ficha-individual/models/sector.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { LocalService } from 'src/app/core/shared/services/local.service';
import { GenerarOrdenService } from '../generar-orden.service';
import { Subscription } from 'rxjs';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { OrdenTrabajoFilter } from '../../models/ordenTrabajoFilter.model';
// import { FichaCatastralFilter } from '../models/fichaCatastralFilter.model';
// import { FichaIndividualService } from '../ficha-individual.service';

  
@Component({
    selector: 'app-panel-filter-orden',
    templateUrl: './panel-filter-orden.component.html',
    styleUrls: ['./panel-filter-orden.component.css']
})
export class PanelFilterOrdenComponent implements OnInit, OnDestroy {

    step = 0;
    customCollapsedHeight: string = '36px';
    customExpandedHeight: string = '36px';    
    filter: OrdenTrabajoFilter;

    IdUbigeo: number = 0;
    // NumeroFicha: string = '';
    // FichaLote: string = '';
    // CUC: string = '';
    // IdCondicionTitular: number = 0;
    // IdTipoTitular: number = 0;

    form: FormGroup;
    
    manzanas: Manzana[] = [{ idManzana: 0, codigoManzana: 'Seleccionar'}];
    //sectores: Sector[];
    estados: ItemSelect<string>[];

    //listCatalogoMaster: CatalogoMaster[] = [];
    listaEstadosOrden: ItemSelect<number>[] = [];

    //public listSect$: Subscription = new Subscription;
    public listManz$: Subscription = new Subscription;

    @Input() sectores: Sector[];
    
    constructor(
        private _localService: LocalService,
        private _generarOrdenService: GenerarOrdenService,
        private fb: FormBuilder
        ){
            //this.filter = { Page:1, ItemsByPage: 5, NroFicha: '', FichaLote: '', CUC: '', IdCondicion: 0, IdTipoTitular: 0 }
            this.form = this.fb.group({
                departamento: [{value: '', disabled : true }],
                provincia: [{value: '', disabled : true }],
                distrito: [{value: '', disabled : true }],
                sector: [0],
                manzana: [0],
                estado: [0]
              });

            //this.listCatalogoMaster = _generarOrdenService.getCatalogoMaster();
            this.listaEstadosOrden = getFilterMasterCatalog(CatalogoMasterEnum.EstadoOrdenTrabajo);
            let cm = this._localService.getData("sicuorg");
            if(cm.length > 0){
                let data = JSON.parse(cm);
                this.form.patchValue({ 
                    departamento: data.departamento, 
                    provincia: data.provincia, 
                    distrito: data.distrito
                });

                this.IdUbigeo =parseInt(data.idUbigeo);
                // this.listSect$ = this._generarOrdenService.listarSectores(parseInt(data.idUbigeo))
                // .subscribe(result => {
                //     this.sectores = result.data;
            
                //     this.manzanas = [];
                //     this.manzanas.unshift({ idManzana: 0, codigoManzana: 'Seleccionar'});
                // });            
            }
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        //this.listSect$.unsubscribe();
        this.listManz$.unsubscribe();
    }    

    // getList<T>(Grupo: string) : ItemSelect<T>[]{
    //     let list: ItemSelect<T>[] = [{ value: 0, text: 'Seleccione' }];

    //     this.listCatalogoMaster.forEach(item => {
    //         if(item.grupo == Grupo){
    //             list.push({
    //                 value: item.id,
    //                 text: item.nombre,
    //                 code: item.orden
    //             });
    //         };
    //     });

    //     return list;
    // }  

    onChangeSelSector(newValueSect: string, sw: boolean){
        let codSector = '';
        this.sectores.forEach(sec => {
          if(sec.idSector == parseInt(newValueSect)) codSector = sec.codigoSector;
        });
  
        this.listManz$ = this._generarOrdenService.listarManzanas(codSector).subscribe(result => {
  
          this.manzanas = result.data;
          
        //   if(sw) {
        //     this.form.patchValue({ manzana: parseInt(this.dataFirst.manzana) });
        //   }
        //   else{
        //     this.form.patchValue({ manzana: 0 });
        //   }
        });
      }    

    buscar(){
        console.log('buscando..');
        let info = this.form.value;

        this.filter = { 
            Page:1, 
            ItemsByPage: 5, 
            IdUbigeo: this.IdUbigeo,
            Sector: '',
            Manzana: '',
            Estado: info.estado            
        }

        let idsec = parseInt(info.sector);
        if(idsec != 0){
            this.sectores.forEach(el => {
                if(el.idSector == idsec){
                    this.filter.Sector = el.codigoSector;
                }
            });
        }

        let idmz = parseInt(info.manzana);
        if(idmz != 0){
            this.manzanas.forEach(el => {
                if(el.idManzana == idmz){
                    this.filter.Manzana = el.codigoManzana;
                }
            });
        }
        


        console.log(this.filter);
        this._generarOrdenService.listarOrdenesTrabajoxDistrito(this.filter).subscribe({
            next:(Data: any) => {
                console.log('Data Panel Filter');
                console.log(Data);
                this._generarOrdenService.DataTableOT.next(Data);
            }
          })
    }
}
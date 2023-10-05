import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Manzana } from '../../../ficha-individual/models/manzana.model';
import { Sector } from '../../../ficha-individual/models/sector.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { LocalService } from 'src/app/core/shared/services/local.service';
import { GenerarOrdenService } from '../generar-orden.service';
import { Subscription } from 'rxjs';
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

    @Input() sectores: Sector[];
    public listManz$: Subscription = new Subscription;

    step = 0;
    customCollapsedHeight: string = '36px';
    customExpandedHeight: string = '36px';    
    filter: OrdenTrabajoFilter;

    IdUbigeo: number = 0;

    form: FormGroup;
    
    manzanas: Manzana[] = [{ idManzana: 0, codigoManzana: 'Seleccionar'}];

    listaEstadosOrden: ItemSelect<number>[] = [];
    
    constructor(
        private _localService: LocalService,
        private _generarOrdenService: GenerarOrdenService,
        private fb: FormBuilder
        ){
            this.form = this.fb.group({
                departamento: [{value: '', disabled : true }],
                provincia: [{value: '', disabled : true }],
                distrito: [{value: '', disabled : true }],
                sector: [0],
                manzana: [0],
                estado: [0]
              });

            let listEstados = getFilterMasterCatalog(CatalogoMasterEnum.EstadoOrdenTrabajo);
            listEstados.forEach(elem => {
                if(elem.code == null || elem.code == '01') this.listaEstadosOrden.push(elem);
            });

            let cm = this._localService.getData("sicuorg");
            if(cm.length > 0){
                let data = JSON.parse(cm);
                this.form.patchValue({ 
                    departamento: data.departamento, 
                    provincia: data.provincia, 
                    distrito: data.distrito
                });

                this.IdUbigeo = parseInt(data.idUbigeo);           
            }
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.listManz$.unsubscribe();
    } 

    onChangeSelSector(newValueSect: string){
        let codSector = '';
        this.sectores.forEach(sec => {
          if(sec.idSector == parseInt(newValueSect)) codSector = sec.codigoSector;
        });
  
        this.listManz$ = this._generarOrdenService.listarManzanas(codSector).subscribe(result => {  
          this.manzanas = result.data;
        });
      }    

    buscar(){

        let info = this.form.value;
        
        this.filter = { 
            Page:1, 
            ItemsByPage: 10, 
            IdUbigeo: this.IdUbigeo,
            Sector: '',
            Manzana: '',
            Estado: ''
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

        let idest = parseInt(info.estado);
        if(idest != 0){
            this.listaEstadosOrden.forEach(el => {
                if(el.value == idest){
                    this.filter.Estado = el.code;
                }
            });
        }        
        
        this._generarOrdenService.listarOrdenesTrabajoxDistrito(this.filter).subscribe({
            next:(Data: any) => {
                this._generarOrdenService.DataTableOT.next(Data);
            }
          })
    }
}
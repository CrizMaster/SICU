import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Title } from 'src/app/core/models/title.model';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { Subscription } from 'rxjs';
import { LoteFilter, LoteResponse } from '../../../models/loteResponse';
import { SeguimientoService } from '../../seguimiento.service';
import { OrdenTrabajoFilter } from '../../../models/ordenTrabajoFilter.model';
import { OrdenTrabajoView } from '../../../models/ordenTrabajoResponse';
import { OrdenTrabajoService } from 'src/app/intranet/components/formularios/orden-trabajo/orden-trabajo.service';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
  
@Component({
    selector: 'app-bandeja-lote',
    templateUrl: './bandeja-lote.component.html',
    styleUrls: ['./bandeja-lote.component.css'],
    animations: [
      trigger('detailExpand', [
        state('collapsed', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ]
})
export class BandejaLoteComponent implements OnInit , OnDestroy {

    filter: LoteFilter = {};
    fi:LoteResponse[]=[];
    loading: boolean = true;
    disablebtnAsignar: boolean = true;
    displayedColumns: string[] = ['Estado', 'NroLote', 'TotalUC', 'FechaAsignacion', 'FechaSincronizada', 'Accion'];
    //columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];

    //expandedElement: OrdenTrabajo | null;
    @Input() datos: OrdenTrabajoView = {};
    
    dataSource = new MatTableDataSource<LoteResponse>();
    //selection = new SelectionModel<OrdenTrabajo>(true, []);
  
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    
    pageEvent?: PageEvent;
    page: number = 1;
    itemsByPage: number = 10;
    color:string = 'primary';
  
    public anularOT$: Subscription = new Subscription;
    public quitarUsuario$: Subscription = new Subscription;
    public listLote$: Subscription = new Subscription;
    public listLote1$: Subscription = new Subscription;

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  
    constructor(
      private _seguimientoService: SeguimientoService,
      private _ordenTrabajoService: OrdenTrabajoService,
      private route: Router,
      public dialog: MatDialog){
      //this.filter = { Page:1, ItemsByPage: 10, Sector: '', Manzana: '', IdUbigeo: 0, Estado: '0'}
    }

    ngOnInit(): void {  
      this.filter.Page = this.page;
      this.filter.ItemsByPage = this.itemsByPage;
      this.ListarLotes();
    } 

    ngOnDestroy(): void {
      this.anularOT$.unsubscribe();
      this.quitarUsuario$.unsubscribe();
      this.listLote$.unsubscribe();
      this.listLote1$.unsubscribe();
    }

    ListarLotes(){
      this.filter.codigoOrden = this.datos.codigoOrden;

      this.listLote$ = this._ordenTrabajoService.listarLotesxOrdenTrabajo(this.filter).subscribe({
        next:(Data:StatusResponse<LoteResponse[]>) => {

          if(Data.success){
            // Data.data.forEach(elem => {
            //   elem.seleccion = false;
            //   elem.expandir = false;
            // });

            this.loading = false;
            let info:LoteResponse[] = Data.data;
            info.length = Data.total;          

            this.dataSource = new MatTableDataSource<LoteResponse>(info);
            this.dataSource._updateChangeSubscription();
            this.dataSource.paginator = this.paginator;
          }
          else{
            this.dataSource = new MatTableDataSource<LoteResponse>();
            this.dataSource.paginator = this.paginator;
          }
        }
      })
    }

    ExpandirContraer(elem: any){
      elem.expandir = !elem.expandir;
    }

    pageChanged(event: PageEvent){
      this.loading = true;
      let pageIndex = event.pageIndex;
      let pageSize = event.pageSize;
  
      let previousIndex = event.previousPageIndex;
      let previousSize = pageSize * pageIndex;
  
      this.filter.Page = pageIndex + 1;
      this.filter.ItemsByPage = pageSize;

      this.listLote1$ = this._ordenTrabajoService.listarLotesxOrdenTrabajo(this.filter).subscribe({
        next:(Data:StatusResponse<LoteResponse[]>) => {

            this.loading = false;

            this.fi.length = previousSize;
            this.fi.push(...Data.data);
            this.fi.length = Data.total;

            this.dataSource = new MatTableDataSource<LoteResponse>(this.fi);
            this.dataSource._updateChangeSubscription();
  
            this.dataSource.paginator = this.paginator;
        }
      })    
    }

    VerUnidadCatastral(data: LoteResponse)
    {
      let ot: OrdenTrabajoView = this.datos;
      ot.nroLote = data.codigoLoteCaracterizacion;
      this._seguimientoService.viewOrdenTrabajo.next(ot);

      this.route.navigateByUrl('/intranet/verunidadcatastral');
    }
}
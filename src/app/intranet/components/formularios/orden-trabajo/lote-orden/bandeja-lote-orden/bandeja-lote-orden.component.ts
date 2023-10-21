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
import { OrdenTrabajoService } from '../../orden-trabajo.service';
import { LoteFilter, LoteResponse } from 'src/app/intranet/components/asignacion-carga/models/loteResponse';
import { OrdenTrabajoView } from 'src/app/intranet/components/asignacion-carga/models/ordenTrabajoResponse';
import { FilterCaracterizacion } from '../../../models/caracterizacionResponse';
  
@Component({
    selector: 'app-bandeja-lote-orden',
    templateUrl: './bandeja-lote-orden.component.html',
    styleUrls: ['./bandeja-lote-orden.component.css'],
    animations: [
      trigger('detailExpand', [
        state('collapsed', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ]
})
export class BandejaLoteOrdenComponent implements OnInit , OnDestroy {

    filter: LoteFilter;
    fi:any=[];
    loading: boolean = true;
    disablebtnAsignar: boolean = true;
    displayedColumns: string[] = ['Estado', 'NroLote', 'TotalUC', 'FechaAsignacion', 'FechaSincronizada', 'Accion'];

    @Input() datos: OrdenTrabajoView = {};
    
    dataSource = new MatTableDataSource<LoteResponse>();
  
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    
    pageEvent?: PageEvent;
    page: number = 1;
    itemsByPage: number = 10;
    color:string = 'primary';
  
    public listaLoteOT$: Subscription = new Subscription;
    // public quitarUsuario$: Subscription = new Subscription;

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  
    constructor(
      private _ordenTrabajoService: OrdenTrabajoService,
      private route: Router,
      public dialog: MatDialog){
      this.filter = { Page:1, ItemsByPage: 10, codigoOrden: 0, orden: 0}
    }

    ngOnInit(): void {
      this.filter.Page = this.page;
      this.filter.ItemsByPage = this.itemsByPage;
      this.ListarLotes();
    } 

    ngOnDestroy(): void {
      this.listaLoteOT$.unsubscribe();
    }

    ListarLotes(){
      
      this.filter.codigoOrden = this.datos.codigoOrden;
      this.listaLoteOT$ = this._ordenTrabajoService.listarLotesxOrdenTrabajo(this.filter).subscribe({
        next:(Data) => {

          if(Data.success){
            this.loading = false;
            let info = Data.data;
            info.length = Data.total;          

            this.dataSource = new MatTableDataSource<LoteResponse>(info);
            this.dataSource._updateChangeSubscription();
            this.dataSource.paginator = this.paginator;
          }
          else{
            this.dataSource = new MatTableDataSource<LoteResponse>([]);
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
  
      this.ListarLotes();

    }


    ActualizarFormulario(data: LoteResponse)
    {
      let filter: FilterCaracterizacion = {
        codigoCaracterizacion: data.codigoCaracterizacion,
        codigoLoteCaracterizacion: data.codigoLoteCaracterizacion,
        codigoDetalle: data.codigoDetalle,
        codigoLote: data.codigoLote
      }

      this._ordenTrabajoService.filterCaracterizacion.next(filter);

      this.route.navigateByUrl('/intranet/registroLoteOrden');
    }

}
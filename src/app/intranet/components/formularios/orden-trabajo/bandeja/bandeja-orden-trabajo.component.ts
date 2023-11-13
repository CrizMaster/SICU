import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { Subscription } from 'rxjs';
import { OrdenTrabajoService } from '../orden-trabajo.service';
import { OrdenTrabajoView } from '../../../asignacion-carga/models/ordenTrabajoResponse';
import { OrdenTrabajoFilter } from '../../../asignacion-carga/models/ordenTrabajoFilter.model';
import { OrdenTrabajo } from '../../../asignacion-carga/models/ordenTrabajo.model';
  
@Component({
    selector: 'app-bandeja-orden-trabajo',
    templateUrl: './bandeja-orden-trabajo.component.html',
    styleUrls: ['./bandeja-orden-trabajo.component.css'],
    animations: [
      trigger('detailExpand', [
        state('collapsed', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ]
})
export class BandejaOrdenTrabajoComponent implements OnInit , OnDestroy {

    filter: OrdenTrabajoFilter;
    fi:any=[];
    loading: boolean = true;
    disablebtnAsignar: boolean = true;
    displayedColumns: string[] = ['Dpto', 'Prov', 'Dist', 'Sec', 
    'Mz', 'TotalLotes', 'NroOrden', 'EstadoOrden', 'FechaAsignacion', 'PersonalAsignado','seleccion'];
    columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];

    expandedElement: OrdenTrabajo | null;

    dataSource = new MatTableDataSource<OrdenTrabajo>();
    selection = new SelectionModel<OrdenTrabajo>(true, []);
  
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    
    pageEvent?: PageEvent;
    page: number = 1;
    itemsByPage: number = 10;
    color:string = 'primary';
  
    public anularOT$: Subscription = new Subscription;
    public quitarUsuario$: Subscription = new Subscription;
    public listaOT$: Subscription = new Subscription;
    public listaOTxDist$: Subscription = new Subscription;
    public listaOTxDist2$: Subscription = new Subscription;

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  
    constructor(
      private _ordenTrabajoService: OrdenTrabajoService,
      private route: Router,
      public dialog: MatDialog){
      this.filter = { Page:1, ItemsByPage: 10, Sector: '', Manzana: '', IdUbigeo: 0, Estado: '0'}
    }

    ngOnInit(): void {  
  
      this.ListarOrdenes();
  
      this.listaOT$ = this._ordenTrabajoService.DataTableOT.subscribe({
        next:(Data) => {
  
          if(Data.total > 0){
            this.loading = true;
  
            setTimeout(() => {
              this.paginator.pageIndex = 0;
              this.paginator.pageSize = 10;
    
              let fi: OrdenTrabajo[];

              Data.data.forEach(elem => {
                elem.seleccion = false;
                elem.expandir = false;
              });

              fi = Data.data;
              fi.length = Data.total;
              
              this.dataSource = new MatTableDataSource<OrdenTrabajo>(fi);
              this.dataSource.paginator = this.paginator;
    
              this.loading = false;
            }, 500);
          }
        }
      });
  
    } 

    ngOnDestroy(): void {
      this.anularOT$.unsubscribe();
      this.quitarUsuario$.unsubscribe();
      this.listaOT$.unsubscribe();
      this.listaOTxDist$.unsubscribe();
      this.listaOTxDist2$.unsubscribe();
    }

    ListarOrdenes(){
      this.listaOTxDist$ = this._ordenTrabajoService.listarOrdenesTrabajoxDistrito(this.filter).subscribe({
        next:(Data) => {

          if(Data.success){
            Data.data.forEach(elem => {
              elem.seleccion = false;
              elem.expandir = false;
            });

            this.loading = false;
            let info = Data.data;
            info.length = Data.total;          

            this.dataSource = new MatTableDataSource<OrdenTrabajo>(info);
            this.dataSource.paginator = this.paginator;
          }
          else{
            this.dataSource = new MatTableDataSource<OrdenTrabajo>([]);
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
  
      this.listaOTxDist2$ = this._ordenTrabajoService.listarOrdenesTrabajoxDistrito(this.filter).subscribe({
        next:(Data) => {
            this.loading = false;
  
            Data.data.forEach(elem => {
              elem.seleccion = false;
              elem.expandir = false;
            });

            this.fi.length = previousSize;
            this.fi.push(...Data.data);
            this.fi.length = Data.total;
            
            this.selection.selected.forEach(sel => {
              this.fi.forEach(item => {
                if(item.id == sel.id) item.seleccion = true;
              });
            });

            this.dataSource = new MatTableDataSource<OrdenTrabajo>(this.fi);
            this.dataSource._updateChangeSubscription();
  
            this.dataSource.paginator = this.paginator;
        }
      })
    }

    changeCheckbox(val:any, elem: any){

      if(val.checked){
        let sw: boolean = false;
        this.selection.selected.forEach(el => {
          if(el.id == elem.id){
            sw = true;
          }
        });
        if(!sw) this.selection.select(elem);
      }
      else{
        this.selection.selected.forEach(el => {
          if(el.id == elem.id){
            this.selection.deselect(el);
          }
        });      
      }      

      this.disablebtnAsignar = this.selection.selected.length == 0;

    }

    VerLote(data: OrdenTrabajo)
    {

      let ot: OrdenTrabajoView = {
        orden: data.orden,
        codigoOrden: data.codigoOrden,
        fechaOrden: data.fechaOrden,
        estadoOrden: data.estadoOrden,
        codigoEstadoOrden: data.codigoEstadoOrden,
        codigoSector: data.codigoSector,
        codigoManzana: data.codigoManzana,
        usuarios: data.usuarios
      }

      this._ordenTrabajoService.viewOrdenTrabajo.next(ot);

      this.route.navigateByUrl('/intranet/loteOrden');
    }

    ModalLoading(): any {     
      let modal: Title = { 
        Title: 'Procesando su solicitud...'}
      let dgRef = this.dialog.open(ModalLoadingComponent, {
          width: '400px',
          height: '95px',
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          disableClose: true,
          data: modal
      }); 

      return dgRef;
    }

    AgregarPersona(dato: OrdenTrabajo){

    }
}
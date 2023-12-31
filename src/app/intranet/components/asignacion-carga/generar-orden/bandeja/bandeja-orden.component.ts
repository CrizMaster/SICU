import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrdenTrabajo } from '../../models/ordenTrabajo.model';
import { GenerarOrdenService } from '../generar-orden.service';
import { OrdenTrabajoFilter } from '../../models/ordenTrabajoFilter.model';
import { SelectionModel } from '@angular/cdk/collections';
import { RegisterOrdenModalComponent } from '../register-orden-modal/register-orden-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UsuarioAsignado } from '../../models/personalAsignado.model';
import { Title } from 'src/app/core/models/title.model';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { OrdenTrabajoAction } from '../../models/ordenTrabajoResponse';
import { Subscription } from 'rxjs';
  
@Component({
    selector: 'app-bandeja-orden',
    templateUrl: './bandeja-orden.component.html',
    styleUrls: ['./bandeja-orden.component.css'],
    animations: [
      trigger('detailExpand', [
        state('collapsed', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ]
})
export class BandejaOrdenComponent implements OnInit , OnDestroy {

    filter: OrdenTrabajoFilter;
    fi:OrdenTrabajo[]=[];
    loading: boolean = true;
    disablebtnAsignar: boolean = true;
    //expandedElement: Boolean = false;
    // displayedColumns: string[] = ['IdFichaCatastral','numeroFicha', 'fichaLote', 'codigoUnicoCatastral', 'codigoRefenciaCatastral',
    // 'codigoContribuyenteRenta', 'codigoPredialRentas', 'condicionTitular', 'tipoTitular', 
    // 'apellidoPaterno', 'apellidoMaterno', 'nombres', 'estado'];
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
    public listOT$: Subscription = new Subscription;
    public listOT1$: Subscription = new Subscription;
    public listOT2$: Subscription = new Subscription;

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  
    constructor(
      private _generarOrdenService: GenerarOrdenService,
      private route: Router,
      public dialog: MatDialog){
      this.filter = { Page:1, ItemsByPage: 10, Sector: '', Manzana: '', IdUbigeo: 0, Estado: '0'}
    }

    ngOnInit(): void {  
  
      this.ListarOrdenes();
  
      this.listOT$ = this._generarOrdenService.DataTableOT.subscribe({
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
      this.listOT$.unsubscribe();
      this.listOT1$.unsubscribe();
      this.listOT2$.unsubscribe();
    }

    ListarOrdenes(){
      this.listOT1$ = this._generarOrdenService.listarOrdenesTrabajoxDistrito(this.filter).subscribe({
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
  
      this.listOT2$ = this._generarOrdenService.listarOrdenesTrabajoxDistrito(this.filter).subscribe({
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

      //console.log(this.selection.selected);
    }

    CrearOrdenModal(data: OrdenTrabajo):void {

      const dialogCrearOrden = this.dialog.open(RegisterOrdenModalComponent, {
          width: '800px',
          enterAnimationDuration : '300ms',
          exitAnimationDuration: '300ms',
          disableClose: true,
          data: data
      });
  
      dialogCrearOrden.afterClosed().subscribe((result:boolean) => {
        if(result){
          this.ListarOrdenes();
        }            
      });
    }

    CrearOrden(data: OrdenTrabajo){
      this.CrearOrdenModal(data);
    }

    AnularOrden(dato: OrdenTrabajo){
      let modal: Title = { Title: '¿Está seguro de anular la orden ' + dato.orden + ' ?', Subtitle: '', Icon: '' }
      const dialogAnularOrden = this.dialog.open(ModalQuestionComponent, {
          width: '450px',
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          disableClose: true,
          data: modal
      });

      dialogAnularOrden.afterClosed().subscribe((result:boolean) => {
        if(result){
          let mLoading = this.ModalLoading();

          let data: OrdenTrabajoAction = {
            usuarioCreacion: 'carevalo',
            terminalCreacion: '127.0.0.0',
            codigoOrden: dato.codigoOrden
          }

          this.anularOT$ = this._generarOrdenService.anularOrden(data)
          .subscribe(result => {    
            setTimeout(() => {
              mLoading.close();       

              if(result.success){ 
                
                let modal: Title = { 
                  Title: 'Orden anulada',
                  Subtitle: 'La orden ' + dato.orden + ' se anuló satisfactoriamente.', 
                  Icon: 'ok' 
                }

                const okModal = this.dialog.open(ModalMessageComponent, {
                    width: '500px',
                    enterAnimationDuration: '300ms',
                    exitAnimationDuration: '300ms',
                    disableClose: true,
                    data: modal
                });

                okModal.afterClosed().subscribe(resp => {
                  if(resp){
                    this.ListarOrdenes();
                  }
                });

              }
              else{
                  let modal: Title = { 
                      Title: 'Opss...', 
                      Subtitle: result.message, 
                      Icon: 'error' }
                    this.dialog.open(ModalMessageComponent, {
                        width: '500px',
                        enterAnimationDuration: '300ms',
                        exitAnimationDuration: '300ms',
                        disableClose: true,
                        data: modal
                    });
              }              
            }, 500);
          });

        }            
      });
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

    QuitarPersona(dato: UsuarioAsignado){

      let modal: Title = { Title: '¿Está seguro de quitar al personal?', Subtitle: '', Icon: '' }
      const dialogQuitarPersona = this.dialog.open(ModalQuestionComponent, {
          width: '450px',
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          disableClose: true,
          data: modal
      });

      dialogQuitarPersona.afterClosed().subscribe((result:boolean) => {
        if(result){
          let loading = this.ModalLoading();

          let data: OrdenTrabajoAction = {
            usuarioCreacion: 'carevalo',
            terminalCreacion: '127.0.0.0',
            codigoOrden: dato.codigoOrden,
            usuarios: [{
              codigoUsuarioOrden: dato.codigoUsuarioOrden
            }]
          }

          this.quitarUsuario$ = this._generarOrdenService.quitarUsuario(data)
          .subscribe(result => {    
            setTimeout(() => {

              loading.close();       

              if(result.success){ 
                
                let modal: Title = { 
                  Title: 'Personal eliminado',
                  Subtitle: 'El Personal ' + dato.persona + ' se eliminó de la orden satisfactoriamente.', 
                  Icon: 'ok' 
                }

                const okModal = this.dialog.open(ModalMessageComponent, {
                    width: '500px',
                    enterAnimationDuration: '300ms',
                    exitAnimationDuration: '300ms',
                    disableClose: true,
                    data: modal
                });

                okModal.afterClosed().subscribe(resp => {
                  if(resp){
                    this.ListarOrdenes();
                  }
                });

              }
              else{

                if(result.validations == null) result.message = 'Ha ocurrido un error, contacte con el area de soporte.';

                  let modal: Title = { 
                      Title: 'Opss...', 
                      Subtitle: result.message, 
                      Icon: 'error' }
                    this.dialog.open(ModalMessageComponent, {
                        width: '500px',
                        enterAnimationDuration: '300ms',
                        exitAnimationDuration: '300ms',
                        disableClose: true,
                        data: modal
                    });
              }              
            }, 500);
          });

        }            
      });
    }



}
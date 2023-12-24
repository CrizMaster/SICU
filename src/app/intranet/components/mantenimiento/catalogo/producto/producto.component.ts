import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { MatDialog } from '@angular/material/dialog';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { MantenimientoService } from '../../mantenimiento.service';
import { ProductoFilter, ProductoRequest, ProductoResponse } from 'src/app/intranet/models/productoResponse';
import { ProductoModalComponent } from './producto-modal/producto-modal.component';
import { AuthService } from 'src/app/core/shared/services/auth.service';
import { Router } from '@angular/router';
import { fnErrorNoCtrl } from 'src/app/core/shared/function/fnErrorNoCtrl';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
  
@Component({
    selector: 'app-producto',
    templateUrl: './producto.component.html',
    styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, OnDestroy {

    isMobile: boolean = true;
    expanded: boolean = true;
    form: FormGroup;

    listaProducto: ProductoResponse[] = [];
    
    public saveForm$: Subscription = new Subscription;
    public lista$: Subscription = new Subscription;    

    displayedColumns: string[] = ['Nro', 'Codigo', 'Producto', 'ValorCompra', 'FechaCrea', 'PersonaCrea', 'Estado', 'Accion'];

    BreadcrumbForm: Breadcrumb[] = [{ name : "Mantenimiento" },{ name : "Catalogo de Producto" }];

    tituloForm: Title = { Title: 'CATALOGO DE PRODUCTOS', Subtitle : 'Bandeja que lista el catalogo de productos principal de la empresa', Icon : 'assignment', Url: '' };

    dataSource = new MatTableDataSource<ProductoResponse>();

    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

    pageEvent?: PageEvent;
    pagina: number = 1;
    registros: number = 10;

    constructor(
        private _mantenimientoService: MantenimientoService,
        private _authService: AuthService,
        private fb: FormBuilder,
        private route: Router,
        public dialog: MatDialog)
    {
        this.form = this.fb.group({
            codigo: [''],
            nombreproducto: ['']
        });
    }

    ngOnInit(): void {
        let filter: ProductoFilter = { Pagina: this.pagina, Registros: this.registros, Codigo: '', NombreProducto: '' };
        this.ListarProducto(filter);        
    }    

    ngOnDestroy(): void {
        this.saveForm$.unsubscribe();
        this.lista$.unsubscribe();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
      }    

    buscar(){
        let info = this.form.value;
        let filter: ProductoFilter = {
            Pagina: this.pagina,
            Registros: this.registros,
            Codigo: info.codigo,
            NombreProducto: info.nombreproducto
        };
        this.ListarProducto(filter);
    }

    limpiar(){
        this.form.patchValue({ 
            codigo: '',
            nombreproducto: ''
        });
        this.form.markAsUntouched;
    }

    Agregar()
    {
        const dialogRef = this.dialog.open(ProductoModalComponent, {
            width: '600px',            
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: { idPersona: 0, accion: 1 },
            scrollStrategy: new NoopScrollStrategy()
        });
        
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if(result){
                this.buscar();   
            }      
        });
    }

    Editar(per: ProductoResponse){
        per.accion = 2;
        const dialogRef = this.dialog.open(ProductoModalComponent, {
            width: '600px',            
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: per,
            scrollStrategy: new NoopScrollStrategy()
        });
        
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.buscar();   
            }      
        });  
    }

    Activar(per: ProductoResponse){
        let modal: Title = { Title: '¿Está seguro de activar al producto?'}
        
        const subDialogModal = this.dialog.open(ModalQuestionComponent, {
            width: '450px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal,
            scrollStrategy: new NoopScrollStrategy()
        });

        subDialogModal.afterClosed().subscribe(resp => {
            if(resp){
            
                let dg = this.ModalLoading();
                let request: ProductoRequest = {
                    idProducto: per.idProducto,
                    accion: 4
                }

                this.saveForm$ = this._mantenimientoService.GestionarProducto(request)
                .subscribe(result => {
                    setTimeout(() => {
                        dg.close();
                        if(result.success) {  
                            
                            let modal: Title = { 
                                Title: 'Producto activado', 
                                Subtitle: result.message, 
                                Icon: 'ok' 
                            }
                            const okModal = this.dialog.open(ModalMessageComponent, {
                                width: '500px',
                                enterAnimationDuration: '300ms',
                                exitAnimationDuration: '300ms',
                                disableClose: true,
                                data: modal,
                                scrollStrategy: new NoopScrollStrategy()
                            });                            

                            okModal.afterClosed().subscribe(resp => {
                                this.buscar();
                            }); 
                        }
                        else{
                            let modal: Title = { 
                                Title: 'Opss...', 
                                Subtitle: result.message, 
                                Icon: 'error' 
                            }
                            this.dialog.open(ModalMessageComponent, {
                                width: '500px',
                                enterAnimationDuration: '300ms',
                                exitAnimationDuration: '300ms',
                                disableClose: true,
                                data: modal,
                                scrollStrategy: new NoopScrollStrategy()
                            });
                        }
                    }, 300);
              });
            }            
          });         
    }

    Desactivar(per: ProductoResponse){
        let modal: Title = { Title: '¿Está seguro de desactivar al producto?'}
        
        const subDialogModal = this.dialog.open(ModalQuestionComponent, {
            width: '450px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal,
            scrollStrategy: new NoopScrollStrategy()
        });

        subDialogModal.afterClosed().subscribe(resp => {
            if(resp){
            
                let dg = this.ModalLoading();
                let request: ProductoRequest = {
                    idProducto: per.idProducto,
                    accion: 3
                }

                this.saveForm$ = this._mantenimientoService.GestionarProducto(request)
                .subscribe({
                    next:(result) => {
                        setTimeout(() => {
                            dg.close();
                            if(result.success) {  
                                
                                let modal: Title = { 
                                    Title: 'Producto desactivado', 
                                    Subtitle: result.message, 
                                    Icon: 'ok' 
                                }
                                const okModal = this.dialog.open(ModalMessageComponent, {
                                    width: '500px',
                                    enterAnimationDuration: '300ms',
                                    exitAnimationDuration: '300ms',
                                    disableClose: true,
                                    data: modal,
                                    scrollStrategy: new NoopScrollStrategy()
                                });                            
    
                                okModal.afterClosed().subscribe(resp => {
                                    this.buscar();
                                }); 
                            }
                            else{
                                let modal: Title = { 
                                    Title: 'Opss...', 
                                    Subtitle: result.message, 
                                    Icon: 'error' 
                                }
                                this.dialog.open(ModalMessageComponent, {
                                    width: '500px',
                                    enterAnimationDuration: '300ms',
                                    exitAnimationDuration: '300ms',
                                    disableClose: true,
                                    data: modal,
                                    scrollStrategy: new NoopScrollStrategy()
                                });
                            }
                        }, 300);

                    },
                    error:(err) => {
                        dg.close();
                        fnErrorNoCtrl(this.dialog, this._authService, err); 
                    },
                    complete:() => {
                        dg.close();
                    }
                });
            }            
          });         
    }    

    ListarProducto(filter: ProductoFilter){

        let loading =  this.ModalLoading();
        this.dataSource = new MatTableDataSource<ProductoResponse>([]);
        this.dataSource.paginator = this.paginator;

        this.lista$ = this._mantenimientoService.ListarProducto(filter)
        .subscribe(
            {
            next:(Data) => {
                if(Data.success){
                    this.paginator.pageIndex = this.pagina - 1;
                    this.paginator.pageSize = this.registros;
        
                    let previousSize = this.registros * (this.pagina - 1);

                    this.listaProducto.length = previousSize;
                    this.listaProducto.push(...Data.data);
                    this.listaProducto.length = Data.totalRegistros;
                    
                    this.dataSource = new MatTableDataSource<ProductoResponse>(this.listaProducto);
                    this.dataSource._updateChangeSubscription();

                    this.dataSource.paginator = this.paginator;
                }
            },
            error:(err) => {
                loading.close();
                fnErrorNoCtrl(this.dialog, this._authService, err); 
            },
            complete:() => {
                loading.close();
            }
        }
        );        
    }

    pageChanged(event: PageEvent){
        this.pagina = event.pageIndex + 1;
        this.registros = event.pageSize;
    
        this.buscar();
    }    


    ModalLoading(): any {     
        let modal: Title = { 
          Title: 'Cargando...'
        }
        let dgRef = this.dialog.open(ModalLoadingComponent, {
            width: '300px',
            height: '95px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal,
            scrollStrategy: new NoopScrollStrategy()
        }); 
  
        return dgRef;
    }
}
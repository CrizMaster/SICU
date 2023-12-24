import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PersonaFilter, PersonaRequest, PersonaResponse, UsuarioRequest } from 'src/app/intranet/models/personaResponse';
import { ConfiguracionService } from '../configuracion.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { MatDialog } from '@angular/material/dialog';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
import { PersonaModalComponent } from './persona-modal/persona-modal.component';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { fnFilterMasterCatalog } from 'src/app/core/shared/function/fnFilterMasterCatalog';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { UsuarioModalComponent } from './usuario-modal/usuario-modal.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

@Component({
    selector: 'app-personal-usuario',
    templateUrl: './personal-usuario.component.html',
    styleUrls: ['./personal-usuario.component.css']
})
export class PersonalUsuarioComponent implements OnInit, OnDestroy {

    isMobile: boolean = true;
    expanded: boolean = true;
    form: FormGroup;

    listaPersonal: PersonaResponse[] = [];
    
    public listaPersonal$: Subscription = new Subscription;
    public saveForm$: Subscription = new Subscription;
    
    ListaTipoDocumento: ItemSelect<number>[] = [];

    displayedColumns: string[] = ['Nro', 'NumeroDoc', 'Personal', 'Cargo', 'Celular', 'Correo', 'Usuario', 'Estado', 'Accion'];

    BreadcrumbForm: Breadcrumb[] = [{ name : "Configuraciones" },{ name : "Personal & Usuarios" }];

    tituloForm: Title = { Title: 'REGISTRO DEL PERSONAL & USUARIOS', Subtitle : 'Bandeja que lista el personal registrado', Icon : 'assignment', Url: '' };

    dataSource = new MatTableDataSource<PersonaResponse>();

    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

    pageEvent?: PageEvent;
    pagina: number = 1;
    registros: number = 10;

    constructor(
        private _configuracionService: ConfiguracionService,
        private fb: FormBuilder,
        public dialog: MatDialog)
    {
        this.form = this.fb.group({
            tipodocumento: [0],
            numerodocumento: [''],
            apellidopaterno: [''],
            apellidomaterno: [''],
            nombres: ['']
        });

        this.ListaTipoDocumento = fnFilterMasterCatalog(CatalogoMasterEnum.TipoDocumentoIdentidadPersona);
    }

    ngOnInit(): void {
        let filter: PersonaFilter = { Pagina: this.pagina, Registros: this.registros };
        this.ListarPersonal(filter);
    }    

    ngOnDestroy(): void {
        this.listaPersonal$.unsubscribe();
        this.saveForm$.unsubscribe();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
      }    

    buscar(){
        let info = this.form.value;
        let filter: PersonaFilter = {
            Pagina: this.pagina,
            Registros: this.registros,
            IdTipoDocumento: info.tipodocumento,
            NumeroDocumento: info.numerodocumento,
            ApePaterno: info.apellidopaterno,
            ApeMaterno: info.apellidomaterno,
            Nombres: info.nombres
        };
        this.ListarPersonal(filter);
    }

    limpiar(){
        this.form.patchValue({ 
            tipodocumento: 0,
            numerodocumento: '',
            apellidopaterno: '',
            apellidomaterno: '',
            nombres: ''
        });
        this.form.markAsUntouched;
    }

    Agregar()
    {
        const dialogRef = this.dialog.open(PersonaModalComponent, {
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

    EditarPersona(per: PersonaResponse){
        per.accion = 2;
        const dialogRef = this.dialog.open(PersonaModalComponent, {
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

    EliminarPersona(per: PersonaResponse){
        let modal: Title = { Title: '¿Está seguro de eliminar el registro del personal?'}
        
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
                let request: PersonaRequest = {
                    idPersona: per.idPersona,
                    accion: 3            
                }

                this.saveForm$ = this._configuracionService.GestionarPersona(request)
                .subscribe(result => {
                    setTimeout(() => {
                        dg.close();
                        if(result.success) {  
                            
                            let modal: Title = { 
                                Title: 'Personal Eliminado', 
                                Subtitle: result.message, 
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
                                data: modal
                            });
                        }
                    }, 300);
              });
            }            
          });         
    }

    CrearUsuario(per: PersonaResponse){
        per.accion = 1;
        const dialogRef = this.dialog.open(UsuarioModalComponent, {
            width: '350px',            
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
    
    CambiarPassword(per: PersonaResponse){
        per.accion = 2;
        const dialogRef = this.dialog.open(UsuarioModalComponent, {
            width: '350px',            
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: per,
            scrollStrategy: new NoopScrollStrategy()
        });
    }     

    BloquearUsuario(per: PersonaResponse){
        per.accion = 3;
        this.BloquearDesbloquearUser(per);
    }

    DesbloquearUsuario(per: PersonaResponse){
        per.accion = 4;
        this.BloquearDesbloquearUser(per);
    }

    BloquearDesbloquearUser(per: PersonaResponse)
    {
        let request: UsuarioRequest = {
            accion: per.accion,
            idPersona: per.idPersona
        }

        let modal1: Title = { Title: '¿Está seguro de ' + (request.accion == 3 ? 'bloquear' : 'desbloquear') + ' el usuario?'}
        
        const subDialogModal = this.dialog.open(ModalQuestionComponent, {
            width: '450px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal1,
            scrollStrategy: new NoopScrollStrategy()
        });

        subDialogModal.afterClosed().subscribe(resp => {
            if(resp){
            
                let dg = this.ModalLoading();
                this.saveForm$ = this._configuracionService.GestionarUsuario(request)
                .subscribe(result => {                
                    setTimeout(() => {
                        dg.close();
                        if(result.success)
                        {
                            let modal: Title = { 
                                Title: (request.accion == 3 ? 'Usuario Bloqueado' : 'Usuario Desbloqueado'), 
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
        
                            okModal.afterClosed().subscribe(result => {
                                if(result){
                                    this.buscar();
                                }      
                            });
                        }
                        else
                        {
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

    ListarPersonal(filter: PersonaFilter){

        let loading =  this.ModalLoading();
        this.dataSource = new MatTableDataSource<PersonaResponse>([]);
        this.dataSource.paginator = this.paginator;

        this._configuracionService.ListarPersonal(filter).subscribe({
            next:(Data) => {
                setTimeout(() => {

                    if(Data.success){
                        this.paginator.pageIndex = this.pagina - 1;
                        this.paginator.pageSize = this.registros;
            
                        let previousSize = this.registros * (this.pagina - 1);
                        //fi = Data.data;
                        this.listaPersonal.length = previousSize;
                        this.listaPersonal.push(...Data.data);
                        this.listaPersonal.length = Data.totalRegistros;
                        
                        this.dataSource = new MatTableDataSource<PersonaResponse>(this.listaPersonal);
                        this.dataSource._updateChangeSubscription();
    
                        this.dataSource.paginator = this.paginator;
                    }
          
                    loading.close();

                  }, 300);
            },
            error:(err) => {
                console.log(err);
                loading.close();
            },
        });        
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
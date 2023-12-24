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
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { fnFilterMasterCatalog } from 'src/app/core/shared/function/fnFilterMasterCatalog';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { PersonaModalComponent } from '../personal-usuario/persona-modal/persona-modal.component';
import { TipoCambioFilter, TipoCambioResponse } from 'src/app/intranet/models/tipoCambioResponse';
import { TipoCambioModalComponent } from './tipo-cambio-modal/tipo-cambio-modal.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
  
@Component({
    selector: 'app-tipo-cambio',
    templateUrl: './tipo-cambio.component.html',
    styleUrls: ['./tipo-cambio.component.css']
})
export class TipoCambioComponent implements OnInit, OnDestroy {

    isMobile: boolean = true;
    expanded: boolean = true;
    form: FormGroup;

    listaTipoCambio: TipoCambioResponse[] = [];
    
    public listaPersonal$: Subscription = new Subscription;
    public saveForm$: Subscription = new Subscription;
    
    ListaTipoDocumento: ItemSelect<number>[] = [];

    displayedColumns: string[] = ['Nro', 'FechaInicio', 'FechaFin', 'TCCompra', 'TCVenta', 'Usuario'];

    BreadcrumbForm: Breadcrumb[] = [{ name : "Configuraciones" },{ name : "Tipo de Cambio" }];

    tituloForm: Title = { Title: 'REGISTRO DEL TIPO DE CAMBIO', Subtitle : 'Bandeja que lista el tipo de cambio', Icon : 'assignment', Url: '' };

    dataSource = new MatTableDataSource<TipoCambioResponse>();

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
        this.ListarTipoCambio(filter);
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
        let filter: TipoCambioFilter = {
            Pagina: this.pagina,
            Registros: this.registros,
            // IdTipoDocumento: info.tipodocumento,
            // NumeroDocumento: info.numerodocumento,
            // ApePaterno: info.apellidopaterno,
            // ApeMaterno: info.apellidomaterno,
            // Nombres: info.nombres
        };
        this.ListarTipoCambio(filter);
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

    Agregar(){
        const dialogRef = this.dialog.open(TipoCambioModalComponent, {
            width: '350px',            
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: { idPersona: 0, accion: 1 },
            scrollStrategy: new NoopScrollStrategy()
        });
        
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.buscar();   
            }      
        });
    }

    ListarTipoCambio(filter: TipoCambioFilter){

        let loading =  this.ModalLoading();
        this.dataSource = new MatTableDataSource<TipoCambioResponse>([]);
        this.dataSource.paginator = this.paginator;

        this._configuracionService.ListarTipoCambio(filter).subscribe({
            next:(Data) => {
                setTimeout(() => {

                    if(Data.success){
                        this.paginator.pageIndex = this.pagina - 1;
                        this.paginator.pageSize = this.registros;
            
                        let previousSize = this.registros * (this.pagina - 1);

                        this.listaTipoCambio.length = previousSize;
                        this.listaTipoCambio.push(...Data.data);
                        this.listaTipoCambio.length = Data.totalRegistros;
                        
                        this.dataSource = new MatTableDataSource<TipoCambioResponse>(this.listaTipoCambio);
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
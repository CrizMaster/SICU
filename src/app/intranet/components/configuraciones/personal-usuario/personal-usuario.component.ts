import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PersonaFilter, PersonaResponse } from 'src/app/intranet/models/personaResponse';
import { ConfiguracionService } from '../configuracion.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { MatDialog } from '@angular/material/dialog';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
import { PersonaModalComponent } from './persona-modal/persona-modal.component';
  
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
    
    ListaTipoDocumento: any[] = [
        { value: 1, text: 'DNI'},
        { value: 3, text: 'CE'}
    ];

    displayedColumns: string[] = ['Nro', 'NumeroDoc', 'Personal', 'Cargo', 
    'Celular', 'Correo', 'Accion'];

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
        public dialog: MatDialog
        ){
            this.form = this.fb.group({
                tipodocumento: [0],
                numerodocumento: [''],
                apellidopaterno: [''],
                apellidomaterno: [''],
                nombres: ['']
              });                        
    }

    ngOnInit(): void {
        let filter: PersonaFilter = { Pagina: this.pagina, Registros: this.registros };
        this.ListarPersonal(filter);
    }    

    ngOnDestroy(): void {
        this.listaPersonal$.unsubscribe();
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

    Agregar(){
        //console.log('agregar');
        const dialogRef = this.dialog.open(PersonaModalComponent, {
            width: '600px',            
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: null
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
        //this.loading = true;
        // let pageIndex = event.pageIndex;
        // let pageSize = event.pageSize;
    
        // let previousIndex = event.previousPageIndex;
        // let previousSize = pageSize * pageIndex;
    
        this.pagina = event.pageIndex + 1;
        this.registros = event.pageSize;
    
        this.buscar();
        // this._ordenTrabajoService.listarOrdenesTrabajoxDistrito(this.filter).subscribe({
        //   next:(Data) => {
        //       this.loading = false;
    
        //       Data.data.forEach(elem => {
        //         elem.seleccion = false;
        //         elem.expandir = false;
        //       });
  
        //       this.fi.length = previousSize;
        //       this.fi.push(...Data.data);
        //       this.fi.length = Data.total;
              
        //       this.selection.selected.forEach(sel => {
        //         this.fi.forEach(item => {
        //           if(item.id == sel.id) item.seleccion = true;
        //         });
        //       });
  
        //       this.dataSource = new MatTableDataSource<OrdenTrabajo>(this.fi);
        //       this.dataSource._updateChangeSubscription();
    
        //       this.dataSource.paginator = this.paginator;
        //   }
        // })
      }    


      ModalLoading(): any {     
        let modal: Title = { 
          Title: 'Procesando...'}
        let dgRef = this.dialog.open(ModalLoadingComponent, {
            width: '300px',
            height: '95px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal
        }); 
  
        return dgRef;
      }       

}
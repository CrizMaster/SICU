import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { Subscription } from 'rxjs';
import { FilterCaracterizacion } from 'src/app/intranet/components/formularios/models/caracterizacionResponse';
import { BienesComunesResponse } from 'src/app/intranet/components/formularios/models/bienesComunesResponse';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { OrdenTrabajoService } from '../../../../../orden-trabajo.service';
import { BienesComunesService } from '../bienes-comunes.service';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';

@Component({
    selector: 'app-bandeja-bienes-comunes',
    templateUrl: './bandeja-bienes-comunes.component.html',
    styleUrls: ['./bandeja-bienes-comunes.component.css']
})
export class BandejaBienesComunesComponent implements OnInit, OnDestroy {

    myFormBC: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    readOnly:boolean = true;
    codigoLote: number = 0;
    public caract$: Subscription = new Subscription;

    public generaBC$: Subscription = new Subscription;
    public anularUA$: Subscription = new Subscription;
    public listaEdifica$: Subscription = new Subscription;
    public queryUA$: Subscription = new Subscription;

    displayedColumns: string[] = ['Dpto', 'Prov', 'Dist', 'Sec', 'Mz', 'Lote', 'Edifica', 'Entrada', 'Piso', 'Unidad', 'Accion'];

    dataSource = new MatTableDataSource<BienesComunesResponse>();

    rowSelect: BienesComunesResponse;
    
    filter: FilterCaracterizacion;

    title:string = 'Detalle';

    listaUE:BienesComunesResponse[] = [];
    listaEdificaciones: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];

    constructor(private fb: FormBuilder,
        public subDialog: MatDialog,
        private cd: ChangeDetectorRef,
        private _ordenTrabajoService: OrdenTrabajoService,
        private _bienesComunesService: BienesComunesService
        ){
            this.myFormBC = this.fb.group({
              inicio: [0]
            });

            this.caract$ = this._ordenTrabajoService.getFilterCaracterizacion.subscribe({
              next:(Data) => {
                  this.codigoLote = Data.codigoLote;
              }
            });

        }

    ngOnInit(): void {
        this.listarBienesComunes();
    }   
    
    ngOnDestroy(): void {
      this.queryUA$.unsubscribe();
      this.generaBC$.unsubscribe();
      this.caract$.unsubscribe();
    }

    // ngAfterContentChecked(): void {
    //     this.cd.detectChanges();
    // }

    // onChangeSelEdificaion(newValueSect: string){
    //     this.listarUnidades();     
    // }

    listarBienesComunes(){
      this.queryUA$ = this._bienesComunesService.ConsultaDatosBienesComunes(this.codigoLote)
      .subscribe(Data => {
          if(Data.success){
              this.dataSource = new MatTableDataSource<BienesComunesResponse>(Data.data);
              this.dataSource._updateChangeSubscription();  
          }   
      });  
    }

    generarBienesComunes(){

        let modal1: Title = { Title: '¿Está seguro de generar las unidades de bienes comunes?'}
    
        const subDialogModal = this.subDialog.open(ModalQuestionComponent, {
            width: '450px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal1
        });
    
        subDialogModal.afterClosed().subscribe(resp => {
          if(resp){
            let dg = this.ModalLoading('Procesando su solicitud...');    
            //Cargando datos

            this.generaBC$ = this._bienesComunesService.GeneraBienesComunes(this.codigoLote)
            .subscribe(result => {    
              setTimeout(() => {
                dg.close();       
  
                if(result.success){ 
                  
                  let modal: Title = { 
                    Title: 'Unidades de Bienes Comunes',
                    Subtitle: 'Se generaron las unidades de bienes comunes satisfactoriamente.', 
                    Icon: 'ok' 
                  }
  
                  const okModal = this.subDialog.open(ModalMessageComponent, {
                      width: '500px',
                      enterAnimationDuration: '300ms',
                      exitAnimationDuration: '300ms',
                      disableClose: true,
                      data: modal
                  });
  
                  okModal.afterClosed().subscribe(resp => {
                    if(resp){
                      this.listarBienesComunes();
                    }
                  });
  
                }
                else{
                    let modal: Title = { 
                        Title: 'Opss...', 
                        Subtitle: result.message, 
                        Icon: 'error' }
                      this.subDialog.open(ModalMessageComponent, {
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

    ModalLoading(msn: string): any {     
        let modal: Title = { 
          Title: msn
        }
        let dgRef = this.subDialog.open(ModalLoadingComponent, {
            width: '400px',
            height: '95px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal
        }); 
      
        return dgRef;
      }


    actualizarBC(info: BienesComunesResponse){

        let datos: StatusResponse<BienesComunesResponse> = {
          success: true,
          data: info
        };

        this._bienesComunesService.BienesComunes.next(datos);        
    }

}
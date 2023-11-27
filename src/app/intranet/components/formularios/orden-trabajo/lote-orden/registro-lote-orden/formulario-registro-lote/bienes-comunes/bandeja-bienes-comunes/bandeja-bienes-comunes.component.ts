import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { Subscription } from 'rxjs';
import { EdificacionResponse } from 'src/app/intranet/components/formularios/models/edificacionResponse';
import { FilterCaracterizacion } from 'src/app/intranet/components/formularios/models/caracterizacionResponse';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';
import { BienesComunesResponse } from 'src/app/intranet/components/formularios/models/bienesComunesResponse';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { OrdenTrabajoService } from '../../../../../orden-trabajo.service';
//import { EditarUnidadAdministrativaModalComponent } from '../editar-unidad-administrativa-modal/editar-unidad-administrativa-modal.component';
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

    public updateEdif$: Subscription = new Subscription;
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
        //private _ordenTrabajoService: OrdenTrabajoService,
        private _bienesComunesService: BienesComunesService
        ){
            this.myFormBC = this.fb.group({
              inicio: [0]
            });
        }

    ngOnInit(): void {
        
        // this.listaEdifica$ = this._ordenTrabajoService.listaEdificaciones.subscribe({
        //     next:(Data:EdificacionResponse[]) => {
                
        //         this.listaEdificaciones = [{ value:0, text:'Seleccionar' }];
        //         Data.forEach(elem => {
        //             if(elem.codigoEstado == '02'){
        //                 this.listaEdificaciones.push({
        //                     value: elem.codigoEdificacion, 
        //                     text: elem.numeroEdificacion + ' - ' + elem.nombreEspecifico + ' ' + elem.nombreEdificacion
        //                 });
        //             }                    
        //         });

        //         if(this.listaEdificaciones.length == 2){
        //           setTimeout(() => {
        //             this.myFormBC.patchValue({ 
        //               edificacion: this.listaEdificaciones[1].value
        //             });

        //             this.listarUnidades();
        //           }, 500); 
        //         }
        //     }
        // });
    }   
    
    ngOnDestroy(): void {
      // this.updateEdif$.unsubscribe();
      // this.listaEdifica$.unsubscribe();
      // this.anularUA$.unsubscribe();
      this.queryUA$.unsubscribe();
    }

    // ngAfterContentChecked(): void {
    //     this.cd.detectChanges();
    // }

    // onChangeSelEdificaion(newValueSect: string){
    //     this.listarUnidades();     
    // }

    listarBienesComunes(){
      this.queryUA$ = this._bienesComunesService.ConsultaDatosBienesComunes(0)
      .subscribe(Data => {
          if(Data.success){
              this.dataSource = new MatTableDataSource<BienesComunesResponse>(Data.data);
              this.dataSource._updateChangeSubscription();  
          }   
      });  
    }

    // VerUnidad(data: BienesComunesResponse){
    //     this.rowSelect = data;        
    // }

    // modalUnidadAdministrativa(data: UnidadAdministrativaResponse){
    //     const dialogRef = this.subDialog.open(EditarUnidadAdministrativaModalComponent, {
    //         width: '650px',            
    //         enterAnimationDuration: '300ms',
    //         exitAnimationDuration: '300ms',
    //         disableClose: true,
    //         data: data
    //     });

    //     dialogRef.afterClosed().subscribe(resp => {
    //         if(resp){

    //             let info = this.myFormUnidad.value;
    //             let id = parseInt(info.edificacion);
    //             resp.codigoEdificacion = id;

    //             let dg = this.ModalLoading();
    //             this.updateEdif$ = this._bienesComunesService.GuardaDatosUnidadAdministrativa(resp)
    //             .subscribe(result => {    
    //               setTimeout(() => {
    //                 dg.close();
    //                 if(result.success){ 
    //                   let modal: Title = { 
    //                     Title:  (resp.codigoUnidadAdministrativa == 0 ? 'Nueva Unidad Administrativa'
    //                             : 'Unidad Administrativa Actualizada'), 
    //                     Subtitle: 'La Unidad Administativa se ' + 
    //                               (resp.codigoUnidadAdministrativa == 0 ? 'registró':'actualizó')
    //                               + ' satisfactoriamente.', 
    //                     Icon: 'ok' 
    //                   }
    
    //                   const okModal = this.subDialog.open(ModalMessageComponent, {
    //                       width: '500px',
    //                       enterAnimationDuration: '300ms',
    //                       exitAnimationDuration: '300ms',
    //                       disableClose: true,
    //                       data: modal
    //                   });
    
    //                   okModal.afterClosed().subscribe(resp => {
    //                     if(resp){
    //                         this.listarUnidades();
    //                       }
    //                   });
    
    //                 }
    //                 else{
    //                     let modal: Title = { 
    //                         Title: 'Opss...', 
    //                         Subtitle: result.message, 
    //                         Icon: 'error' }
    //                       this.subDialog.open(ModalMessageComponent, {
    //                           width: '500px',
    //                           enterAnimationDuration: '300ms',
    //                           exitAnimationDuration: '300ms',
    //                           disableClose: true,
    //                           data: modal
    //                       });
    //                 }              
    //               }, 500);
    //             });                
    //         }            
    //       });
    // }

    generarBienesComunes(){
        //let data: UnidadAdministrativaResponse = { codigoUnidadAdministrativa: 0 };
        //this.modalUnidadAdministrativa(data);

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
            setTimeout(() => {
              dg.close();    
              this.listarBienesComunes();    
            }, 1000);         
            
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

    // editUnidadAdmin(data: UnidadAdministrativaResponse){
    //     this.modalUnidadAdministrativa(data);
    // }
    
    // AnularUnidadAdmin(dato: UnidadAdministrativaResponse){
    //     let modal: Title = { Title: '¿Está seguro de eliminar la unidad administrativa ' + dato.numeroUnidadAdministrativa + ' ?', Subtitle: '', Icon: '' }
    //     const dialogAnularOrden = this.subDialog.open(ModalQuestionComponent, {
    //         width: '450px',
    //         enterAnimationDuration: '300ms',
    //         exitAnimationDuration: '300ms',
    //         disableClose: true,
    //         data: modal
    //     });
  
    //     dialogAnularOrden.afterClosed().subscribe((result:boolean) => {
    //       if(result){
    //         let mLoading = this.ModalLoading();
  
    //         this.anularUA$ = this._bienesComunesService.EliminarUnidadAdministrativa(dato.codigoUnidadAdministrativa)
    //         .subscribe(result => {    
    //           setTimeout(() => {
    //             mLoading.close();       
  
    //             if(result.success){ 
                  
    //               let modal: Title = { 
    //                 Title: 'Unidad Administrativa Eliminada',
    //                 Subtitle: 'La Unidad administrativa ' + dato.numeroUnidadAdministrativa + ' se eliminó satisfactoriamente.', 
    //                 Icon: 'ok' 
    //               }
  
    //               const okModal = this.subDialog.open(ModalMessageComponent, {
    //                   width: '500px',
    //                   enterAnimationDuration: '300ms',
    //                   exitAnimationDuration: '300ms',
    //                   disableClose: true,
    //                   data: modal
    //               });
  
    //               okModal.afterClosed().subscribe(resp => {
    //                 if(resp){
    //                   this.listarBienesComunes();
    //                 }
    //               });
  
    //             }
    //             else{
    //                 let modal: Title = { 
    //                     Title: 'Opss...', 
    //                     Subtitle: result.message, 
    //                     Icon: 'error' }
    //                   this.subDialog.open(ModalMessageComponent, {
    //                       width: '500px',
    //                       enterAnimationDuration: '300ms',
    //                       exitAnimationDuration: '300ms',
    //                       disableClose: true,
    //                       data: modal
    //                   });
    //             }              
    //           }, 500);
    //         });
  
    //       }            
    //     });
    // }

    actualizarBC(info: BienesComunesResponse){

        let datos: StatusResponse<BienesComunesResponse> = {
          success: true,
          data: info
        };

        this._bienesComunesService.BienesComunes.next(datos);        
    }

    // ModalLoading(): any {     
    //     let modal: Title = { 
    //       Title: 'Procesando su solicitud...'}
    //     let dgRef = this.subDialog.open(ModalLoadingComponent, {
    //         width: '400px',
    //         height: '95px',
    //         enterAnimationDuration: '300ms',
    //         exitAnimationDuration: '300ms',
    //         disableClose: true,
    //         data: modal
    //     }); 
  
    //     return dgRef;
    // }

}
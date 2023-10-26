import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { OrdenTrabajoService } from '../../../../../orden-trabajo.service';
import { EditarUnidadAdministrativaModalComponent } from '../editar-unidad-administrativa-modal/editar-unidad-administrativa-modal.component';
import { UnidadAdministrativaService } from '../unidad-administrativa.service';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';

@Component({
    selector: 'app-bandeja-unidad-administrativa',
    templateUrl: './bandeja-unidad-administrativa.component.html',
    styleUrls: ['./bandeja-unidad-administrativa.component.css']
})
export class BandejaUnidadAdministrativaComponent implements OnInit, OnDestroy {

    myFormUnidad: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    readOnly:boolean = true;
    //public saveForm$: Subscription = new Subscription;
    //public listEdific$: Subscription = new Subscription;
    public updateEdif$: Subscription = new Subscription;
    public anularUA$: Subscription = new Subscription;
    
    displayedColumns: string[] = ['Dpto', 'Prov', 'Dist', 'Sec', 'Mz', 'Lote', 'Edifica', 'Entrada', 'Piso', 'Unidad', 'seleccion'];

    dataSource = new MatTableDataSource<UnidadAdministrativaResponse>();

    rowSelect: UnidadAdministrativaResponse;
    
    filter: FilterCaracterizacion;

    title:string = 'Detalle';

    public listaEdifica$: Subscription = new Subscription;

    listaUE:UnidadAdministrativaResponse[] = [];
    listaEdificaciones: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];

    constructor(private fb: FormBuilder,
        public subDialog: MatDialog,
        private _ordenTrabajoService: OrdenTrabajoService,
        private _unidadAdministrativaService: UnidadAdministrativaService
        ){

        this.myFormUnidad = this.fb.group({
            edificacion: [0]
          });        
    }

    ngOnInit(): void {
        this.listaEdifica$ = this._ordenTrabajoService.listaEdificaciones.subscribe({
            next:(Data:EdificacionResponse[]) => {
                
                this.listaEdificaciones = [{ value:0, text:'Seleccionar' }];
                Data.forEach(elem => {
                    if(elem.codigoEstado == '02'){
                        this.listaEdificaciones.push({
                            value: elem.codigoEdificacion, 
                            text: elem.numeroEdificacion + ' - ' + elem.nombreEspecifico + ' ' + elem.nombreEdificacion
                        });
                    }                    
                  });
            }
        });
    }   
    
    onChangeSelEdificaion(newValueSect: string){
        this.listarUnidades();     
    }

    listarUnidades(){
        let info = this.myFormUnidad.value;
        if(info.edificacion != 0){
            this._unidadAdministrativaService.ConsultaDatosUnidadAdministrativa(info.edificacion)
            .subscribe(Data => {
                if(Data.success){
                    this.dataSource = new MatTableDataSource<UnidadAdministrativaResponse>(Data.data);
                    this.dataSource._updateChangeSubscription();  
                }   
            });  
        } 
    }

    ngOnDestroy(): void {
        this.updateEdif$.unsubscribe();
        this.listaEdifica$.unsubscribe();
        this.anularUA$.unsubscribe();
    }

    VerUnidad(data: UnidadAdministrativaResponse){
        this.rowSelect = data;        
    }

    modalUnidadAdministrativa(data: UnidadAdministrativaResponse){
        const dialogRef = this.subDialog.open(EditarUnidadAdministrativaModalComponent, {
            width: '650px',            
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: data
        });

        dialogRef.afterClosed().subscribe(resp => {
            if(resp){

                let info = this.myFormUnidad.value;
                let id = parseInt(info.edificacion);
                resp.codigoEdificacion = id;

                let dg = this.ModalLoading();
                this.updateEdif$ = this._unidadAdministrativaService.GuardaDatosUnidadAdministrativa(resp)
                .subscribe(result => {    
                  setTimeout(() => {
                    dg.close();
                    if(result.success){ 
                      let modal: Title = { 
                        Title:  'Nueva Unidad Administrativa', 
                        Subtitle: 'Nueva Unidad Administativa se registro satisfactoriamente.', 
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
                            this.listarUnidades();
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

    generarUnidadAdmin(){
        let data: UnidadAdministrativaResponse = { codigoUnidadAdministrativa: 0 };
        this.modalUnidadAdministrativa(data);
    } 

    editUnidadAdmin(data: UnidadAdministrativaResponse){
        this.modalUnidadAdministrativa(data);
    }
    
    AnularUnidadAdmin(dato: UnidadAdministrativaResponse){
        let modal: Title = { Title: '¿Está seguro de eliminar la unidad administrativa ' + dato.numeroUnidadAdministrativa + ' ?', Subtitle: '', Icon: '' }
        const dialogAnularOrden = this.subDialog.open(ModalQuestionComponent, {
            width: '450px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal
        });
  
        dialogAnularOrden.afterClosed().subscribe((result:boolean) => {
          if(result){
            let mLoading = this.ModalLoading();
  
            this.anularUA$ = this._unidadAdministrativaService.EliminarUnidadAdministrativa(dato.codigoUnidadAdministrativa)
            .subscribe(result => {    
              setTimeout(() => {
                mLoading.close();       
  
                if(result.success){ 
                  
                  let modal: Title = { 
                    Title: 'Unidad Administrativa Eliminada',
                    Subtitle: 'La Unidad administrativa ' + dato.numeroUnidadAdministrativa + ' se eliminó satisfactoriamente.', 
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
                      this.listarUnidades();
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

    vincularUnidadAdmin(info: UnidadAdministrativaResponse){

        let datos: StatusResponse<UnidadAdministrativaResponse> = {
          success: true,
          data: info
        };

        this._unidadAdministrativaService.UnidadAdministrativa.next(datos);        
    }

    guardar(){

    }

    ModalLoading(): any {     
        let modal: Title = { 
          Title: 'Procesando su solicitud...'}
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

}
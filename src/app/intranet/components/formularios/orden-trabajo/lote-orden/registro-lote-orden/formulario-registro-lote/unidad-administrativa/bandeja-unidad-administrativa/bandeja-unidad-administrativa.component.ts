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
    btnGenerarUA: boolean = false;

    public updateEdif$: Subscription = new Subscription;
    public anularUA$: Subscription = new Subscription;
    public listaEdifica$: Subscription = new Subscription;
    public queryUA$: Subscription = new Subscription;

    displayedColumns: string[] = ['Dpto', 'Prov', 'Dist', 'Sec', 'Mz', 'Lote', 'Edifica', 'Entrada', 'Piso', 'Unidad', 'Estado', 'seleccion'];

    dataSource = new MatTableDataSource<UnidadAdministrativaResponse>();

    rowSelect: UnidadAdministrativaResponse;
    
    filter: FilterCaracterizacion;

    title:string = 'Detalle';

    

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
                    if(elem.codigoEstado != '01'){
                        this.listaEdificaciones.push({
                            value: elem.codigoEdificacion, 
                            text: elem.numeroEdificacion + ' - ' + elem.nombreEspecifico + ' ' + elem.nombreEdificacion,
                            code: elem.codigoEstado
                        });
                    }                    
                });

                if(this.listaEdificaciones.length == 2){
                  setTimeout(() => {
                    this.myFormUnidad.patchValue({ 
                      edificacion: this.listaEdificaciones[1].value
                    });
                    this.onChangeSelEdificaion(this.listaEdificaciones[1].value.toString());
                    //this.listarUnidades();
                  }, 500); 
                }
            }
        });
    }   
    
    ngOnDestroy(): void {
      this.updateEdif$.unsubscribe();
      this.listaEdifica$.unsubscribe();
      this.anularUA$.unsubscribe();
      this.queryUA$.unsubscribe();
    }

    onChangeSelEdificaion(newValueSect: string){
        let id = parseInt(newValueSect);
        this.btnGenerarUA = false;
        if(id != 0){
          this.btnGenerarUA = true;
          this.listaEdificaciones.forEach(el => {
            if(el.value == parseInt(newValueSect)){
              this.btnGenerarUA = el.code != '03';
            }
          });
  
          this.listarUnidades(); 
        }    
    }

    listarUnidades(){
      this.dataSource = new MatTableDataSource<UnidadAdministrativaResponse>([]);
      this.dataSource._updateChangeSubscription();

        let info = this.myFormUnidad.value;
        if(info.edificacion != 0){
            this.queryUA$ = this._unidadAdministrativaService.ConsultaDatosUnidadAdministrativa(info.edificacion)
            .subscribe(Data => {
                if(Data.success){
                    this.dataSource = new MatTableDataSource<UnidadAdministrativaResponse>(Data.data);
                    this.dataSource._updateChangeSubscription();  
                }   
            });  
        } 
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
                        Title:  (resp.codigoUnidadAdministrativa == 0 ? 'Nueva Unidad Administrativa'
                                : 'Unidad Administrativa Actualizada'), 
                        Subtitle: 'La Unidad Administativa se ' + 
                                  (resp.codigoUnidadAdministrativa == 0 ? 'registró':'actualizó')
                                  + ' satisfactoriamente.', 
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
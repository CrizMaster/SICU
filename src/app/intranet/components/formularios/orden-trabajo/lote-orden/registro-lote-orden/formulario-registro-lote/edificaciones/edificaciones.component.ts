import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { OrdenTrabajo } from 'src/app/intranet/components/asignacion-carga/models/ordenTrabajo.model';
import { EdificacionFilter, EdificacionLoteRequest, EdificacionRequest } from 'src/app/intranet/components/formularios/models/edificacionRequest';
import { OrdenTrabajoService } from '../../../../orden-trabajo.service';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { Subscription } from 'rxjs';
import { EdificacionResponse } from 'src/app/intranet/components/formularios/models/edificacionResponse';
import { EditarEdificacionModalComponent } from './editar-edificacion-modal/editar-edificacion-modal.component';
import { FilterCaracterizacion } from 'src/app/intranet/components/formularios/models/caracterizacionResponse';
import { MatStepper } from '@angular/material/stepper';
  
@Component({
    selector: 'app-edificaciones',
    templateUrl: './edificaciones.component.html',
    styleUrls: ['./edificaciones.component.css']
})
export class EdificacionesComponent implements OnInit{

    @Input() Stepper: MatStepper;
    
    myFormEdif: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    readOnly:boolean = true;
    public saveForm$: Subscription = new Subscription;
    public listEdific$: Subscription = new Subscription;
    public updateEdif$: Subscription = new Subscription;
    
    displayedColumns: string[] = ['Dpto', 'Prov', 'Dist', 'Sec', 'Mz', 'Lote', 'Edifica', 'TotalLotes', 'NroOrden', 'Estado', 'seleccion'];

    dataSource = new MatTableDataSource<EdificacionResponse>();
    
    filter: FilterCaracterizacion;

    constructor(private fb: FormBuilder,
        public subDialog: MatDialog,
        private _ordenTrabajoService: OrdenTrabajoService){

        this._ordenTrabajoService.getFilterCaracterizacion.subscribe({
            next:(Data) => {
                this.filter = Data;
                this.listarEdificaciones();
            }
        });

        this.myFormEdif = this.fb.group({
            numeroEdificaciones: [0],
            // codigoLotePropuesta: [{value: '', disabled : true}, Validators.required],
            // habilitacionUrbana: [{value: '', disabled : true}, Validators.required],
            // tipoDivisionHabilitacion: [{value: '', disabled : true}, Validators.required],
            // numeroDivision: [{value: '', disabled : true}, Validators.required],
            // manzanaUrbana: [{value: '', disabled : true}, Validators.required],
            // loteUrbano: [{value: '', disabled : true}, Validators.required],
            // subLote: [{value: '', disabled : true}, Validators.required],
            // checked: [false],
            // vias: this.fb.array([],[Validators.required])
          });        
    }

    ngOnInit(): void {
        
    }    

    ngOnDestroy(): void {
        this.saveForm$.unsubscribe();
        this.listEdific$.unsubscribe();
        this.updateEdif$.unsubscribe();
    }

    ctrlNumeroEdificacion(val: number){
        let info = this.myFormEdif.value;
        let nro = parseInt(info.numeroEdificaciones) + val;
        if(nro < 0) nro = 0;
        this.myFormEdif.patchValue({ 
            numeroEdificaciones: nro
        });
    }

    listarEdificaciones(){
        let filter: EdificacionFilter = { codigoLote: this.filter.codigoLote, ind: 1 };

        this.listEdific$ = this._ordenTrabajoService.ConsultaEdicacionesLote(filter)
        .subscribe(Data => {
            let info = Data.data;      

            this.dataSource = new MatTableDataSource<EdificacionResponse>(info);
            this.dataSource._updateChangeSubscription();            
        });
    }

    generarEdificaciones(){
        let info = this.myFormEdif.value;

        let request: EdificacionLoteRequest = {
            usuarioCreacion: 'carevalo',
            terminalCreacion: '127.0.0.1',
            codigoLote: this.filter.codigoLote,
            numeroEdificaciones: info.numeroEdificaciones
        };
        let te = request.numeroEdificaciones;
        let nro: string = (te == 1 ? 'una edificación' : te.toString() + ' edificaciones')
        let modal1: Title = { Title: '¿Está seguro de generar ' + nro }
        
        const subDialogModal = this.subDialog.open(ModalQuestionComponent, {
            width: '450px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal1
        });

        subDialogModal.afterClosed().subscribe(resp => {
            if(resp){
              let dg = this.ModalLoading();
  
              this.saveForm$ = this._ordenTrabajoService.GenerarLoteEdificaciones(request)
              .subscribe(result => {    
                setTimeout(() => {
                  dg.close();
                  if(result.success){ 
                    let modal: Title = { 
                      Title: 'Nuevas Edificaciones', 
                      Subtitle: 'La generación de las edificaciones se realizó satisfactoriamente.', 
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
                        this.listarEdificaciones();
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

    EditarEdificacion(row: EdificacionResponse){
        const dialogRef = this.subDialog.open(EditarEdificacionModalComponent, {
            width: '500px',            
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: row
        });

        dialogRef.afterClosed().subscribe(resp => {
            if(resp){
                let dg = this.ModalLoading();
                this.updateEdif$ = this._ordenTrabajoService.ActualizaDatosEdificacion(resp)
                .subscribe(result => {    
                  setTimeout(() => {
                    dg.close();
                    if(result.success){ 
                      let modal: Title = { 
                        Title: 'Edificación Actualizada', 
                        Subtitle: 'La edificación se actualizó satisfactoriamente.', 
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
                          this.listarEdificaciones();
                      });
    
                      this.Stepper.next();
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
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';
import { OtraInstalacionModalComponent } from '../otra-instalacion-modal/otra-instalacion-modal.component';
import { ObrasComplementariasRequest, ObrasComplementariasResponse } from 'src/app/intranet/components/formularios/models/obrasComplementariasRequest';
import { Title } from 'src/app/core/models/title.model';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { Subscription } from 'rxjs';
import { UnidadAdministrativaService } from '../../unidad-administrativa.service';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';

@Component({
  selector: 'app-otras-instalaciones',
  templateUrl: './otras-instalaciones.component.html',
  styleUrls: ['./otras-instalaciones.component.css']
})
export class OtrasInstalacionesComponent implements OnInit, OnDestroy  {
  displayedColumns: string[] = ['Nro', 'Codigo', 'Descripcion', 'MesAnio', 'MEP', 'ECS', 'ECC', 
  'ProductoTotal', 'UnidadMedida', 'UCA', 'Accion'];

  codigoUnidadAdministrativa: number = 0;
  lista: ObrasComplementariasResponse[] = [];
  dataSource = new MatTableDataSource<ObrasComplementariasResponse>();

  public saveForm$: Subscription = new Subscription;
  public consCons$: Subscription = new Subscription;
  
  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _unidadAdministrativaService: UnidadAdministrativaService
    ){  
      this._unidadAdministrativaService.UnidadAdministrativa.subscribe({
        next:(Data:StatusResponse<UnidadAdministrativaResponse>) => {            
            this.codigoUnidadAdministrativa = Data.data.codigoUnidadAdministrativa;
        }
      });        
  } 

  ngOnInit(): void {
    this.consCons$ = this._unidadAdministrativaService.ConsultaObrasInstalaciones(this.codigoUnidadAdministrativa).subscribe({
      next:(result: StatusResponse<ObrasComplementariasResponse[]>) => {
        if(result.success){
          this.lista = result.data;
          this.lista.forEach(el => {
            el.codigoOtrasInstalaciones =  el.codigoOtrasInstalaciones
          });

          this.dataSource = new MatTableDataSource<ObrasComplementariasResponse>(this.lista);
        }       
      }
    });    
  }

  ngOnDestroy(): void {
    this.saveForm$.unsubscribe();
  }

  ObraComplementariaModal(data: ObrasComplementariasResponse):void {

    const dialog = this.dialog.open(OtraInstalacionModalComponent, {
        width: '760px',
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        disableClose: true,
        data: data
    });

    dialog.afterClosed().subscribe((result:any) => {
      if(result.success){

        if(result.datos.codigoOtrasInstalaciones == 0){
          if(this.lista.length > 0){
            const max = this.lista.reduce(function(prev, current) {
                return (prev.codigoOtrasInstalaciones > current.codigoOtrasInstalaciones) ? prev : current
            })
            result.datos.codigoOtrasInstalaciones = max.codigoOtrasInstalaciones + 1;
          }
          else{ result.datos.codigoOtrasInstalaciones = 1; }
  
          this.lista.push(result.datos);
        }
        else{
          let newLista:ObrasComplementariasResponse[] = [];
          newLista = this.lista;
          this.lista = [];

          newLista.forEach(el => {
            if(el.codigoOtrasInstalaciones == result.datos.codigoOtrasInstalaciones) this.lista.push(result.datos);
            else this.lista.push(el);
          });
        }

        this.dataSource = new MatTableDataSource<ObrasComplementariasResponse>(this.lista);
      }            
    });
  }

  AgregarObra(){
    this.ObraComplementariaModal({ codigoOtrasInstalaciones: 0});
  }

  EditarObra(data: any, i: number){
    data.nro = i + 1;
    this.ObraComplementariaModal(data);
  }

  AnularObra(data: any){
    let newLista:ObrasComplementariasResponse[] = [];
    newLista = this.lista;
    this.lista = [];
          
    newLista.forEach(el => {
      if(el.codigoOtrasInstalaciones != data.codigoOtrasInstalaciones) this.lista.push(el);
    });
  
    this.dataSource = new MatTableDataSource<ObrasComplementariasResponse>(this.lista);
  }

  GuardarObrasComplementarias(){
    let modal1: Title = { Title: '¿Está seguro de actualizar las obras e instalaciones?'}
        
    const subDialogModal = this.dialog.open(ModalQuestionComponent, {
        width: '450px',
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        disableClose: true,
        data: modal1
    });

    subDialogModal.afterClosed().subscribe(resp => {
      if(resp){
        let dg = this.ModalLoading();

        let datos: ObrasComplementariasRequest = {
          usuarioCreacion: 'carevalo',
          terminalCreacion: '',
          usuarioModificacion: 'carevalo',
          terminalModificacion: '',
          codigoUnidadAdministrativa: this.codigoUnidadAdministrativa,
          listaObrasComplementarias: this.lista
        };

        this.saveForm$ = this._unidadAdministrativaService.GuardarObrasInstalaciones(datos)
         .subscribe(result => {    
          setTimeout(() => {
            dg.close();
            if(result.success) {

              let modal: Title = { 
                Title: 'Obras e Instalaciones Actualizadas', 
                Subtitle: 'La información de las obras e instalaciones se actualizaron satisfactoriamente.', 
                Icon: 'ok' 
              }

              const okModal = this.dialog.open(ModalMessageComponent, {
                  width: '500px',
                  enterAnimationDuration: '300ms',
                  exitAnimationDuration: '300ms',
                  disableClose: true,
                  data: modal
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
}

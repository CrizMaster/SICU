import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConstruccionModalComponent } from '../construccion-modal/construccion-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { ConstruccionResponse, ConstruccionesRequest } from 'src/app/intranet/components/formularios/models/construccionesRequest';
import { Title } from 'src/app/core/models/title.model';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { UnidadAdministrativaService } from '../../unidad-administrativa.service';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { Subscription } from 'rxjs';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';

@Component({
  selector: 'app-construcciones',
  templateUrl: './construcciones.component.html',
  styleUrls: ['./construcciones.component.css']
})
export class ConstruccionesComponent implements OnInit, OnDestroy  {
  index: number = 1;
  displayedColumns: string[] = ['Nro', 'Piso', 'MesAnio', 'MEP', 'ECS', 'ECC', 
  'MurosColumnas', 'Techo', 'PuertasVentanas', 'CIIU', 'UCA', 'Accion'];

  codigoUnidadAdministrativa: number = 0;
  lista: ConstruccionResponse[] = [];
  habilitar: boolean = true;

  public saveForm$: Subscription = new Subscription;
  public consCons$: Subscription = new Subscription;

  dataSource = new MatTableDataSource<ConstruccionResponse>();

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _unidadAdministrativaService: UnidadAdministrativaService){

      this._unidadAdministrativaService.UnidadAdministrativa.subscribe({
        next:(Data:StatusResponse<UnidadAdministrativaResponse>) => {   
          if(Data != undefined && Data.data != undefined){
            this.codigoUnidadAdministrativa = Data.data.codigoUnidadAdministrativa;
            this.habilitar = Data.data.codigoEstado != '03';
          }
        }
      });      
      
  }  

  ngOnInit(): void {
    this.consCons$ = this._unidadAdministrativaService.ConsultaConstrucciones(this.codigoUnidadAdministrativa).subscribe({
      next:(result: StatusResponse<ConstruccionResponse[]>) => {
        if(result.success){
          this.lista = result.data;
          this.lista.forEach(el => {
            el.codigoConstruccion =  el.codigoConstruccion
          });

          this.dataSource = new MatTableDataSource<ConstruccionResponse>(this.lista);
        }       
      }
    });
  }

  ngOnDestroy(): void {
    this.saveForm$.unsubscribe();
    this.consCons$.unsubscribe();
  }

  ConstruccionModal(data: ConstruccionResponse):void {
    data.habilitar = this.habilitar;
    const dialog = this.dialog.open(ConstruccionModalComponent, {
        width: '760px',
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        disableClose: true,
        data: data
    });

    dialog.afterClosed().subscribe((result:any) => {
      if(result.success){

        if(result.datos.codigoConstruccion == 0){
          if(this.lista.length > 0){
            const max = this.lista.reduce(function(prev, current) {
                return (prev.codigoConstruccion > current.codigoConstruccion) ? prev : current
            })
            result.datos.codigoConstruccion = max.codigoConstruccion + 1;
          }
          else{ result.datos.codigoConstruccion = 1; }
  
          this.lista.push(result.datos);
        }
        else{
          let newLista:ConstruccionResponse[] = [];
          newLista = this.lista;
          this.lista = [];

          newLista.forEach(el => {
            if(el.codigoConstruccion == result.datos.codigoConstruccion) this.lista.push(result.datos);
            else this.lista.push(el);
          });
        }

        this.dataSource = new MatTableDataSource<ConstruccionResponse>(this.lista);
      }            
    });
  }

  AgregarConstruccion(){
      this.ConstruccionModal({ codigoConstruccion: 0});
  }

  EditarConstruccion(data: any, i: number){
    data.nro = i + 1;
    this.ConstruccionModal(data);
  }

  AnularConstruccion(data: any){
    let newLista:ConstruccionResponse[] = [];
    newLista = this.lista;
    this.lista = [];
          
    newLista.forEach(el => {
      if(el.codigoConstruccion != data.codigoConstruccion) this.lista.push(el);
    });

    this.dataSource = new MatTableDataSource<ConstruccionResponse>(this.lista);
  }

  GuardarConstrucciones(){
    let modal1: Title = { Title: '¿Está seguro de actualizar las construcciones?'}
        
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

        let datos: ConstruccionesRequest = {
          usuarioCreacion: 'carevalo',
          terminalCreacion: '',
          usuarioModificacion: 'carevalo',
          terminalModificacion: '',
          codigoUnidadAdministrativa: this.codigoUnidadAdministrativa,
          listaConstrucciones: this.lista
        };

        this.saveForm$ = this._unidadAdministrativaService.GuardarConstrucciones(datos)
         .subscribe(result => {    
          setTimeout(() => {
            dg.close();
            if(result.success) {

              let modal: Title = { 
                Title: 'Construcciones Actualizadas', 
                Subtitle: 'La información de las construcciones se actualizó satisfactoriamente.', 
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

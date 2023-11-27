import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ObrasComplementariasResponse } from 'src/app/intranet/components/formularios/models/obrasComplementariasRequest';
import { OtraInstalacionBcModalComponent } from '../otra-instalacion-modal/otra-instalacion-bc-modal.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { Title } from 'src/app/core/models/title.model';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';

@Component({
    selector: 'app-otras-instalaciones-bc',
    templateUrl: './otras-instalaciones-bc.component.html',
    styleUrls: ['./otras-instalaciones-bc.component.css']
})
export class OtrasInstalacionesBcComponent implements OnInit {

    displayedColumns: string[] = ['Nro', 'Codigo', 'Descripcion', 'MesAnio', 'MEP', 'ECS', 'ECC', 
    'ProductoTotal', 'UnidadMedida', 'UCA', 'Accion'];
  
    codigoUnidadAdministrativa: number = 0;
    lista: ObrasComplementariasResponse[] = [];
    dataSource = new MatTableDataSource<ObrasComplementariasResponse>();
  
    public saveForm$: Subscription = new Subscription;
    public consCons$: Subscription = new Subscription;
    
    constructor(
        private route: Router,
        private _activatedRoute:ActivatedRoute,
        public dialog: MatDialog
    ){

    }

    ngOnInit(): void {
    }

    ObraComplementariaModal(data: ObrasComplementariasResponse):void {

        const dialog = this.dialog.open(OtraInstalacionBcModalComponent, {
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

    GuardarOtrasInstalaciones(){
        let modal1: Title = { Title: '¿Está seguro de actualizar las obras e instalaciones?'}
            
        const subDialogModal = this.dialog.open(ModalQuestionComponent, {
            width: '450px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal1
        });
    
        // subDialogModal.afterClosed().subscribe(resp => {
        //   if(resp){
        //     let dg = this.ModalLoading();
    
        //     let datos: ObrasComplementariasRequest = {
        //       usuarioCreacion: 'carevalo',
        //       terminalCreacion: '',
        //       usuarioModificacion: 'carevalo',
        //       terminalModificacion: '',
        //       codigoUnidadAdministrativa: this.codigoUnidadAdministrativa,
        //       listaObrasComplementarias: this.lista
        //     };
    
        //     this.saveForm$ = this._unidadAdministrativaService.GuardarObrasInstalaciones(datos)
        //      .subscribe(result => {    
        //       setTimeout(() => {
        //         dg.close();
        //         if(result.success) {
    
        //           let modal: Title = { 
        //             Title: 'Obras e Instalaciones Actualizadas', 
        //             Subtitle: 'La información de las obras e instalaciones se actualizaron satisfactoriamente.', 
        //             Icon: 'ok' 
        //           }
    
        //           const okModal = this.dialog.open(ModalMessageComponent, {
        //               width: '500px',
        //               enterAnimationDuration: '300ms',
        //               exitAnimationDuration: '300ms',
        //               disableClose: true,
        //               data: modal
        //           });
    
        //         }
        //         else{
        //             let modal: Title = { 
        //                 Title: 'Opss...', 
        //                 Subtitle: result.message, 
        //                 Icon: 'error' }
        //               this.dialog.open(ModalMessageComponent, {
        //                   width: '500px',
        //                   enterAnimationDuration: '300ms',
        //                   exitAnimationDuration: '300ms',
        //                   disableClose: true,
        //                   data: modal
        //               });
        //         }              
        //       }, 500);
        //     });
        //   }            
        // });
    
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
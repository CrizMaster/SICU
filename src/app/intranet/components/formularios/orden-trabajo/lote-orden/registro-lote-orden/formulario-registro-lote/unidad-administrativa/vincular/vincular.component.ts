import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';
import { UnidadAdministrativaService } from '../unidad-administrativa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DireccionResponse } from 'src/app/intranet/components/formularios/models/armonizacionModel';
import { Title } from 'src/app/core/models/title.model';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';

@Component({
    selector: 'app-vincular',
    templateUrl: './vincular.component.html',
    styleUrls: ['./vincular.component.css']
})
export class VincularComponent implements OnInit, OnDestroy {

    index: number = 1;
    displayedColumns: string[] = ['Dpto', 'Prov', 'Dist', 'Sec', 'Mz', 'Lote', 
    'Edifica', 'Entrada', 'Piso', 'Unidad', 'Estado', 'accion'];

    dataSource = new MatTableDataSource<UnidadAdministrativaResponse>();

    public saveForm$: Subscription = new Subscription;
    
    constructor(
        private _unidadAdministrativaService: UnidadAdministrativaService,
        private route: Router,
        private _activatedRoute:ActivatedRoute,
        public subDialog: MatDialog
    ){
        this._unidadAdministrativaService.UnidadAdministrativa.subscribe({
            next:(Data:StatusResponse<UnidadAdministrativaResponse>) => {
                let lista:UnidadAdministrativaResponse[] = [];
                lista.push(Data.data);
                this.dataSource = new MatTableDataSource<UnidadAdministrativaResponse>(lista);
                this.dataSource._updateChangeSubscription();                  
            }
        }); 
        
        this._unidadAdministrativaService.InfoArmonizacion.subscribe({
            next:(Data:DireccionResponse) => {
                this.getIndex(Data.index);
            }
        }); 
    }

    ngOnInit(): void {
        this.getIndex(1);
    }

    ngOnDestroy(): void {
        this.saveForm$.unsubscribe();
    }

    TerminarUnidadAdmin(row: UnidadAdministrativaResponse){
        let modal1: Title = { Title: '¿Está seguro de terminar la unidad administrativa?' }
        
        const sdm = this.subDialog.open(ModalQuestionComponent, {
            width: '450px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal1
        });

        sdm.afterClosed().subscribe(resp => {
            if(resp){
              let dg = this.ModalLoading();
  
              this.saveForm$ = this._unidadAdministrativaService.CierraUnidadAdministrativa(row.codigoUnidadAdministrativa)
              .subscribe(result => {    
                setTimeout(() => {
                    dg.close();
                
                    if(result.success){ 
                        let modal: Title = { 
                            Title: 'Unidad Administrativa Terminada', 
                            Subtitle: 'La unidad administrativa se terminó satisfactoriamente.', 
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
                            this.regresar();
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

    getIndex(ind: number){
        this.index = ind;
        switch(ind){
            case 1: this.route.navigate(['vincular'], { relativeTo: this._activatedRoute })
                    break;
            case 2: this.route.navigate(['titularidad'], { relativeTo: this._activatedRoute })
                    break;
            case 3: this.route.navigate(['unidad'], { relativeTo: this._activatedRoute })
                    break;
            case 4: this.route.navigate(['construcciones'], { relativeTo: this._activatedRoute })
                    break;
            case 5: this.route.navigate(['otras-instalaciones'], { relativeTo: this._activatedRoute })
                    break;
        }        
    }
    
    regresar(){
        let datos: StatusResponse<UnidadAdministrativaResponse> = {
            success: false
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
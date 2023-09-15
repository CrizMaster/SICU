import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from 'src/app/core/models/title.model';
import { FichaIndividualService } from '../../ficha-individual.service';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { AdditionalWorksRequest } from '../../models/AdditionalWorks/additions-works-request.model';
import { AdditionalWorksModalComponent } from '../7-additional-works-modal/additional-works-modal.component';
import { FichaCatastralIndividual } from '../../models/fichaCatastralIndividual.model';
import { SummaryModalComponent } from '../8-summary-modal/summary-modal.component';
  
@Component({
    selector: 'app-additional-works',
    templateUrl: './additional-works.component.html',
    styleUrls: ['./additional-works.component.css']
})
export class AdditionalWorkComponent implements OnInit, OnDestroy {

    @Output() seventhComplete = new EventEmitter<boolean>();
    //@Input() idFicha:number = 0;
    @Input() Stepper: MatStepper;

    @Output() outputSeccion = new EventEmitter<AdditionalWorksRequest[]>();

    @Input() inputSeccion: AdditionalWorksRequest[] = [];

    @Input() codRefCatastral: any[] = [];

    public saveAddWork$: Subscription = new Subscription;
    public editData$: Subscription = new Subscription;

    btnCompleteInfoDisabled: boolean = true;
    btnNextDisabled: boolean = false;
    //listaAddWork: AdditionalWorksRequest[] = [];
    dataFirst: AdditionalWorksRequest = { idObjeto : 0 };
    progress: boolean = false;
    ipv4: string = '';
    dataEdit: FichaCatastralIndividual;
    
    constructor(public dialog: MatDialog,
        private _fichaIndividualService: FichaIndividualService) { }

    ngOnInit(): void {
        // this.dataFirst.idObjeto = this.idFicha;

        // this.editData$ = this._fichaIndividualService.obsEditFichaCatastralIndividual.subscribe({
        //     next:(data) => {
        //         this.dataEdit = data;
        //     }
        //   });
    }

    ngOnDestroy(): void {
        this.saveAddWork$.unsubscribe();
        this.editData$.unsubscribe();
    }

    AddWorkModal(enterAnimationDuration: string, exitAnimationDuration: string):void {

        const dialogRef = this.dialog.open(AdditionalWorksModalComponent, {
            width: '750px',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data: this.dataFirst
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if(result != ''){

            // result.idObjeto = this.idFicha;
            // result.idFicha = this.idFicha;

            if(result.id == 0){
                if(this.inputSeccion.length > 0){
                    const max = this.inputSeccion.reduce(function(prev, current) {
                        return (prev.id > current.id) ? prev : current
                    })
                    result.id = max.id + 1;
                }
                else{ result.id = 1; }

                this.inputSeccion.push(result);
            }
            else{
                let lista: AdditionalWorksRequest[] = [];
                this.inputSeccion.forEach(item => {
                    if(item.id == result.id){
                        lista.push(result);
                    }
                    else{
                        lista.push(item);
                    }
                });
                this.inputSeccion = lista;
            }

            this.outputSeccion.emit(this.inputSeccion);
            // this.btnCompleteInfoDisabled = false;
            // this.btnNextDisabled = false;            
            // this.seventhComplete.emit(false);
          }
        });
    }

    Agregar(){
        this.dataFirst = { idObjeto: 0, id: 0 };
        this.AddWorkModal('300ms', '300ms');
    }

    Editar(b: AdditionalWorksRequest){
        this.dataFirst = b;
        this.AddWorkModal('300ms', '300ms');
    }

    Borrar(b:AdditionalWorksRequest){
        // let modal: Title = { Title: '¿Está seguro de borrar el registro?', Subtitle: '', Icon: '' }
        // const dialogModal = this.dialog.open(ModalQuestionComponent, {
        //     width: '450px',
        //     enterAnimationDuration: '300ms',
        //     exitAnimationDuration: '300ms',
        //     disableClose: true,
        //     data: modal
        // });

        // dialogModal.afterClosed().subscribe(resp => {
        //     if(resp){
        //         let lista: UbicacionPredial[] = [];
        //         this.listUbicacionPredial.forEach(item => {
        //             if(item.id !== up.id){
        //                 lista.push(item);
        //             }
        //         });
        //         this.listUbicacionPredial = lista;

        //         if(this.listUbicacionPredial.length == 0) { 
        //             this.btnNextDisabled = true;
        //             this.btnCompleteInfoDisabled = false;
        //             this.secondComplete.emit(false);
        //         }
        //     }            
        //   });
    }

    ModalMessage(): any {     
        let modal: Title = { 
          Title: 'Registrando las obras complementarias / otras instalaciones...'
        }
        let dgRef = this.dialog.open(ModalLoadingComponent, {
            width: '460px',
            height: '95px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal
        }); 
  
        return dgRef;
    }

    // AddWorkSummaryModal():void {
    //     const dialogRef = this.dialog.open(SummaryModalComponent, {
    //         width: '700px',
    //         enterAnimationDuration: '300ms',
    //         exitAnimationDuration: '300ms',
    //         disableClose: true,
    //         data: this.dataEdit
    //     });
    
    //     dialogRef.afterClosed().subscribe(result => {
    //       if(result != ''){

    //       }
    //     });
    // }

    // Guardar(){
    //     this.AddWorkSummaryModal();
    // }
}
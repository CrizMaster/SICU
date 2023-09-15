import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from 'src/app/core/models/title.model';
import { FichaIndividualService } from '../../ficha-individual.service';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { BuildingsModalComponent } from '../6-buildings-modal/buildings-modal.component';
import { BuildingsRequest } from '../../models/Buildings/buildings-request.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { FichaCatastralIndividual } from '../../models/fichaCatastralIndividual.model';
  
@Component({
    selector: 'app-buildings',
    templateUrl: './buildings.component.html',
    styleUrls: ['./buildings.component.css']
})
export class BuildingsComponent implements OnInit, OnDestroy {

    @Output() sixthComplete = new EventEmitter<boolean>();
    //@Input() idFicha:number = 0;
    @Input() Stepper: MatStepper;

    @Output() outputSeccion = new EventEmitter<BuildingsRequest[]>();

    @Input() inputSeccion: BuildingsRequest[] = [];

    public saveBuilding$: Subscription = new Subscription;
    public editData$: Subscription = new Subscription;

    btnCompleteInfoDisabled: boolean = true;
    btnNextDisabled: boolean = true;
    //listaBuildings: BuildingsRequest[] = [];
    dataFirst: BuildingsRequest = { idObjeto : 0 };
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
        this.saveBuilding$.unsubscribe();
        this.editData$.unsubscribe();
    }

    ConstruccionesModal(enterAnimationDuration: string, exitAnimationDuration: string):void {

        const dialogRef = this.dialog.open(BuildingsModalComponent, {
            width: '750px',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data: this.dataFirst
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if(result != ''){
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
                let lista: BuildingsRequest[] = [];
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
            // this.sixthComplete.emit(false);
          }
        });
    }

    Agregar(){
        this.dataFirst = { idObjeto: 0, id: 0 };
        this.ConstruccionesModal('300ms', '300ms');
    }

    Editar(b: BuildingsRequest){
        this.dataFirst = b;
        this.ConstruccionesModal('300ms', '300ms');
    }

    Borrar(b:BuildingsRequest){
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
          Title: 'Registrando las construcciones del predio...'
        }
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

    // goNext(){

    //     let dg = this.ModalMessage();

    //     this.saveBuilding$ = this._fichaIndividualService.save6Construcciones(this.listaBuildings)
    //     .subscribe(result => {
            
    //         dg.close();

    //         if(result.success){

    //             this.dataEdit.seccion6 = this.listaBuildings;
    //             this._fichaIndividualService.obsEditFichaCatastralIndividual.next(this.dataEdit);

    //             this.sixthComplete.emit(true);                
    //             setTimeout(() => {
    //                 this.btnNextDisabled = true;
    //                 this.Stepper.next();
    //               }, 500); 
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
    //             console.log(result.message);
    //         }
    //     });     
    // }
}
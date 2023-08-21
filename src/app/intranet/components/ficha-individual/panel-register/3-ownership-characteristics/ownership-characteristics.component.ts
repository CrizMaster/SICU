import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from 'src/app/core/models/title.model';
import { FichaIndividualService } from '../../ficha-individual.service';
import { OwnershipCharacteristics } from '../../models/OwnershipCharacteristics/ownership-characteristics.model';
import { OwnershipCharacteristicsModalComponent } from '../3-ownership-characteristics-modal/ownership-characteristics-modal.component';
import { MatStepper } from '@angular/material/stepper';
import { SharedData, SharedThirdData } from '../../models/sharedFirstData.model';
import { OwnershipCharacteristicsRequest } from '../../models/OwnershipCharacteristics/ownership-characteristics-request.model';
import { Subscription } from 'rxjs';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
  
@Component({
    selector: 'app-ownership-characteristics',
    templateUrl: './ownership-characteristics.component.html',
    styleUrls: ['./ownership-characteristics.component.css']
})
export class OwnershipCharacteristicsComponent implements OnInit , OnDestroy {

    @Output() thirdComplete = new EventEmitter<SharedThirdData>();
    @Input() Stepper: MatStepper;
    @Input() idFicha:number = 0;

    info: OwnershipCharacteristics = {};
    titleBtn: string = 'Agregar';
    //progress: boolean = false;
    ipv4: string = '';
    btnCompleteInfoDisabled: boolean = true;
    btnNextDisabled: boolean = true;
    //dataFirst: OwnershipCharacteristics;

    public saveOC$: Subscription = new Subscription;

    constructor(public dialog: MatDialog,
        private _fichaIndividualService: FichaIndividualService) { }

    ngOnInit(): void {
        // this._fichaIndividualService.getIpV4().then((result) => {
        //     this.ipv4 = result;    
        // });              
    }

    ngOnDestroy(): void {
        this.saveOC$.unsubscribe();
    }    

    CaracteristicasTitularidad(enterAnimationDuration: string, exitAnimationDuration: string):void {

        const dialogRef = this.dialog.open(OwnershipCharacteristicsModalComponent, {
            width: '550px',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data: this.info
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if(result != '') {
            this.info = result;
            this.btnNextDisabled = false;            
            this.titleBtn = 'Modificar';

            let data: SharedThirdData = { complete: false, idFicha: this.idFicha, codigoCondicionTitular: null }
            this.thirdComplete.emit(data);
          }            
        });
    }

    Agregar(){
        this.CaracteristicasTitularidad('300ms', '300ms');
    }

    ModalMessage(): any {     
        let modal: Title = { 
          Title: 'Guardando las características de la titularidad...'}
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

    goNext(){
        //this.progress = true;
        let dg = this.ModalMessage();
        
        let request: OwnershipCharacteristicsRequest = 
        {   idObjeto: this.idFicha, 
            usuarioCreacion: 'carevalo',
            terminalCreacion: this.ipv4,
            c21CodigoCondicion: this.info.CodeCondicionTitular,
            c22FormaAdquisicion: this.info.CodeFormaAdquision,
            c23CodigoTipoDocumento: this.info.CodeTipoDocumento,
            c24TipoPartida: this.info.CodeTipoPartidaRegistral,
            c25Numero: this.info.NumeroPartidaRegistral
        };

        this.saveOC$ = this._fichaIndividualService.save3CaracteristicasTitularidad(request)
        .subscribe(result => {
            
            dg.close();
            
            if(result.success){
                let data: SharedThirdData = {
                    complete: true,
                    idFicha: this.idFicha,
                    codigoCondicionTitular: this.info.CodeCondicionTitular
                }
                this.thirdComplete.emit(data);
                
                setTimeout(() => {
                    //this.progress = false;
                    this.btnNextDisabled = true;
                    this.Stepper.next();
                  }, 500); 
            }
            else{
                //this.progress = false;
                let modal: Title = { 
                    Title: 'Opss...', 
                    Subtitle: result.message, 
                    Icon: 'error'
                }
                this.dialog.open(ModalMessageComponent, {
                      width: '500px',
                      enterAnimationDuration: '300ms',
                      exitAnimationDuration: '300ms',
                      disableClose: true,
                      data: modal
                });
            }
        });        
    }
}
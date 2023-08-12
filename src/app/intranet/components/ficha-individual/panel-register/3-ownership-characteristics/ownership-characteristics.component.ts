import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PropertyLocationModalComponent } from '../2-property-location-modal/property-location-modal.component';
import { UbicacionPredial } from '../../models/ubicacionPredial.model';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { Title } from 'src/app/core/models/title.model';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { Via } from '../../models/via.model';
import { FichaIndividualService } from '../../ficha-individual.service';
import { Edificacion, Habilitacion, HabilitacionEdificacion } from '../../models/habilitacionEdificacion.model';
import { PropertyLocationHabiedifModalComponent } from '../2-property-location-habiedif-modal/property-location-habiedif-modal.component';
import { OwnershipCharacteristics } from '../../models/OwnershipCharacteristics/ownership-characteristics.model';
import { OwnershipCharacteristicsModalComponent } from '../3-ownership-characteristics-modal/ownership-characteristics-modal.component';
import { MatStepper } from '@angular/material/stepper';
import { SharedData, SharedThirdData } from '../../models/sharedFirstData.model';
  
@Component({
    selector: 'app-ownership-characteristics',
    templateUrl: './ownership-characteristics.component.html',
    styleUrls: ['./ownership-characteristics.component.css']
})
export class OwnershipCharacteristicsComponent implements OnInit{

    @Output() thirdComplete = new EventEmitter<SharedData<SharedThirdData>>();
    @Input() Stepper: MatStepper;
    
    info: OwnershipCharacteristics = {};
    titleBtn: string = 'Agregar';
    progress: boolean = false;

    btnCompleteInfoDisabled: boolean = true;
    btnNextDisabled: boolean = true;
    dataFirst: OwnershipCharacteristics;

    // habilitacion: Habilitacion = { codigoHabilitacion: '', nombreHabilitacion: '', sectorZonaEtapa: '', manzanaUrbana: ''};
    // edificacion: Edificacion = { codigoEspecifico: '', nombreEdificacion: '' };

    constructor(public dialog: MatDialog,
        private _fichaIndividualService: FichaIndividualService) { }

    ngOnInit(): void {
              
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

            let data: SharedData<SharedThirdData> = { complete: false, data: null }
            this.thirdComplete.emit(data);
          }            
        });
    }

    Agregar(){
        this.CaracteristicasTitularidad('300ms', '300ms');
    }

    goNext(){
        this.progress = true;
        
        // let request: SaveFichaIndividual = 
        // {   idObjeto: this.dataFirst.idObjeto, 
        //     codigoReferenciaCatastral: this.dataFirst.CRC 
        // };

        // this.saveCRC$ = this._fichaIndividualService.saveCodigoReferenciaCatastral(request).subscribe(result => {
            
        //     let shDataFirst: SharedFirstData = {          
        //         codigoSector: this.dataFirst.codigoSector,
        //         codigoManzana: this.dataFirst.codigoManzana
        //     }
        //     let data: SharedData<SharedFirstData> = { complete: true, data: shDataFirst }
        //     this.firstComplete.emit(data);
            
        //     setTimeout(() => {
        //         this.dataFirst.idObjeto = result.idObjeto;
        //         this.progress = false;
        //         this.btnNextDisabled = true;
        //         this.Stepper.next();
        //       }, 500);  
        // });
            setTimeout(() => {

                let shDataThird: SharedThirdData = {          
                    codigoCondicionTitular: this.info.CodeCondicionTitular
                }
                let data: SharedData<SharedThirdData> = { complete: true, data: shDataThird }
                this.thirdComplete.emit(data);

                setTimeout(() => {
                    this.progress = false;
                    this.btnNextDisabled = true;
                    this.Stepper.next();
                  }, 500);
              }, 2000);         
    }

    // Editar(up: UbicacionPredial){
    //     this.dataFirst = up;
    //     this.UbicacionPredial('300ms', '300ms');
    // }


}
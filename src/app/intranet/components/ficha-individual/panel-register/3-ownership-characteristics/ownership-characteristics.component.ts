import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OwnershipCharacteristics } from '../../models/OwnershipCharacteristics/ownership-characteristics.model';
import { OwnershipCharacteristicsModalComponent } from '../3-ownership-characteristics-modal/ownership-characteristics-modal.component';
import { SharedThirdData } from '../../models/sharedFirstData.model';
import { OwnershipCharacteristicsRequest } from '../../models/OwnershipCharacteristics/ownership-characteristics-request.model';
  
@Component({
    selector: 'app-ownership-characteristics',
    templateUrl: './ownership-characteristics.component.html',
    styleUrls: ['./ownership-characteristics.component.css']
})
export class OwnershipCharacteristicsComponent implements OnInit , OnDestroy {

    @Output() thirdComplete = new EventEmitter<SharedThirdData>();
    @Output() outputSeccion = new EventEmitter<OwnershipCharacteristicsRequest>();

    @Input() inputSeccion: OwnershipCharacteristicsRequest = { idObjeto: 0 };

    info: OwnershipCharacteristics = {};
    titleBtn: string = 'Agregar';
    ipv4: string = '';

    constructor(public dialog: MatDialog
        ) { }

    ngOnInit(): void {         
    }

    ngOnDestroy(): void {
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
       
            this.titleBtn = 'Modificar';

            this.inputSeccion.CondicionTitular = this.info.CondicionTitular;
            this.inputSeccion.c21CodigoCondicion = this.info.CodeCondicionTitular;            
            this.inputSeccion.c22FormaAdquisicion = this.info.CodeFormaAdquision;
            this.inputSeccion.c23CodigoTipoDocumento = this.info.IdTipoDocumento == 0 ? '' : this.info.CodeTipoDocumento;
            this.inputSeccion.c24TipoPartida = this.info.IdTipoPartidaRegistral == 0 ? '' : this.info.CodeTipoPartidaRegistral;
            this.inputSeccion.c25Numero = this.info.NumeroPartidaRegistral;

            this.outputSeccion.emit(this.inputSeccion);
          }
        });
    }

    Agregar(){
        this.CaracteristicasTitularidad('300ms', '300ms');
    }
}
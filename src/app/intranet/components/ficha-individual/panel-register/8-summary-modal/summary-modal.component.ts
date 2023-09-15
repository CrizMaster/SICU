import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FichaIndividualService } from '../../ficha-individual.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith, Subscription } from 'rxjs';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { AdditionalWorksRequest } from '../../models/AdditionalWorks/additions-works-request.model';
import { FichaCatastralIndividual } from '../../models/fichaCatastralIndividual.model';
import { SaveFichaIndividual, UbicacionPredioModel } from '../../models/saveFichaIndividual.model';
import { OwnershipCharacteristics } from '../../models/OwnershipCharacteristics/ownership-characteristics.model';
import { OwnershipCharacteristicsRequest } from '../../models/OwnershipCharacteristics/ownership-characteristics-request.model';
import { IdentityOwnerRequest } from '../../models/IdentityOwner/identity-owner-request.model';
import { DescriptionPropertyRequest } from '../../models/DescriptionProperty/description-property-request.model';
import { BuildingsRequest } from '../../models/Buildings/buildings-request.model';

// const moment = _rollupMoment || _moment;

// export interface Obra {
//   id?: number,
//   name: string;
//   obras?: Obra[];
// }

// export const _filter = (opt: Obra[], value: string): Obra[] => {
//   const filterValue = value.toLowerCase();

//   return opt.filter(item => item.name.toLowerCase().includes(filterValue));
// };

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
    selector: 'app-summary-modal',
    templateUrl: './summary-modal.component.html',
    styleUrls: ['./summary-modal.component.css'],
    providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ]
})
export class SummaryModalComponent implements OnInit, OnDestroy {

    form: FormGroup;
    dataEdit: FichaCatastralIndividual;
    crc: string = '';
    seccion1: SaveFichaIndividual;
    
    seccion2: UbicacionPredioModel;
    validSeccion2: boolean = false;    
    
    seccion3: OwnershipCharacteristicsRequest;
    validSeccion3: boolean = false;
    msgValidSeccion3: string = '';

    seccion4: IdentityOwnerRequest;
    validSeccion4: boolean = false;
    msgValidSeccion4: string = '';

    seccion5: DescriptionPropertyRequest;
    validSeccion5: boolean = false; 

    seccion6: BuildingsRequest[];
    msgValidSeccion6: string = '';

    seccion7: AdditionalWorksRequest[];
    msgValidSeccion7: string = '';

    constructor(
      public dialogRef: MatDialogRef<SummaryModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      //private _fichaIndividualService: FichaIndividualService,
      //private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef,
      //private adapter: DateAdapter<any>
    ){    
      this.dataEdit = data;
      console.log('Summary');
      console.log(this.dataEdit);

      this.seccion1 = this.dataEdit.seccion1;
      this.seccion2 = this.dataEdit.seccion2;
      this.seccion3 = this.dataEdit.seccion3;
      this.seccion4 = this.dataEdit.seccion4;
      this.seccion5 = this.dataEdit.seccion5;
      this.seccion6 = this.dataEdit.seccion6;
      this.seccion7 = this.dataEdit.seccion7;

      this.crc = this.seccion1.codigoDepartamento + this.seccion1.codigoProvincia + this.seccion1.codigoDistrito +
      this.seccion1.sector + this.seccion1.manzana + this.seccion1.lote + this.seccion1.edifica + this.seccion1.entrada + 
      this.seccion1.piso + this.seccion1.unidad + String(this.seccion1.dc);

      if(this.seccion2.ubicacionPredioDetalle.length == 0) this.validSeccion2 = true;
      else{
        this.validSeccion2 = true;
        this.seccion2.ubicacionPredioDetalle.forEach(e => {
          if(e.c08TipoPuerta == '01') this.validSeccion2 = false; //TIENE PUERTA PRINCIPAL
        });
      }

      this.msgValidSeccion3 = 'Debe de seleccionar la condición del titular';
      this.validSeccion3 = false;
      if(this.seccion3.c21CodigoCondicion == "") { 
        this.validSeccion3 = true; 
        this.seccion3.CondicionTitular = "Sin condición del titular";
      }

      this.validSeccion4 = false;
      if(this.seccion4.c26TipoTitular == "") {
        this.validSeccion4 = true; 
        this.seccion4.tipoTitular = "Sin tipo de titular";
        this.msgValidSeccion4 = 'Debe de seleccionar el tipo de titular';
      }

      this.validSeccion5 = false;
      if(this.seccion5.c38ClasificacionPredio == "") {
        this.validSeccion5 = true;
      }

      this.msgValidSeccion6 = (this.seccion6.length == 0 ? 'Sin registro de construcciones' : 
                              (this.seccion6.length == 1 ? '1 construcción registrada' : this.seccion6.length.toString() + ' construcciones registradas'))

      this.msgValidSeccion7 = (this.seccion7.length == 0 ? 'Sin registro de obras complementarias' : 
                              (this.seccion7.length == 1 ? '1 obra complementaria registrada' : this.seccion7.length.toString() + ' obras complementarias registradas'))

    }
    
    // displayFn(user: User): string {
    //   return user && user.name ? user.name : '';
    // }

    // private _filter(name: string): User[] {
    //   const filterValue = name.toLowerCase();
  
    //   return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
    // }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnDestroy(): void {
//      this.listCatValUnit$.unsubscribe();
    }


    ngOnInit(): void {
      //this.adapter.setLocale(moment.locale('es-PE'));
      
    }

    guardar(){
      //let info = this.form.value;

      this.dialogRef.close();
    }
}
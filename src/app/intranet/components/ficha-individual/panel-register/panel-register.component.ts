import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';

import { FormBuilder, Validators} from '@angular/forms';
import { BreakpointObserver} from '@angular/cdk/layout';
import { MatStepper, StepperOrientation} from '@angular/material/stepper';
import { Observable, Subscription} from 'rxjs';
import { map} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { FichaIndividualService } from '../ficha-individual.service';
import { SharedData, SharedFirstData, SharedThirdData } from '../models/sharedFirstData.model';
import { Via } from '../models/via.model';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { HabilitacionEdificacion } from '../models/habilitacionEdificacion.model';
import { SaveFichaIndividual, UbicacionPredioModel } from '../models/saveFichaIndividual.model';
import { FichaCatastralIndividual } from '../models/fichaCatastralIndividual.model';
import { SummaryModalComponent } from './8-summary-modal/summary-modal.component';
import { OwnershipCharacteristicsRequest } from '../models/OwnershipCharacteristics/ownership-characteristics-request.model';
import { IdentityOwnerRequest } from '../models/IdentityOwner/identity-owner-request.model';
import { DescriptionPropertyRequest } from '../models/DescriptionProperty/description-property-request.model';
import { BuildingsRequest } from '../models/Buildings/buildings-request.model';
import { AdditionalWorksRequest } from '../models/AdditionalWorks/additions-works-request.model';
  
@Component({
    selector: 'app-panel-register',
    templateUrl: './panel-register.component.html',
    styleUrls: ['./panel-register.component.css']
})
export class PanelRegisterComponent implements OnInit, OnDestroy {

    @ViewChild('Stepper') private Stepper: MatStepper;

    tituloForm: Title = { Title: 'FICHA CATASTRAL INDIVIDUAL', Subtitle : 'Nuevo Registro', Icon : 'person' };
    BreadcrumbForm: Breadcrumb[] = [{ name : "Fichas Catastrales" },{ name : "Individual" },{ name : "Bandeja de Trabajo", navigate: '/intranet/individual' },{ name : "Nuevo Registro" }];   

    catalogoMaster: CatalogoMaster[] = [];

    idFicha: number = 0;
    listaVias: ItemSelect<Via>[] = [];

    Seccion1: SaveFichaIndividual;
    Seccion2: UbicacionPredioModel;
    Seccion3: OwnershipCharacteristicsRequest;
    Seccion4: IdentityOwnerRequest;
    Seccion5: DescriptionPropertyRequest;
    Seccion6: BuildingsRequest[];
    Seccion7: AdditionalWorksRequest[];


    habilEdific: HabilitacionEdificacion;
    dataEdit: FichaCatastralIndividual;

    public subHabEdi$: Subscription = new Subscription;
    public editData$: Subscription = new Subscription;
    
    verPaso4: boolean = true;
    btnNextDisabled: boolean = true;
    dataFirst: any;
    //codRefCatastral: any[] = ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'];

    

      firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
      });

      secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
      });

      thirdFormGroup = this._formBuilder.group({
        thirdCtrl: ['', Validators.required],
      });

      roomFormGroup = this._formBuilder.group({
        roomCtrl: ['', Validators.required],
      });

      fifthFormGroup = this._formBuilder.group({
        fifthCtrl: ['', Validators.required],
      });

      sixthFormGroup = this._formBuilder.group({
        sixthCtrl: ['', Validators.required],
      });

      seventhFormGroup = this._formBuilder.group({
        seventhCtrl: ['', Validators.required],
      });

      stepperOrientation: Observable<StepperOrientation>;
      
      firstComplete = false;
      secondComplete = false;
      thirdComplete = false;
      roomComplete = false;
      fifthComplete = false;
      sixthComplete = false;
      seventhComplete = false;

    constructor(
        private _formBuilder: FormBuilder, 
        breakpointObserver: BreakpointObserver,
        public dialog: MatDialog,
        private _fichaIndividualService: FichaIndividualService
        ) {
          this.stepperOrientation = breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));

          this._fichaIndividualService.setCatalogoMaster();
      }

    ngOnInit(): void {
      this.editData$ = this._fichaIndividualService.obsEditFichaCatastralIndividual.subscribe({
        next:(data) => {
            if(Object.keys(data).length > 0){
                this.dataEdit = data;
                this.Seccion1 = data.seccion1;
                this.Seccion2 = data.seccion2;
                this.listaVias = data.seccion2.listaVias;
                this.Seccion3 = data.seccion3;
                this.Seccion4 = data.seccion4;
                this.Seccion5 = data.seccion5;
                this.Seccion6 = data.seccion6;
                this.Seccion7 = data.seccion7;
            }                
        }
      });      
    } 

    ngOnDestroy(): void {
        this.subHabEdi$.unsubscribe();
        this.editData$.unsubscribe();
    }

    Step1Complete(data: SharedFirstData<ItemSelect<Via>[]>){
      
      if(data.complete){
        this.idFicha = data.idFicha;
        this.listaVias = data.data;
          
        this._fichaIndividualService.obsHabilitacionEdificacion.next(data.habUrbana);
      }

      this.firstComplete = data.complete;
    }

    Step2Complete(sw: boolean){
      this.secondComplete = sw;
    }

    Step3Complete(data: SharedThirdData){      
      // if(data.complete){
        
      //   if(data.codigoCondicionTitular == '05') {
      //     this.verPaso4 = false;
      //   }
      //   else { this.verPaso4 = true; }

      //   this._fichaIndividualService.obsSharedThirdData.next(data);
      // }
      // this.thirdComplete = data.complete;
    }

    Step4Complete(sw: boolean){
      this.roomComplete = sw;
    }

    Step5Complete(sw: boolean){
      this.fifthComplete = sw;
    }

    Step6Complete(sw: boolean){
      this.sixthComplete = sw;
    }

    Step7Complete(sw: boolean){
      this.seventhComplete = sw;
    }

    AddSummaryModal():void {
      const dialogRef = this.dialog.open(SummaryModalComponent, {
          width: '700px',
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          disableClose: true,
          data: this.dataEdit
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result != ''){

        }
      });
  }

  InfoSeccion1(seccion1: SaveFichaIndividual){
    this.dataEdit.seccion1 = seccion1;
  }

  InfoSeccion2(seccion2: UbicacionPredioModel){
    this.dataEdit.seccion2 = seccion2;
  }

  InfoSeccion3(seccion3: OwnershipCharacteristicsRequest){
    this.dataEdit.seccion3 = seccion3;

        if(seccion3.c21CodigoCondicion == '05') {
          this.verPaso4 = false;
        }
        else { this.verPaso4 = true; }

    let datos: SharedThirdData = { codigoCondicionTitular: seccion3.c21CodigoCondicion }
    this._fichaIndividualService.obsSharedThirdData.next(datos);
  } 
  
  InfoSeccion4(seccion4: IdentityOwnerRequest){
    this.dataEdit.seccion4 = seccion4;
  }

  InfoSeccion5(seccion5: IdentityOwnerRequest){
    this.dataEdit.seccion5 = seccion5;
  } 
  
  InfoSeccion6(seccion6: BuildingsRequest[]){
    this.dataEdit.seccion6 = seccion6;
  }

  InfoSeccion7(seccion7: AdditionalWorksRequest[]){
    this.dataEdit.seccion7 = seccion7;
  }

  Guardar(){
    this.AddSummaryModal();
  }
    // FichaInidividualModal(enterAnimationDuration: string, exitAnimationDuration: string):void {
    //     const dialogRef = this.dialog.open(CodeReferenceModalComponent, {
    //         width: '500px',
    //         enterAnimationDuration,
    //         exitAnimationDuration,
    //         disableClose: true,
    //         data: this.dataFirst
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //       if(result != ''){
    //         this.dataFirst = result;
    //         let codigo = result.codigoUbigeo + result.codigoSector + result.codigoManzana + result.lote + 
    //         result.edifica + result.entrada + result.piso + result.unidad + result.dc;
    //         this.codRefCatastral = codigo.split('');
    //         this.btnNextDisabled = false;
    //       }            
    //     });
    // }

}
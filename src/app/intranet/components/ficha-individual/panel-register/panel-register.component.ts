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
  
@Component({
    selector: 'app-panel-register',
    templateUrl: './panel-register.component.html',
    styleUrls: ['./panel-register.component.css']
})
export class PanelRegisterComponent implements OnInit, OnDestroy {

    @ViewChild('Stepper') private Stepper: MatStepper;

    tituloForm: Title = { Title: 'FICHA CATASTRAL INDIVIDUAL', Subtitle : 'Nuevo Registro', Icon : 'person' };
    BreadcrumbForm: Breadcrumb[] = [{ name : "Fichas Catastrales" },{ name : "Individual" },{ name : "Bandeja Principal", navigate: '/intranet/individual' },{ name : "Nuevo Registro" }];   

    catalogoMaster: CatalogoMaster[] = [];

    idFicha: number = 0;
    listaVias: ItemSelect<Via>[] = [];
    habilEdific: HabilitacionEdificacion;
    //dataThirdShared: SharedThirdData = { codigoCondicionTitular : '' };

    //public listVias$: Subscription = new Subscription;
    public subHabEdi$: Subscription = new Subscription;
    
    verPaso4: boolean = true;
    btnNextDisabled: boolean = true;
    dataFirst: any;
    codRefCatastral: any[] = ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'];

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
      
    } 

    ngOnDestroy(): void {
        this.subHabEdi$.unsubscribe();
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
      if(data.complete){
        
        if(data.codigoCondicionTitular == '05') {
          this.verPaso4 = false;
        }
        else { this.verPaso4 = true; }

        this._fichaIndividualService.obsSharedThirdData.next(data);
      }
      this.thirdComplete = data.complete;
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
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { FichaIndividualService } from '../../ficha-individual.service';
import { OwnershipCharacteristics } from '../../models/OwnershipCharacteristics/ownership-characteristics.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { SharedThirdData } from '../../models/sharedFirstData.model';
import { MatStepper } from '@angular/material/stepper';
import { IdentityOwnerNaturalModalComponent } from '../4-identity-owner-natural-modal/identity-owner-natural-modal.component';
import { PersonNatural } from '../../models/IdentityOwner/personNatural.model';
import { PersonLegal } from '../../models/IdentityOwner/personLegal.model';
import { Owner } from '../../models/IdentityOwner/owner.model';
import { IdentityOwnerLegalModalComponent } from '../4-identity-owner-legal-modal/identity-owner-legal-modal.component';
import { DescriptionPredio } from '../../models/DescriptionProperty/descriptionProperty.model';
import { DescriptionPropertyModalComponent } from '../5-description-property-modal/description-property-modal.component';
  
@Component({
    selector: 'app-description-property',
    templateUrl: './description-property.component.html',
    styleUrls: ['./description-property.component.css']
})
export class DescriptionPropertyComponent implements OnInit{

    @Output() fifthComplete = new EventEmitter<boolean>();
    @Input() idFicha:number = 0;
    @Input() Stepper: MatStepper;
    
    progress: boolean = false;
    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    
    mDescPredio: DescriptionPredio = { IdClasificacionPredio: 0, CodeUso: ['','','','','',''] };
    // mTitular: PersonNatural = { DocIdentidad: ['','','','','','','','','','']};
    // mConyuge: PersonNatural = { DocIdentidad: ['','','','','','','','','','']};
    // mEmpresa: PersonLegal = { IdPersonaJuridica: 0,  DocIdentidad: ['','','','','','','','','','']};
    //info: OwnershipCharacteristics = {};
    titleBtn: string = 'Agregar';

    // ctrlTipoTitular: boolean = true;
    // ctrlConConyugue: boolean = true;

    // btnAgregarNatural: boolean = true;

    // natural: boolean = false;
    // juridica: boolean = false;

    btnNextDisabled: boolean = true;
    dataFirst: OwnershipCharacteristics = {};
    
    listCatalogoMaster: CatalogoMaster[] = [];
    listTipoTitular: ItemSelect<number>[] = [];

    constructor(public dialog: MatDialog,
        private _fichaIndividualService: FichaIndividualService,
        private fb: FormBuilder,
        private changeDetector: ChangeDetectorRef) { 

        this.form = this.fb.group({
            tipotitular: [0, Validators.required]
        });

        this.listCatalogoMaster = _fichaIndividualService.getCatalogoMaster();
        this.listTipoTitular = this.getList<number>(CatalogoMasterEnum.TipoTitular);
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    ngOnInit(): void {        

    }

    getList<T>(Grupo: string) : ItemSelect<T>[]{
        let list: ItemSelect<T>[] = [];
      
        this.listCatalogoMaster.forEach(item => {
            if(item.grupo == Grupo){
                list.push({
                    value: item.id,
                    text: item.nombre,
                    code: item.orden
                });
            };
        });
      
        list = list.sort((n1,n2) => {
            if (n1.text > n2.text) {
                return 1;
            }
            if (n1.text < n2.text) {
                return -1;
            }
            return 0;
        });
      
        list.unshift({ value: 0, text: 'Seleccionar'});      
        return list;
    }

    AgregarModal(enterAnimationDuration: string, exitAnimationDuration: string):void {

        const dialogRef = this.dialog.open(DescriptionPropertyModalComponent, {
            width: '600px',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data: this.mDescPredio
        });
    
        dialogRef.afterClosed().subscribe((result:any) => {
          if(result !== ''){
            this.mDescPredio = result;
            this.titleBtn = 'Modificar';
            this.btnNextDisabled = false;
            this.fifthComplete.emit(false);
          }            
        });
    }

    Agregar(){
        this.AgregarModal('300ms', '300ms');
    }

    goNext(){
        this.progress = true;
        
            setTimeout(() => {

                // let shDataThird: SharedThirdData = {          
                //     codigoCondicionTitular: this.info.CodeCondicionTitular
                // }
                // let data: SharedData<SharedThirdData> = { complete: true, data: shDataThird }
                this.fifthComplete.emit(true);

                setTimeout(() => {
                    this.progress = false;
                    this.btnNextDisabled = true;
                    this.Stepper.next();
                  }, 500);
              }, 2000);         
    }

}
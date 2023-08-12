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
  
@Component({
    selector: 'app-identity-owner',
    templateUrl: './identity-owner.component.html',
    styleUrls: ['./identity-owner.component.css']
})
export class IdentityOwnerComponent implements OnInit{

    @Output() roomComplete = new EventEmitter<boolean>();
    
    @Input() dataThirdShared: SharedThirdData;

    @Input() Stepper: MatStepper;
    
    progress: boolean = false;
    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    
    mOwner: Owner = { Titular: { IdEstadoCivil: 0,  DocIdentidad: ['','','','','','','','','',''] }, Conyuge: { DocIdentidad: ['','','','','','','','','',''] }};
    mTitular: PersonNatural = { DocIdentidad: ['','','','','','','','','','']};
    mConyuge: PersonNatural = { DocIdentidad: ['','','','','','','','','','']};
    mEmpresa: PersonLegal = { IdPersonaJuridica: 0,  DocIdentidad: ['','','','','','','','','','']};
    info: OwnershipCharacteristics = {};
    titleBtn: string = 'Agregar';
    titleBtnLegal: string = 'Agregar';
    displayName: string = '';
    sucesion: boolean = false;

    ctrlTipoTitular: boolean = true;
    ctrlConConyugue: boolean = true;

    btnAgregarNatural: boolean = true;

    natural: boolean = false;
    juridica: boolean = false;

    btnCompleteInfoDisabled: boolean = true;
    btnNextDisabled: boolean = true;
    dataFirst: OwnershipCharacteristics = {};
    
    listCatalogoMaster: CatalogoMaster[] = [];
    listTipoTitular: ItemSelect<number>[] = [];

    constructor(public dialog: MatDialog,
        public dialog2: MatDialog,
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
        this._fichaIndividualService.obsSharedThirdData.subscribe({
            next:(data) => {
                this.ctrlTipoTitular = true;
                this.btnAgregarNatural = true;
                this.ctrlConConyugue = true;
                this.natural = false;
                this.juridica = false;
                this.displayName = '';
                this.mTitular = { IdEstadoCivil: 0, DocIdentidad: ['','','','','','','','','','']};
                this.mConyuge = { DocIdentidad: ['','','','','','','','','','']};
                this.mEmpresa = { IdPersonaJuridica: 0, DocIdentidad: ['','','','','','','','','','']};
                this.sucesion = false;

                this.form.patchValue({ 
                    tipotitular: 0
                });

                if(data.codigoCondicionTitular == '01'//PROPIETARIO UNICO
                    || data.codigoCondicionTitular == '02'//SUCESION INTESTADA
                ) 
                {
                    this.ctrlConConyugue = false;
                    if(data.codigoCondicionTitular == '02') this.sucesion = true;
                }
                else if(data.codigoCondicionTitular == '04') //SOCIEDAD CONYUGAL
                {
                    this.ctrlConConyugue = true;
                }
                else if(data.codigoCondicionTitular == '05') //COTITULARIDAD
                {
                    this.ctrlTipoTitular = false;
                    this.roomComplete.next(true);
                    setTimeout(() => {
                        this.Stepper.next();
                      }, 500); 
                }
                else if(data.codigoCondicionTitular == '06') //LITIGIO
                {
                    this.ctrlTipoTitular = false;
                    this.natural = true;
                    this.btnAgregarNatural = false;
                    this.ctrlConConyugue = false;
                    this.displayName = 'NNN';
                    this.btnNextDisabled = false;
                }
            }
        });
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

    PersonaNaturalModal(enterAnimationDuration: string, exitAnimationDuration: string):void {

        const dialogPerNatural = this.dialog.open(IdentityOwnerNaturalModalComponent, {
            width: '500px',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data: this.mOwner
        });
    
        dialogPerNatural.afterClosed().subscribe((result:any) => {
          if(result !== ''){
            this.mOwner = result;
            this.titleBtn = 'Modificar';
            this.mTitular = result.Titular;
            this.displayName = result.Titular.Nombres;
            if(this.ctrlConConyugue) this.mConyuge = result.Conyuge;
            
            this.btnNextDisabled = false;
            this.roomComplete.emit(false);
          }            
        });
    }

    onChangeSelTipoTitular(newValue: string, sw: boolean){

        this.natural = false;
        this.juridica = false;
        this.listTipoTitular.forEach(item => {
            if(item.value == parseInt(newValue)){
                if(item.code == '01') {
                    this.natural = true;
                    this.juridica = false;
                }
                else if(item.code == '02') {
                    this.natural = false;
                    this.juridica = true;
                }
            }            
        });
    }

    AgregarPersonaNatural(){
        this.PersonaNaturalModal('300ms', '300ms');
    }

    PersonaJuridicaModal(enterAnimationDuration: string, exitAnimationDuration: string):void {

        const dialogPerJuridica = this.dialog2.open(IdentityOwnerLegalModalComponent, {
            width: '500px',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data: this.mEmpresa
        });
    
        dialogPerJuridica.afterClosed().subscribe((result:any) => {
          if(result !== ''){
            this.mEmpresa = result.Empresa;
            this.titleBtnLegal = 'Modificar';
            this.btnNextDisabled = false;
            this.roomComplete.emit(false);
          }            
        });
    }

    AgregarPersonaJuridica(){
        this.PersonaJuridicaModal('300ms', '300ms');
    }

    // Editar(up: UbicacionPredial){
    //     this.dataFirst = up;
    //     this.UbicacionPredial('300ms', '300ms');
    // }

    goNext(){
        this.progress = true;
        
            setTimeout(() => {

                // let shDataThird: SharedThirdData = {          
                //     codigoCondicionTitular: this.info.CodeCondicionTitular
                // }
                // let data: SharedData<SharedThirdData> = { complete: true, data: shDataThird }
                this.roomComplete.emit(true);

                setTimeout(() => {
                    this.progress = false;
                    this.btnNextDisabled = true;
                    this.Stepper.next();
                  }, 500);
              }, 2000);         
    }

}
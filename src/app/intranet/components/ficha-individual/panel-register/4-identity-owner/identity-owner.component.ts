import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
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
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { IdentityOwnerRequest } from '../../models/IdentityOwner/identity-owner-request.model';
import { Subscription } from 'rxjs';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
  
@Component({
    selector: 'app-identity-owner',
    templateUrl: './identity-owner.component.html',
    styleUrls: ['./identity-owner.component.css']
})
export class IdentityOwnerComponent implements OnInit, OnDestroy  {

    @Output() roomComplete = new EventEmitter<boolean>();
    @Input() idFicha:number = 0;
    @Input() dataThirdShared: SharedThirdData;
    @Input() Stepper: MatStepper;    
    //progress: boolean = false;

    public saveIT$: Subscription = new Subscription;
    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    
    mOwner: Owner = { Titular: { IdEstadoCivil: 0,  DocIdentidad: ['','','','','','','','','',''] }, Conyuge: { DocIdentidad: ['','','','','','','','','',''] }};
    mTitular: PersonNatural = { DocIdentidad: ['','','','','','','','','','']};
    mConyuge: PersonNatural = { DocIdentidad: ['','','','','','','','','','']};
    mEmpresa: PersonLegal = { IdPersonaJuridica: 0,  DocIdentidad: ['','','','','','','','','','']};
    info: OwnershipCharacteristics = {};
    dataSave: IdentityOwnerRequest = { idObjeto: 0 };
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

    ngOnDestroy(): void {
        this.saveIT$.unsubscribe();
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

            this.dataSave.c26TipoTitular = '01';
            this.dataSave.c27EstadoCivil = result.Titular.CodeEstadoCivil;
            this.dataSave.c28aTipoDocumento = result.Titular.CodeTipoDocIdentidad;
            this.dataSave.c29aNroDocumento = result.Titular.NroDocIdentidad;
            this.dataSave.c30aNombres = result.Titular.Nombres;
            this.dataSave.c31aApellidoPaterno = result.Titular.ApellidoPaterno;
            this.dataSave.c32aApellidoMaterno = result.Titular.ApellidoMaterno;
            if(result.Titular.ConConyuge){
                this.dataSave.c28bTipoDocumento = result.Conyuge.CodeTipoDocIdentidad;
                this.dataSave.c29bNroDocumento = result.Conyuge.NroDocIdentidad;
                this.dataSave.c30bNombres = result.Conyuge.Nombres;
                this.dataSave.c31bApellidoPaterno = result.Conyuge.ApellidoPaterno;
                this.dataSave.c32bApellidoMaterno = result.Conyuge.ApellidoMaterno;                
            }

            this.titleBtn = 'Modificar';
            this.mTitular = result.Titular;
            this.displayName = result.Titular.Nombres;
            if(this.ctrlConConyugue) this.mConyuge = result.Conyuge;
            
            this.btnNextDisabled = false;
            this.roomComplete.emit(false);
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

            this.dataSave.c26TipoTitular = '02';
            this.dataSave.c33PersonaJuridica = result.Empresa.CodePersonaJuridica;
            this.dataSave.c34Ruc = result.Empresa.RUC;
            this.dataSave.c35TelefonoAnexo = result.Empresa.TelefonoAnexo;
            this.dataSave.c36RazonSocial = result.Empresa.RazonSocial;
            this.dataSave.c37CorreoElectronico = result.Empresa.Email;

            this.titleBtnLegal = 'Modificar';
            this.btnNextDisabled = false;
            this.roomComplete.emit(false);
          }            
        });
    }

    AgregarPersonaJuridica(){
        this.PersonaJuridicaModal('300ms', '300ms');
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

        let dg = this.ModalMessage();

        this.dataSave.idObjeto = this.idFicha;
        this.dataSave.usuarioCreacion = 'carevalo';
        this.dataSave.terminalCreacion = "";

        this.saveIT$ = this._fichaIndividualService.save4IdentificacionTitular(this.dataSave)
        .subscribe(result => {
            
            dg.close();

            if(result.success){
                this.roomComplete.emit(true);                
                setTimeout(() => {
                    this.btnNextDisabled = true;
                    this.Stepper.next();
                  }, 500); 
            }
            else{
                let modal: Title = { 
                    Title: 'Opss...', 
                    Subtitle: result.message, 
                    Icon: 'error' }
                  this.dialog.open(ModalMessageComponent, {
                      width: '500px',
                      enterAnimationDuration: '300ms',
                      exitAnimationDuration: '300ms',
                      disableClose: true,
                      data: modal
                  });
                console.log(result.message);
            }
        });        
    }
}
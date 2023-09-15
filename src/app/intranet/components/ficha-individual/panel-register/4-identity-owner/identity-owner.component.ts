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
import { FichaCatastralIndividual } from '../../models/fichaCatastralIndividual.model';
  
@Component({
    selector: 'app-identity-owner',
    templateUrl: './identity-owner.component.html',
    styleUrls: ['./identity-owner.component.css']
})
export class IdentityOwnerComponent implements OnInit, OnDestroy  {

    @Output() outputSeccion = new EventEmitter<IdentityOwnerRequest>();

    @Input() inputSeccion: IdentityOwnerRequest = { idObjeto: 0 };

    @Output() roomComplete = new EventEmitter<boolean>();
    // @Input() idFicha:number = 0;
    // @Input() dataThirdShared: SharedThirdData;
    @Input() Stepper: MatStepper;    
    //progress: boolean = false;
    disabledTipoTitular: boolean = false;

    public saveIT$: Subscription = new Subscription;
    public editData$: Subscription = new Subscription;
    
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
    dataEdit: FichaCatastralIndividual;

    msgTipoTitular: boolean = false;
    ctrlTipoTitular: boolean = false;
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

                this.msgTipoTitular = true;
                if(data.codigoCondicionTitular != '') { 
                    this.ctrlTipoTitular = true; 
                    this.msgTipoTitular = false;
                }

                this.disabledTipoTitular = false;
                this.btnAgregarNatural = true;
                this.ctrlConConyugue = true;
                this.natural = false;
                this.juridica = false;
                this.displayName = '';
                this.mTitular = { IdEstadoCivil: 0, DocIdentidad: ['','','','','','','','','','']};
                this.mConyuge = { DocIdentidad: ['','','','','','','','','','']};
                this.mEmpresa = { IdPersonaJuridica: 0, DocIdentidad: ['','','','','','','','','','']};
                this.sucesion = false;

                this.inputSeccion.c26TipoTitular = '';
                this.inputSeccion.conTitular = false;
                this.inputSeccion.conConyuge = false;
                this.inputSeccion.conEmpresa = false;

                this.form.patchValue({ 
                    tipotitular: 0
                });

                console.log(data.codigoCondicionTitular);
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
                    this.disabledTipoTitular = true;

                    this.listTipoTitular.forEach(item => {
                        if(item.code == '01') {
                            this.form.patchValue({ 
                                tipotitular: item.value
                            });
                            this.inputSeccion.c26TipoTitular = item.code;
                        }           
                    });                    

                    this.natural = true;
                    this.juridica = false;

                    let tt = this.form.get('tipotitular');
                    
                    tt.disable();
                    tt.updateValueAndValidity();                    

                }
                else if(data.codigoCondicionTitular == '05') //COTITULARIDAD
                {
                    this.ctrlTipoTitular = false;
                    this.msgTipoTitular = false;
                    this.roomComplete.next(true);
                    setTimeout(() => {
                        this.Stepper.next();
                      }, 500); 
                }
                else if(data.codigoCondicionTitular == '06' //LITIGIO
                        || data.codigoCondicionTitular == '07'//OTROS
                ) 
                {
                    this.ctrlTipoTitular = false;
                    this.msgTipoTitular = false;
                    this.natural = true;
                    this.btnAgregarNatural = false;
                    this.ctrlConConyugue = false;
                    this.displayName = 'NNN';
                    this.btnNextDisabled = false;
                }

                this.outputSeccion.next(this.inputSeccion);
            }
        });

        // this.editData$ = this._fichaIndividualService.obsEditFichaCatastralIndividual.subscribe({
        //     next:(data) => {
        //         this.dataEdit = data;
        //     }
        //   });
    }

    ngOnDestroy(): void {
        this.saveIT$.unsubscribe();
        this.editData$.unsubscribe();
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
                this.inputSeccion.c26TipoTitular = item.code;
            }            
        });        
        this.outputSeccion.next(this.inputSeccion);        
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

            this.inputSeccion.c26TipoTitular = '01';
            this.inputSeccion.c27EstadoCivil = result.Titular.CodeEstadoCivil;
            this.inputSeccion.c28aTipoDocumento = result.Titular.CodeTipoDocIdentidad;
            this.inputSeccion.c29aNroDocumento = result.Titular.NroDocIdentidad;
            this.inputSeccion.c30aNombres = result.Titular.Nombres;
            this.inputSeccion.c31aApellidoPaterno = result.Titular.ApellidoPaterno;
            this.inputSeccion.c32aApellidoMaterno = result.Titular.ApellidoMaterno;
            this.inputSeccion.conTitular = true;
            if(result.ConConyuge){
                this.inputSeccion.c28bTipoDocumento = result.Conyuge.CodeTipoDocIdentidad;
                this.inputSeccion.c29bNroDocumento = result.Conyuge.NroDocIdentidad;
                this.inputSeccion.c30bNombres = result.Conyuge.Nombres;
                this.inputSeccion.c31bApellidoPaterno = result.Conyuge.ApellidoPaterno;
                this.inputSeccion.c32bApellidoMaterno = result.Conyuge.ApellidoMaterno;
                this.inputSeccion.conConyuge = true;
            }

            this.titleBtn = 'Modificar';
            this.mTitular = result.Titular;
            this.displayName = result.Titular.Nombres;
            if(this.ctrlConConyugue) this.mConyuge = result.Conyuge;
            
            this.outputSeccion.next(this.inputSeccion);
            //this.btnNextDisabled = false;
            //this.roomComplete.emit(false);
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

            this.inputSeccion.c26TipoTitular = '02';
            this.inputSeccion.c33PersonaJuridica = result.Empresa.CodePersonaJuridica;
            this.inputSeccion.c34Ruc = result.Empresa.RUC;
            this.inputSeccion.c35TelefonoAnexo = result.Empresa.TelefonoAnexo;
            this.inputSeccion.c36RazonSocial = result.Empresa.RazonSocial;
            this.inputSeccion.c37CorreoElectronico = result.Empresa.Email;
            this.inputSeccion.conEmpresa = true;

            this.titleBtnLegal = 'Modificar';

            this.outputSeccion.next(this.inputSeccion);
            //this.btnNextDisabled = false;
            //this.roomComplete.emit(false);
          }            
        });
    }

    AgregarPersonaJuridica(){
        this.PersonaJuridicaModal('300ms', '300ms');
    }

    // ModalMessage(): any {     
    //     let modal: Title = { 
    //       Title: 'Guardando las características de la titularidad...'}
    //     let dgRef = this.dialog.open(ModalLoadingComponent, {
    //         width: '400px',
    //         height: '95px',
    //         enterAnimationDuration: '300ms',
    //         exitAnimationDuration: '300ms',
    //         disableClose: true,
    //         data: modal
    //     }); 
  
    //     return dgRef;
    // }

    // goNext(){

    //     let dg = this.ModalMessage();

    //     //this.dataSave.idObjeto = this.idFicha;
    //     this.dataSave.usuarioCreacion = 'carevalo';
    //     this.dataSave.terminalCreacion = "";

    //     this.saveIT$ = this._fichaIndividualService.save4IdentificacionTitular(this.dataSave)
    //     .subscribe(result => {
            
    //         dg.close();

    //         if(result.success){

    //             this.dataEdit.seccion4 = this.dataSave;
    //             this._fichaIndividualService.obsEditFichaCatastralIndividual.next(this.dataEdit);

    //             this.roomComplete.emit(true);                
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
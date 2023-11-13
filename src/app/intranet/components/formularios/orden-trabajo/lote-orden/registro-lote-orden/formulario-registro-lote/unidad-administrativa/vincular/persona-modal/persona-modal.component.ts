import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef, Input  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { PersonaModel } from 'src/app/intranet/components/formularios/models/personaModel';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { UnidadAdministrativaService } from '../../unidad-administrativa.service';
import { ReniecModel } from 'src/app/intranet/components/formularios/models/reniecModel';
import { Subscription } from 'rxjs';
import { InteresadoResponse } from 'src/app/intranet/components/formularios/models/interesadoRequest';

@Component({
    selector: 'app-persona-modal',
    templateUrl: './persona-modal.component.html',
    styleUrls: ['./persona-modal.component.css']
})
export class PersonaModalComponent implements OnInit, OnDestroy {

    pattern1Digs = '^[1-9]|([1-9][0-9])$';

    form: FormGroup;

    codigoTD: string = '';
    codigoTDConyuge: string = '';
    conConyuge: boolean = false;
    natural: boolean = true;

    listEstadoCivil: ItemSelect<number>[] = [];
    listSexo: ItemSelect<number>[] = [];
    listTipoDocIdent: ItemSelect<number>[] = [];
    listTipoDocIdentConyuge: ItemSelect<number>[] = [];
    listTipoTitular:  ItemSelect<number>[] = [];
        
    public reniec$: Subscription = new Subscription;
    public reniecConyugue$: Subscription = new Subscription;
    
    constructor(
      public dialogRef: MatDialogRef<PersonaModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: PersonaModel,
      private _unidadAdministrativaService: UnidadAdministrativaService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){
        this.form = this.fb.group({
            codigocontribuyente: ['', Validators.required],
            nrocotitular: [{value: 0, disabled: true}],
            tipotitular: [0, Validators.required],
            porccotitular: ['', Validators.required],
            ruc: ['', [Validators.required, Validators.pattern('[0-9]+')]],
            razonsocial: [''],
            telefonoempresa: [''],
            correoempresa: [''],
            estadocivil: [{value: 0, disabled: true}, Validators.required],
            sexo: [ 0, Validators.required],
            tipodocidentidad: [0, Validators.required],  
            nrodocidentidad: ['', [Validators.required, Validators.pattern('[0-9]+')]],                      
            nombres: [{value: '', disabled: true}, Validators.required],
            apellidopaterno: [{value: '', disabled: true}, Validators.required],
            apellidomaterno: [{value: '', disabled: true}],
            telefono: [''],
            correo: [''],
            tipodocidentidadconyuge: [0, Validators.required],
            nrodocidentidadconyuge: ['', [Validators.required, Validators.pattern('[0-9]+')]],
            nombresconyuge: [{value: '', disabled: true}, Validators.required],
            apellidopaternoconyuge: [{value: '', disabled: true}, Validators.required],
            apellidomaternoconyuge: [{value: '', disabled: true}],
            sexoconyuge: [ 0, Validators.required],
        });

        this.listEstadoCivil = getFilterMasterCatalog(CatalogoMasterEnum.EstadoCivil);
        this.listSexo = getFilterMasterCatalog(CatalogoMasterEnum.Sexo);
        this.listTipoDocIdent = getFilterMasterCatalog(CatalogoMasterEnum.TipoDocIdentidadTitular);
        this.listTipoDocIdentConyuge = getFilterMasterCatalog(CatalogoMasterEnum.TipoDocIdentidadTitular);
        this.listTipoTitular = getFilterMasterCatalog(CatalogoMasterEnum.TipoTitular);
    }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnInit(): void {
        this.conConyuge = this.data.ConConyuge;
        this.form.patchValue({
            codigocontribuyente: this.data.codigoContribuyente
        });

        this.listTipoTitular.forEach(item => {
            if(item.code == '01') {
                this.form.patchValue({ 
                    tipotitular: item.value
                });
                this.onChangeSelTipoTitular(item.value.toString())
            }           
        });        
        if(this.conConyuge){
            let tt = this.form.get('tipotitular');
            tt.disable();
            tt.updateValueAndValidity();           
        }
    }

    onChangeSelTipoTitular(newValue: string){
        let id = parseInt(newValue);
        this.listTipoTitular.forEach(item => {
            if(item.value == id){

                this.form.patchValue({ 
                    tipodocidentidad: 0,
                    apellidopaterno: '',
                    apellidomaterno: '',
                    nombres: '',
                    estadocivil: 0,
                    ruc: '',
                    razonsocial: '',
                    tipodocidentidadconyuge: 0,
                    nrodocidentidadconyuge: '',
                    nombresconyuge: '',
                    apellidopaternoconyuge: '',
                    apellidomaternoconyuge: ''
                });

                if(item.code == '01') { 
                    this.natural = true; 

                    const ruc = this.form.get('ruc');
                    ruc.clearValidators();
                    ruc.updateValueAndValidity();

                    const razonsocial = this.form.get('razonsocial');                    
                    razonsocial.clearValidators();                    
                    razonsocial.updateValueAndValidity();

                    const tipodocidentidad = this.form.get('tipodocidentidad');
                    const nrodocidentidad = this.form.get('nrodocidentidad');
                    const apellidopaterno = this.form.get('apellidopaterno');
                    const apellidomaterno = this.form.get('apellidomaterno');
                    const nombres = this.form.get('nombresconyuge');

                    tipodocidentidad.addValidators(Validators.required);
                    nrodocidentidad.addValidators(Validators.required);
                    apellidopaterno.addValidators(Validators.required);
                    apellidomaterno.addValidators(Validators.required);
                    nombres.addValidators(Validators.required);

                    const tipodocidentidadconyuge = this.form.get('tipodocidentidadconyuge');
                    const nrodocidentidadconyuge = this.form.get('nrodocidentidadconyuge');
                    const apellidopaternoconyuge = this.form.get('apellidopaternoconyuge');
                    const apellidomaternoconyuge = this.form.get('apellidomaternoconyuge');
                    const nombresconyuge = this.form.get('nombresconyuge');

                    if(this.conConyuge){
                        tipodocidentidadconyuge.addValidators(Validators.required);
                        nrodocidentidadconyuge.addValidators(Validators.required);
                        apellidopaternoconyuge.addValidators(Validators.required);
                        apellidomaternoconyuge.addValidators(Validators.required);
                        nombresconyuge.addValidators(Validators.required);
                    }
                    else{
                        tipodocidentidadconyuge.clearValidators();
                        nrodocidentidadconyuge.clearValidators();                        
                        apellidopaternoconyuge.clearValidators();                        
                        apellidomaternoconyuge.clearValidators();
                        nombresconyuge.clearValidators();
                    }

                    tipodocidentidad.updateValueAndValidity();
                    nrodocidentidad.updateValueAndValidity();                      
                    apellidopaterno.updateValueAndValidity();
                    apellidomaterno.updateValueAndValidity();
                    nombres.updateValueAndValidity();

                    tipodocidentidadconyuge.updateValueAndValidity();
                    nrodocidentidadconyuge.updateValueAndValidity();                      
                    apellidopaternoconyuge.updateValueAndValidity();
                    apellidomaternoconyuge.updateValueAndValidity();
                    nombresconyuge.updateValueAndValidity();
                }
                else { 
                    this.natural = false; 

                    this.form.patchValue({ 
                        ruc: '',
                        razonsocial: ''
                    });

                    const ruc = this.form.get('ruc');
                    ruc.addValidators(Validators.required);
                    ruc.updateValueAndValidity();

                    const razonsocial = this.form.get('razonsocial');                    
                    razonsocial.addValidators(Validators.required);
                    razonsocial.updateValueAndValidity();   
                    
                    const tipodocidentidad = this.form.get('tipodocidentidad');
                    const nrodocidentidad = this.form.get('nrodocidentidad');
                    const apellidopaterno = this.form.get('apellidopaterno');
                    const apellidomaterno = this.form.get('apellidomaterno');
                    const nombres = this.form.get('nombres');
                    const estadocivil = this.form.get('estadocivil');
                    const tipodocidentidadconyuge = this.form.get('tipodocidentidadconyuge');
                    const nrodocidentidadconyuge = this.form.get('nrodocidentidadconyuge');
                    const apellidopaternoconyuge = this.form.get('apellidopaternoconyuge');
                    const apellidomaternoconyuge = this.form.get('apellidomaternoconyuge');
                    const nombresconyuge = this.form.get('nombresconyuge');

                    tipodocidentidad.clearValidators();
                    nrodocidentidad.clearValidators();
                    apellidopaterno.clearValidators();
                    apellidomaterno.clearValidators();
                    nombres.clearValidators();
                    estadocivil.clearValidators();
                    tipodocidentidadconyuge.clearValidators();
                    nrodocidentidadconyuge.clearValidators();
                    apellidopaternoconyuge.clearValidators();
                    apellidomaternoconyuge.clearValidators();
                    nombresconyuge.clearValidators();

                    tipodocidentidad.updateValueAndValidity();
                    nrodocidentidad.updateValueAndValidity();
                    apellidopaterno.updateValueAndValidity();
                    apellidomaterno.updateValueAndValidity();
                    nombres.updateValueAndValidity(); 
                    estadocivil.updateValueAndValidity();
                    tipodocidentidadconyuge.updateValueAndValidity();
                    nrodocidentidadconyuge.updateValueAndValidity(); 
                    apellidopaternoconyuge.updateValueAndValidity();
                    apellidomaternoconyuge.updateValueAndValidity();
                    nombresconyuge.updateValueAndValidity();
                }
            };
        });        
    }

    onChangeSelDocIdent(newValue: string){
        this.codigoTD = '';
        this.listTipoDocIdent.forEach(item => {
            if(item.value == parseInt(newValue)){
                this.codigoTD = item.code;
            };
        });

        const nrodocidentidad = this.form.get('nrodocidentidad');
        const apellidopaterno = this.form.get('apellidopaterno');
        const apellidomaterno = this.form.get('apellidomaterno');
        const nombres = this.form.get('nombres');
        const estadocivil = this.form.get('estadocivil');

        nrodocidentidad.addValidators(Validators.required);
        nrodocidentidad.enable();
        apellidopaterno.enable();
        apellidomaterno.enable();
        nombres.enable();
        estadocivil.enable();

        if(this.codigoTD == "01"){            
            this.form.patchValue({ nrodocidentidad: '' });
            nrodocidentidad.disable();
            nrodocidentidad.clearValidators();
        }
        else if(this.codigoTD == "02"){            
            this.form.patchValue({ 
                nrodocidentidad: '',
                apellidopaterno: '',
                apellidomaterno: '',
                nombres: '',
                estadocivil: 0,
                sexo: 0
             });

            apellidopaterno.disable();
            apellidomaterno.disable();
            nombres.disable();
            estadocivil.disable();

            nrodocidentidad.addValidators(Validators.required);
            apellidopaterno.addValidators(Validators.required);
            apellidomaterno.addValidators(Validators.required);
            nombres.addValidators(Validators.required);
            estadocivil.addValidators(Validators.required);
        }

        nrodocidentidad.updateValueAndValidity();
        apellidopaterno.updateValueAndValidity();
        apellidomaterno.updateValueAndValidity();
        nombres.updateValueAndValidity();
        estadocivil.updateValueAndValidity();
    }

    onChangeSelDocIdentConyugue(newValue: string){
        this.codigoTDConyuge = '';
        this.listTipoDocIdent.forEach(item => {
            if(item.value == parseInt(newValue)){
                this.codigoTDConyuge = item.code;
            };
        });

        const nrodocidentidadconyuge = this.form.get('nrodocidentidadconyuge');
        const apellidopaternoconyuge = this.form.get('apellidopaternoconyuge');
        const apellidomaternoconyuge = this.form.get('apellidomaternoconyuge');
        const nombresconyuge = this.form.get('nombresconyuge');

        nrodocidentidadconyuge.addValidators(Validators.required);
        nrodocidentidadconyuge.enable();
        apellidopaternoconyuge.enable();
        apellidomaternoconyuge.enable();
        nombresconyuge.enable();

        if( this.codigoTDConyuge == "01"){            
            this.form.patchValue({ nrodocidentidadconyuge: '' });
            nrodocidentidadconyuge.disable();
            nrodocidentidadconyuge.clearValidators();
        }
        else if(this.codigoTDConyuge == "02"){            
            this.form.patchValue({ 
                nrodocidentidadconyuge: '',
                apellidopaternoconyuge: '',
                apellidomaternoconyuge: '',
                nombresconyuge: '',
                sexoconyuge: 0
             });

            apellidopaternoconyuge.disable();
            apellidomaternoconyuge.disable();
            nombresconyuge.disable();

            nrodocidentidadconyuge.addValidators(Validators.required);
            apellidopaternoconyuge.addValidators(Validators.required);
            apellidomaternoconyuge.addValidators(Validators.required);
            nombresconyuge.addValidators(Validators.required);
        }

        nrodocidentidadconyuge.updateValueAndValidity();
        apellidopaternoconyuge.updateValueAndValidity();
        apellidomaternoconyuge.updateValueAndValidity();
        nombresconyuge.updateValueAndValidity();
    }

    ngOnDestroy(): void {
        this.reniec$.unsubscribe();
        this.reniecConyugue$.unsubscribe();
    }

    buscarPersona(e){   
        
        const nrodocidentidad = this.form.get('nrodocidentidad');

        this.reniec$ = this._unidadAdministrativaService.getConsultaReniec(nrodocidentidad.value)
        .subscribe(result => {
            if(result.success){
                let obj: ReniecModel = JSON.parse(result.data);
                
                if(obj.consultarResponse.return.deResultado == 'Consulta realizada correctamente'){
                    let persona = obj.consultarResponse.return.datosPersona;
                    let idEC: number = 0;
                    this.listEstadoCivil.forEach(el => {
                        if(el.text == persona.estadoCivil.toString().trim()) idEC = el.value;
                    });

                    this.form.patchValue({ 
                        apellidopaterno: persona.apPrimer,
                        apellidomaterno: persona.apSegundo,
                        nombres: persona.prenombres,
                        estadocivil: idEC
                    });
                }
                else{
                    const apellidopaterno = this.form.get('apellidopaterno');
                    const apellidomaterno = this.form.get('apellidomaterno');
                    const nombres = this.form.get('nombres');
                    const estadocivil = this.form.get('estadocivil');
                    apellidopaterno.enable();
                    apellidomaterno.enable();
                    nombres.enable();
                    estadocivil.enable();

                    this.form.patchValue({ 
                        apellidopaterno: '',
                        apellidomaterno: '',
                        nombres: '',
                        estadocivil: 0
                    });

                    apellidopaterno.updateValueAndValidity();
                    apellidomaterno.updateValueAndValidity();
                    nombres.updateValueAndValidity();
                    estadocivil.updateValueAndValidity();                    
                }
            }
        });

        e.stopPropagation();
        e.preventDefault();

        return false;
    }

    buscarConyugue(e){  
        const nrodocidentidadconyuge = this.form.get('nrodocidentidadconyuge');

        this.reniecConyugue$ = this._unidadAdministrativaService.getConsultaReniec(nrodocidentidadconyuge.value)
        .subscribe(result => {
            if(result.success){
                let obj: ReniecModel = JSON.parse(result.data);
                console.log(obj);
                if(obj.consultarResponse.return.deResultado == 'Consulta realizada correctamente'){
                    let persona = obj.consultarResponse.return.datosPersona;

                    this.form.patchValue({ 
                        apellidopaternoconyuge: persona.apPrimer,
                        apellidomaternoconyuge: persona.apSegundo,
                        nombresconyuge: persona.prenombres
                    });
                }
                else{
                    const apellidopaternoconyuge = this.form.get('apellidopaternoconyuge');
                    const apellidomaternoconyuge = this.form.get('apellidomaternoconyuge');
                    const nombresconyuge = this.form.get('nombresconyuge');
                    apellidopaternoconyuge.enable();
                    apellidomaternoconyuge.enable();
                    nombresconyuge.enable();
                    
                    this.form.patchValue({ 
                        apellidopaternoconyuge: '',
                        apellidomaternoconyuge: '',
                        nombresconyuge: ''
                    });

                    apellidopaternoconyuge.updateValueAndValidity();
                    apellidomaternoconyuge.updateValueAndValidity();
                    nombresconyuge.updateValueAndValidity();                 
                }                
            }
        });

        e.stopPropagation();
        e.preventDefault();

        return false;
    }   

    guardar(){
        let info = this.form.value;

        let inter: InteresadoResponse = {
            codigoInteresado: this.data.Interesado.codigoInteresado
        };

        this.listTipoTitular.forEach(item => {
            if(item.value == info.tipotitular){
                inter.codigoContribRentas = info.codigocontribuyente;
                inter.porcetajeCotitular = info.porccotitular;
                inter.codigoTipoCotitular = item.code;
                if(item.code == '01') //PERSONA NATURAL
                { 
                    const apellidopaterno = this.form.get('apellidopaterno');
                    const apellidomaterno = this.form.get('apellidomaterno');
                    const nombres = this.form.get('nombres');

                    inter.tipoPersona = "PERSONA NATURAL"
                    inter.numeroDocumento = info.nrodocidentidad;
                    inter.apellidoPaterno = apellidopaterno.value;
                    inter.apellidoMaterno = apellidomaterno.value;
                    inter.nombres = nombres.value;
                    inter.numeroTelefono = info.telefono;
                    inter.correoElectronico = info.correo;

                    this.listEstadoCivil.forEach(ec => {
                      if(ec.value == info.estadocivil) {
                        inter.codigoEstadoCivil = ec.code;
                        inter.estadoCivil = ec.text;
                      }
                    });

                    this.listTipoDocIdent.forEach(ec => {
                        if(ec.value == info.tipodocidentidad) {
                          inter.codigoTipoDocumento = ec.code;
                          inter.tipoDocumento = ec.text;
                        }
                    });
                }
                else { //PERSONA JURIDICA
                    inter.tipoPersona = "PERSONA JURIDICA"
                    inter.codigoTipoDocumento = '09';
                    inter.tipoDocumento = 'R.U.C.';
                    inter.numeroDocumento = info.ruc;
                    inter.razonSocial = info.razonSocial
                    inter.numeroTelefono = info.telefonoempresa;
                    inter.correoElectronico = info.correoempresa;
                }
            };
        });        

        this.form.reset();
        this.dialogRef.close({ success: true, datos: inter });
    }

}
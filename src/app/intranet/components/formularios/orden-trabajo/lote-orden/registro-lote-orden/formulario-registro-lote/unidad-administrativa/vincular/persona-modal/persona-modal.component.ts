import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef, Input  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { PersonaModel } from 'src/app/intranet/components/formularios/models/personaModel';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { UnidadAdministrativaService } from '../../unidad-administrativa.service';
import { ReniecModel } from 'src/app/intranet/components/formularios/models/reniecModel';
import { Subscription } from 'rxjs';
import { InteresadoResponse } from 'src/app/intranet/components/formularios/models/interesadoRequest';
import { ImagenModel } from 'src/app/core/models/imagen.model';
import { ImageViewerComponent } from 'src/app/core/shared/components/image-viewer/image-viewer.component';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';

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
        
    public imagenes: ImagenModel[] = [];
    public reniec$: Subscription = new Subscription;
    public reniecConyugue$: Subscription = new Subscription;
    
    constructor(
      public dialogRef: MatDialogRef<PersonaModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: PersonaModel,
      private _unidadAdministrativaService: UnidadAdministrativaService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef,
      public dialog: MatDialog
    ){
        this.form = this.fb.group({
            codigocontribuyente: ['', Validators.required],
            nrocotitular: [{value: 0, disabled: true}],
            tipotitular: [0, Validators.required],
            porccotitular: ['', Validators.required],
            ruc: ['', [Validators.required, Validators.pattern('[0-9]+')]],
            razonsocial: [''],
            telefonoempresa: [''],
            correoempresa: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
            estadocivil: [{value: 0, disabled: true}, Validators.required],
            sexo: [ 0, Validators.required],
            tipodocidentidad: [0, Validators.required],  
            nrodocidentidad: ['', [Validators.required, Validators.pattern('[0-9]+')]],                      
            nombres: [{value: '', disabled: true}, Validators.required],
            apellidopaterno: [{value: '', disabled: true}, Validators.required],
            apellidomaterno: [{value: '', disabled: true}],
            telefono: [''],
            correo: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
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
        //console.log(this.data);
        this.conConyuge = this.data.ConConyuge;
        if(this.data.codigoContribuyente != undefined){
            this.form.patchValue({
                codigocontribuyente: this.data.codigoContribuyente
            });
        }

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
            tt.setValue(this.getValue('01', this.listTipoTitular));
            tt.disable();
            tt.updateValueAndValidity();           
        }

        //edición        
        if(this.data.Interesado != undefined &&
            this.data.Interesado.codigoInteresado != undefined &&
            this.data.Interesado.codigoInteresado != 0){
                let inter = this.data.Interesado;
                //console.log(inter);
                this.form.patchValue({
                    codigocontribuyente: inter.codigoContribRentas,
                    porccotitular: inter.porcetajeCotitular,
                    tipotitular: this.getValue(inter.codigoTipoCotitular, this.listTipoTitular)
                });

                if(inter.codigoTipoCotitular == '01') //PERSONA NATURAL
                {
                    this.natural = true;
                    this.codigoTD = inter.codigoTipoDocumento;
                    this.form.patchValue({
                        tipodocidentidad: this.getValue(inter.codigoTipoDocumento, this.listTipoDocIdent),
                        nrodocidentidad: inter.numeroDocumento,
                        nombres: inter.nombres,
                        apellidopaterno: inter.apellidoPaterno,
                        apellidomaterno: inter.apellidoMaterno,
                        sexo: this.getValue(inter.codigoTipoGenero, this.listSexo),
                        estadocivil: this.getValue(inter.codigoEstadoCivil, this.listEstadoCivil),
                        telefono: inter.numeroTelefono,
                        correo: inter.correoElectronico
                    });                    
                    
                    if(inter.listConyuge.length == 0){
                        this.conConyuge = true;
                        let conyuge = inter.listConyuge[0];
                        this.form.patchValue({
                            tipodocidentidadconyuge: this.getValue(conyuge.codigoTipoDocumento, this.listTipoDocIdentConyuge),
                            nrodocidentidadconyuge: conyuge.numeroDocumento,
                            nombresconyuge: conyuge.nombres,
                            apellidopaternoconyuge: conyuge.apellidoPaterno,
                            apellidomaternoconyuge: conyuge.apellidoMaterno,
                            sexoconyuge: this.getValue(conyuge.codigoTipoGenero, this.listSexo)
                        });
                    }
                }
                else if(inter.codigoTipoCotitular == '02') //PERSONA NATURAL
                {
                    this.natural = false;
                    this.form.patchValue({
                        ruc: inter.numeroDocumento,
                        razonsocial: inter.razonSocial,
                        telefonoempresa: inter.numeroTelefono,
                        correoempresa: inter.correoElectronico
                    });                    
                }
        }

    }

    getValue(code: string, ds: any[]) {
        let id = 0;
        ds.forEach(elem => {
            if(elem.code == code) id = elem.value;
        }); 
        return id;
    }

    getCode(value: number, ds: any[]) {
        let code = '';
        ds.forEach(elem => {
            if(elem.value == value) code = elem.code;
        }); 
        return code;
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
                    const sexo = this.form.get('sexo');

                    tipodocidentidad.addValidators(Validators.required);
                    nrodocidentidad.addValidators(Validators.required);
                    apellidopaterno.addValidators(Validators.required);
                    apellidomaterno.addValidators(Validators.required);
                    nombres.addValidators(Validators.required);
                    sexo.addValidators(Validators.required);

                    const tipodocidentidadconyuge = this.form.get('tipodocidentidadconyuge');
                    const nrodocidentidadconyuge = this.form.get('nrodocidentidadconyuge');
                    const apellidopaternoconyuge = this.form.get('apellidopaternoconyuge');
                    const apellidomaternoconyuge = this.form.get('apellidomaternoconyuge');
                    const nombresconyuge = this.form.get('nombresconyuge');
                    const sexoconyuge = this.form.get('sexoconyuge');

                    if(this.conConyuge){
                        tipodocidentidadconyuge.addValidators(Validators.required);
                        nrodocidentidadconyuge.addValidators(Validators.required);
                        apellidopaternoconyuge.addValidators(Validators.required);
                        apellidomaternoconyuge.addValidators(Validators.required);
                        nombresconyuge.addValidators(Validators.required);
                        sexoconyuge.addValidators(Validators.required);
                    }
                    else{
                        tipodocidentidadconyuge.clearValidators();
                        nrodocidentidadconyuge.clearValidators();                        
                        apellidopaternoconyuge.clearValidators();                        
                        apellidomaternoconyuge.clearValidators();
                        nombresconyuge.clearValidators();
                        sexoconyuge.clearValidators();
                    }

                    tipodocidentidad.updateValueAndValidity();
                    nrodocidentidad.updateValueAndValidity();                      
                    apellidopaterno.updateValueAndValidity();
                    apellidomaterno.updateValueAndValidity();
                    nombres.updateValueAndValidity();
                    sexo.updateValueAndValidity();

                    tipodocidentidadconyuge.updateValueAndValidity();
                    nrodocidentidadconyuge.updateValueAndValidity();                      
                    apellidopaternoconyuge.updateValueAndValidity();
                    apellidomaternoconyuge.updateValueAndValidity();
                    nombresconyuge.updateValueAndValidity();
                    sexoconyuge.updateValueAndValidity();
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
                    const sexo = this.form.get('sexo');
                    const tipodocidentidadconyuge = this.form.get('tipodocidentidadconyuge');
                    const nrodocidentidadconyuge = this.form.get('nrodocidentidadconyuge');
                    const apellidopaternoconyuge = this.form.get('apellidopaternoconyuge');
                    const apellidomaternoconyuge = this.form.get('apellidomaternoconyuge');
                    const nombresconyuge = this.form.get('nombresconyuge');
                    const sexoconyuge = this.form.get('sexoconyuge');

                    tipodocidentidad.clearValidators();
                    nrodocidentidad.clearValidators();
                    apellidopaterno.clearValidators();
                    apellidomaterno.clearValidators();
                    nombres.clearValidators();
                    estadocivil.clearValidators();
                    sexo.clearValidators();
                    tipodocidentidadconyuge.clearValidators();
                    nrodocidentidadconyuge.clearValidators();
                    apellidopaternoconyuge.clearValidators();
                    apellidomaternoconyuge.clearValidators();
                    nombresconyuge.clearValidators();
                    sexoconyuge.clearValidators();

                    tipodocidentidad.updateValueAndValidity();
                    nrodocidentidad.updateValueAndValidity();
                    apellidopaterno.updateValueAndValidity();
                    apellidomaterno.updateValueAndValidity();
                    nombres.updateValueAndValidity(); 
                    estadocivil.updateValueAndValidity();
                    sexo.updateValueAndValidity();
                    tipodocidentidadconyuge.updateValueAndValidity();
                    nrodocidentidadconyuge.updateValueAndValidity(); 
                    apellidopaternoconyuge.updateValueAndValidity();
                    apellidomaternoconyuge.updateValueAndValidity();
                    nombresconyuge.updateValueAndValidity();
                    sexoconyuge.updateValueAndValidity();
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
        
        let dg = this.ModalLoading();
        const nrodocidentidad = this.form.get('nrodocidentidad');

        this.reniec$ = this._unidadAdministrativaService.getConsultaReniec(nrodocidentidad.value)
        .subscribe(result => {
            dg.close();
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

        let dg = this.ModalLoading();
        const nrodocidentidadconyuge = this.form.get('nrodocidentidadconyuge');

        this.reniecConyugue$ = this._unidadAdministrativaService.getConsultaReniec(nrodocidentidadconyuge.value)
        .subscribe(result => {
            dg.close();
            if(result.success){
                let obj: ReniecModel = JSON.parse(result.data);

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

    quitarImagen(img: ImagenModel){
        let listaImagenes: ImagenModel[] = [];
        this.imagenes.forEach(el => {
            if(el.id != img.id) listaImagenes.push(el);
        });

        this.imagenes = listaImagenes;
    }

    capturarFile(event){
        
        let idmax: number = 0;
        let total = event.target.files.length;

        if(this.imagenes.length > 0){
            idmax = Math.max.apply(Math, this.imagenes.map(function(o) { return o.id; }));
        }

        for (let i = 0; i < total; i++) {
            const archivoCapturado = event.target.files[i];
            this.extraerBase64(archivoCapturado).then((imagen: any) => {
                //this.previsualizacion = imagen.base;
    
                this.imagenes.push({
                    id: idmax + i + 1,
                    name: archivoCapturado.name,
                    tamanioBytes: archivoCapturado.size,
                    tamanio: Math.floor(archivoCapturado.size / 1024 ) + ' KB',
                    type: archivoCapturado.type,
                    base64: imagen.base,
                    imagen: archivoCapturado
                });
            }); 
        }
    }

    extraerBase64 = async($event: any) => new Promise((resolve, reject) => {
        try{
            const reader = new FileReader();
            reader.readAsDataURL($event);
            reader.onload = () => {
                resolve({
                    base: reader.result
                });
            };
            reader.onerror = error => {
                resolve({
                    base: null
                })
            }
        } catch(e){
            return null;
        }
    });

    verImagen(e, img){
        let dgRef = this.dialog.open(ImageViewerComponent, {
            width: 'auto',
            height: 'auto',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: img
        }); 
        
        e.stopPropagation();
        e.preventDefault();
      }

    guardar(){
        let info = this.form.value;

        let inter: InteresadoResponse = {
            codigoInteresado: this.data.Interesado.codigoInteresado,
            listConyuge: [],
            listArchivo: []
        };

        const tipotitular = this.form.get('tipotitular');

        this.listTipoTitular.forEach(item => {
            if(item.value == tipotitular.value){
                inter.codigoContribRentas = info.codigocontribuyente;
                inter.porcetajeCotitular = info.porccotitular;
                inter.codigoTipoCotitular = item.code;
                if(item.code == '01') //PERSONA NATURAL
                { 
                    const apellidopaterno = this.form.get('apellidopaterno');
                    const apellidomaterno = this.form.get('apellidomaterno');
                    const nombres = this.form.get('nombres');

                    inter.nombreTipoCotitular = "PERSONA NATURAL"
                    inter.numeroDocumento = info.nrodocidentidad;
                    inter.apellidoPaterno = apellidopaterno.value;
                    inter.apellidoMaterno = apellidomaterno.value;
                    inter.nombres = nombres.value;
                    inter.numeroTelefono = info.telefono;
                    inter.correoElectronico = info.correo;
                    inter.codigoTipoGenero = this.getCode(info.sexo, this.listSexo);

                    const estadocivil = this.form.get('estadocivil');
                    this.listEstadoCivil.forEach(ec => {
                      if(ec.value == estadocivil.value) {
                        inter.codigoEstadoCivil = ec.code;
                        inter.nombreTipoEstadoCivil = ec.text;
                      }
                    });

                    this.listTipoDocIdent.forEach(ec => {
                        if(ec.value == info.tipodocidentidad) {
                          inter.codigoTipoDocumento = ec.code;
                          inter.nombreTipoDocumento = ec.text;
                        }
                    });

                    //inter.conConyuge = this.conConyuge;
                    if(this.conConyuge){
                        const apellidopaternoconyuge = this.form.get('apellidopaternoconyuge');
                        const apellidomaternoconyuge = this.form.get('apellidomaternoconyuge');
                        const nombresconyuge = this.form.get('nombresconyuge');

                        inter.listConyuge.push({
                            apellidoPaterno: apellidopaternoconyuge.value,
                            apellidoMaterno: apellidomaternoconyuge.value,
                            nombres: nombresconyuge.value,
                            codigoTipoDocumento: this.getCode(info.tipodocidentidadconyuge, this.listTipoDocIdentConyuge),
                            numeroDocumento: info.nrodocidentidadconyuge,
                            codigoTipoGenero: this.getCode(info.sexoconyuge, this.listSexo)
                        });
                    }
                }
                else { //PERSONA JURIDICA
                    inter.nombreTipoCotitular = "PERSONA JURIDICA"
                    inter.codigoTipoDocumento = '09';
                    inter.nombreTipoDocumento = 'R.U.C.';
                    inter.numeroDocumento = info.ruc;
                    inter.razonSocial = info.razonsocial;
                    inter.numeroTelefono = info.telefonoempresa;
                    inter.correoElectronico = info.correoempresa;
                }

                inter.listArchivo = this.imagenes;
            };
        });        

        this.form.reset();
        this.dialogRef.close({ success: true, datos: inter });
    }

    ModalLoading(): any {     
        let modal: Title = { 
          Title: 'Consultando a RENIEC...'}
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

}
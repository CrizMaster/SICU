import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { OrdenTrabajoService } from '../../../../orden-trabajo.service';
import { ActivatedRoute } from '@angular/router';
import { ViasCaracterizacion } from 'src/app/intranet/components/formularios/models/vias.model';
import { CaracterizacionResponse, FilterCaracterizacion } from 'src/app/intranet/components/formularios/models/caracterizacionResponse';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DomSanitizer } from '@angular/platform-browser';
import { ImagenModel } from 'src/app/core/models/imagen.model';
import { Title } from 'src/app/core/models/title.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { InformacionLoteRequest } from 'src/app/intranet/components/formularios/models/informacionLoteRequest';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { ImageViewerComponent } from 'src/app/core/shared/components/image-viewer/image-viewer.component';

  
@Component({
    selector: 'app-informacion-lote',
    templateUrl: './informacion-lote.component.html',
    styleUrls: ['./informacion-lote.component.css']
})
export class InformacionLoteComponent implements OnInit{

    @Input() Stepper: MatStepper;

    myForm: FormGroup;
    formVias: FormGroup;

    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    listTipoHU: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listTipoPuerta: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listCondicion: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];

    listVias: ViasCaracterizacion[] = [];
    filter: FilterCaracterizacion;

    codigoLoteCaracterizacion: string;
    codigoLote: number;

    public archivos: any = [];
    public previsualizacion: string;
    public imagenes: ImagenModel[] = [];

    public saveForm$: Subscription = new Subscription;
    public filter$: Subscription = new Subscription;
    public resolMenu$: Subscription = new Subscription;

    constructor(
        public subDialog: MatDialog,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private _ordenTrabajoService: OrdenTrabajoService,
        private actRoute: ActivatedRoute,
        private sanitizer: DomSanitizer,
        public dialog: MatDialog       
    ){
        this.listTipoHU = getFilterMasterCatalog(CatalogoMasterEnum.TipoHabilitacionUrbana);
        this.listTipoPuerta = getFilterMasterCatalog(CatalogoMasterEnum.TipoPuerta);
        this.listCondicion = getFilterMasterCatalog(CatalogoMasterEnum.CondicionNumeracion);
                
        this.filter$ = this._ordenTrabajoService.getFilterCaracterizacion.subscribe({
            next:(Data) => {
                  this.filter = Data;
              }
        });

        this.myForm = this.fb.group({
            codigoLoteCaracterizacion: [{value: '', disabled : true}, Validators.required],
            codigoLotePropuesta: [{value: '', disabled : true}, Validators.required],
            habilitacionUrbana: [{value: '', disabled : true}, Validators.required],
            tipoDivisionHabilitacion: [{value: '', disabled : true}, Validators.required],
            numeroDivision: [{value: '', disabled : true}, Validators.required],
            manzanaUrbana: [{value: '', disabled : true}, Validators.required],
            loteUrbano: [{value: '', disabled : true}, Validators.required],
            subLote: [{value: '', disabled : true}, Validators.required],
            checked: [false],
            vias: this.fb.array([],[Validators.required])
          });
    }

    CreateFormGroup(): FormGroup {
        return this.fb.group({
            nombreVia: [''],
            codigoVia: [''],
            checkedAct: [false],
            idTipoPuerta: [0, Validators.required],
            numeroOrden: [1, Validators.required],
            idCondicion: [0, Validators.required],
            numeroMunicipal: ['', Validators.required]
        });
    }

    get getFormControl(){
        const control = this.myForm.get('vias') as FormArray;
        return control;
    }

    addRow(){
        const control = this.myForm.get('vias') as FormArray;
        control.push(this.CreateFormGroup());
    }

    FindIdByCode(lista: any[], codigo: string): number {
        let id: number = 0;
        lista.forEach(e => {
            if(e.code == codigo) id = e.value;
        });
        return id;
    }

    FindCodeById(lista: any[], id: number): string {
        let code: string = '';
        lista.forEach(e => {
            if(e.value == id) code = e.code;
        });
        return code;
    }

    FindTextById(lista: any[], id: number): string {
        let text: string = '';
        lista.forEach(e => {
            if(e.value == id) text = e.text;
        });
        return text;
    }

    ngOnInit(): void {
   
        this.resolMenu$ = this.actRoute.data.subscribe(resp => {
       
            if(resp.resolve.success){
                let info:CaracterizacionResponse = resp.resolve.data;

                

                this.codigoLote = info.codigoLote;
                this.codigoLoteCaracterizacion = info.codigoLoteCaracterizacion;
                this.myForm.patchValue({ 
                    codigoLoteCaracterizacion: info.codigoLoteCaracterizacion, 
                    codigoLotePropuesta: info.codigoLoteCaracterizacion, 
                    tipoDivisionHabilitacion: info.sectorUrbano,
                    numeroDivision: info.tipoDivision,
                    manzanaUrbana: info.manzanaUrbana,
                    loteUrbano: info.loteUrbano,
                    subLote: info.subLote,
                  });

                info.listaVias.forEach(el => {
                    el.idTipoPuerta = (el.idTipoPuerta == null ? 0 : el.idTipoPuerta);
                    el.idCondicion = (el.idCondicion == null ? 0 : el.idCondicion);
                    el.checkedAct = true;

                    el.idTipoPuerta = this.FindIdByCode(this.listTipoPuerta, el.codigoTipoPuerta);
                    el.idCondicion = this.FindIdByCode(this.listCondicion, el.codigoCondicion);

                    const viasForm = this.fb.group({
                        nombreVia: [el.nombreVia],
                        codigoVia: [el.codigoVia],
                        idTipoPuerta: [el.idTipoPuerta, Validators.required],
                        checkedAct: [el.checkedAct],
                        numeroOrden: [el.numeroOrden, Validators.required],
                        idCondicion: [el.idCondicion, Validators.required],
                        numeroMunicipal: [el.numeroMunicipal, Validators.required],
                    });

                    const control = this.myForm.get('vias') as FormArray;
                    control.push(viasForm);

                });

                if(this.codigoLote > 0){
                    let con:number = 0;
                    info.listaArchivos.forEach(el => {
                        let imgBase64: any;
                        this._ordenTrabajoService.ConsultaFotoLote(el.codigoArchivo).subscribe({
                            next:(Data:StatusResponse<string>) => {
                                if(Data.success){
                                    con++;
                                    this.imagenes.push({
                                        id: con + 1,
                                        name: el.nombreArchivo,
                                        tamanioBytes: 1024,
                                        tamanio: '1.00 KB',
                                        type: 'png',
                                        base64: "data:image/jpeg;base64," + Data.data
                                    });
                                }
                              }
                        });
                    });

                    let vias: ViasCaracterizacion[] = [];
                    info.listaVias.forEach(el => {
                        if(el.checkedAct){
                            vias.push(el);
                        }
                    });

                    this._ordenTrabajoService.listaVias.next(vias);
                }
            }
            else{ console.log(resp.resolve.message); }
        });
    }

    ngOnDestroy(): void {
        this.filter$.unsubscribe();
        this.saveForm$.unsubscribe();
        this.resolMenu$.unsubscribe();
    }

    // ngAfterContentChecked(): void {
    //     this.cd.detectChanges();
    //   }

    Modifica(event: MatSlideToggleChange){
        if(!event.checked){
            this.myForm.patchValue({
                codigoLotePropuesta: this.codigoLoteCaracterizacion
            });             
        }
    }

    Activacion(event: MatSlideToggleChange, via: FormGroup){

        const numeroOrden = via.get('numeroOrden');
        const idTipoPuerta = via.get('idTipoPuerta');
        const idCondicion = via.get('idCondicion');
        const numeroMunicipal = via.get('numeroMunicipal');
        if(event.checked){
            numeroOrden.setValidators([Validators.required]);            
            idTipoPuerta.setValidators([Validators.required, Validators.pattern(this.pattern1Digs)]);
            idCondicion.setValidators([Validators.required, Validators.pattern(this.pattern1Digs)]);
            numeroMunicipal.setValidators([Validators.required]);

            numeroOrden.enable();
            idTipoPuerta.enable();
            idCondicion.enable();
            numeroMunicipal.enable();
        }
        else{
            numeroOrden.clearValidators();
            idTipoPuerta.clearValidators();
            idCondicion.clearValidators();
            numeroMunicipal.clearValidators();

            numeroOrden.disable();
            idTipoPuerta.disable();
            idCondicion.disable();
            numeroMunicipal.disable();
        }
        numeroOrden.updateValueAndValidity();
        numeroOrden.markAsUntouched();
        idTipoPuerta.updateValueAndValidity();
        idTipoPuerta.markAsUntouched();
        idCondicion.updateValueAndValidity();
        idCondicion.markAsUntouched();
        numeroMunicipal.updateValueAndValidity();
        numeroMunicipal.markAsUntouched();
    }

    CondicionNumerica(event: any, via: FormGroup){
        const numeroMunicipal = via.get('numeroMunicipal');
        const Condicion = via.get('idCondicion');        
        let idCondicion = parseInt(Condicion.value);
        if(idCondicion == 4){            
            numeroMunicipal.setValue('S/N');
            numeroMunicipal.disable();
        }
        else if(idCondicion == 5){
            numeroMunicipal.setValue('');
            numeroMunicipal.disable();
            numeroMunicipal.clearValidators();
        }
        else{
            numeroMunicipal.setValue('');
            numeroMunicipal.enable();
            numeroMunicipal.setValidators([Validators.required]);
        }
        numeroMunicipal.updateValueAndValidity();
        numeroMunicipal.markAsUntouched();        
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
                this.previsualizacion = imagen.base;
    
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
            //const unsafeIng = window.URL.createObjectURL($event);
            //const image = this.sanitizer.bypassSecurityTrustUrl(unsafeIng);
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

    guardar()
    {
        let info = this.myForm.value;

        const formularioDatos = new FormData();
        this.imagenes.forEach(imagen => {
            formularioDatos.append('guardarArchivos', imagen.imagen);
        });

        let request: InformacionLoteRequest = {
            usuarioCreacion: 'carevalo',
            terminalCreacion: '127.0.0.1',
            codigoRegistroCaracterizacion: this.filter.codigoCaracterizacion,
            codigoLoteCaracterizacion: this.filter.codigoLoteCaracterizacion,
            codigoDetalle: this.filter.codigoDetalle
        };

        request.listaVias = [];
        info.vias.forEach(el => {
            request.listaVias.push({
                usuarioCreacion: 'carevalo',
                terminalCreacion: '127.0.0.1',
                codigoVia: el.codigoVia,                
                activo: (el.checkedAct ? 1 : 0),
                numeroOrden: el.numeroOrden,
                codigoTipoPuerta: this.FindCodeById(this.listTipoPuerta, el.idTipoPuerta),
                codigoCondicion: this.FindCodeById(this.listCondicion, el.idCondicion),
                numeroMunicipal: el.numeroMunicipal
            });
        });

        formularioDatos.append('model', JSON.stringify(request));

        let modal1: Title = { Title: '¿Está seguro de actualizar el formulario?'}
        
        const subDialogModal = this.subDialog.open(ModalQuestionComponent, {
            width: '450px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal1
        });        

        subDialogModal.afterClosed().subscribe(resp => {
            if(resp){
              let dg = this.ModalLoading();

              this.saveForm$ = this._ordenTrabajoService.GuardaFormularioLote(formularioDatos)
              .subscribe(result => {    
                setTimeout(() => {
                  dg.close();
                  if(result.success) {                    

                    let filter: FilterCaracterizacion;
                    filter = this.filter;
                    filter.codigoLote = parseInt(result.data);
                    
                    this._ordenTrabajoService.filterCaracterizacion.next(filter);
  
                    let modal: Title = { 
                      Title: 'Formulario Actualizado', 
                      Subtitle: 'La información del lote se actualizó satisfactoriamente.', 
                      Icon: 'ok' 
                    }
  
                    const okModal = this.subDialog.open(ModalMessageComponent, {
                        width: '500px',
                        enterAnimationDuration: '300ms',
                        exitAnimationDuration: '300ms',
                        disableClose: true,
                        data: modal
                    });
  
                    okModal.afterClosed().subscribe(resp => {
                        if(resp) {
                            let vias: ViasCaracterizacion[] = [];
                            info.vias.forEach(el => {
                                if(el.checkedAct){
                                    el.nombreTipoPuerta = this.FindTextById(this.listTipoPuerta, el.idTipoPuerta)
                                    vias.push(el);
                                }
                            });

                            this._ordenTrabajoService.listaVias.next(vias);
                            this.Stepper.next(); 
                        }
                    });
  
                  }
                  else{
                      let modal: Title = { 
                          Title: 'Opss...', 
                          Subtitle: result.message, 
                          Icon: 'error' }
                        this.subDialog.open(ModalMessageComponent, {
                            width: '500px',
                            enterAnimationDuration: '300ms',
                            exitAnimationDuration: '300ms',
                            disableClose: true,
                            data: modal
                        });
                  }              
                }, 500);
              });
            }            
          });        

    }

    ModalLoading(): any {     
        let modal: Title = { 
          Title: 'Procesando su solicitud...'}
        let dgRef = this.subDialog.open(ModalLoadingComponent, {
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
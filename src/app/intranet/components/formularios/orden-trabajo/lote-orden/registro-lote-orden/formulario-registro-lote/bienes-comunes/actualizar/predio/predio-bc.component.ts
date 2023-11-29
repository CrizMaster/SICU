import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ImagenModel } from 'src/app/core/models/imagen.model';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { Title } from 'src/app/core/models/title.model';
import { ImageViewerComponent } from 'src/app/core/shared/components/image-viewer/image-viewer.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { BienesComunesService } from '../../bienes-comunes.service';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { PredioBCRequest } from 'src/app/intranet/components/formularios/models/predioBCRequest';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { BienesComunesResponse } from 'src/app/intranet/components/formularios/models/bienesComunesResponse';
import { OrdenTrabajoService } from 'src/app/intranet/components/formularios/orden-trabajo/orden-trabajo.service';

@Component({
    selector: 'app-predio-bc',
    templateUrl: './predio-bc.component.html',
    styleUrls: ['./predio-bc.component.css']
})
export class PredioBcComponent implements OnInit, OnDestroy {

    form : FormGroup;
    expanding: boolean = true;
    codigoUnidadAdministrativa: number = 0;
    public imagenes: ImagenModel[] = [];

    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    public savePredio$: Subscription = new Subscription;
    public saveForm$: Subscription = new Subscription;
    public itemBC$: Subscription = new Subscription;

    listPartidaRegistral: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listTipoDocumento: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listClasificacionPrecio: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listPredioCatastralEn: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listCodigoEnUso: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    
    constructor(
        private route: Router,
        private _activatedRoute:ActivatedRoute,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private changeDetector: ChangeDetectorRef,
        public subDialog: MatDialog,
        private _bienesComunesService: BienesComunesService,
        private _ordenTrabajoService: OrdenTrabajoService
    ){

        this.itemBC$ = this._bienesComunesService.BienesComunes.subscribe({
            next:(Data:StatusResponse<BienesComunesResponse>) => {
                if(Data.data != undefined){
                    this.codigoUnidadAdministrativa = Data.data.codigoUnidadAdministrativa;
                }                 
            }
        }); 

        this.form = this.fb.group({
            partidaregistral: [0, Validators.required],
            numeropartida: ['', Validators.required],
            tipodocidentidad: [0, Validators.required],
            numerodocumento: ['', Validators.required],
            clasificacionpredio: [0, Validators.required],
            prediocatastralen: [0, Validators.required],
            areaterreno: ['', Validators.required],
            codigoenuso: [0, Validators.required],
            descripcionuso: ['', Validators.required],
          });

        this.listPartidaRegistral = getFilterMasterCatalog(CatalogoMasterEnum.TipoPartidaRegistral);
        this.listTipoDocumento = getFilterMasterCatalog(CatalogoMasterEnum.TipoDocumentoTitularidad); 
        this.listClasificacionPrecio = getFilterMasterCatalog(CatalogoMasterEnum.ClasificacionPredio);
        this.listPredioCatastralEn = getFilterMasterCatalog(CatalogoMasterEnum.PrecioCatastradoEn);
        this.listCodigoEnUso = getFilterMasterCatalog(CatalogoMasterEnum.PredioCodigoUso);        
    }

    ngOnInit(): void {
        this._bienesComunesService.ConsultaPredioBienesComunes(this.codigoUnidadAdministrativa)
        .subscribe(result => {
            console.log(result);
            if(result.success && result.data != undefined){
                let predio = result.data;

                this.form.patchValue({ 
                    partidaregistral: this.getValue(predio.codigoTipoPartidaRegistral, this.listPartidaRegistral), 
                    numeropartida: predio.numeroPartida, 
                    tipodocidentidad: this.getValue(predio.codigoTipoDocumento, this.listTipoDocumento),
                    numerodocumento: predio.numeroDocumento,
                    clasificacionpredio: this.getValue(predio.codigoClasificacionPredio, this.listClasificacionPrecio),
                    prediocatastralen: this.getValue(predio.codigoPredioCastradoEn, this.listPredioCatastralEn),
                    codigoenuso: this.getValue(predio.codigoUso, this.listCodigoEnUso),
                    areaterreno: predio.areaTerrenoVerificado,
                    descripcionuso: predio.descripcionUso
                });
                
                let con:number = 0;
                predio.listaArchivos.forEach(el => {
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

            }
        });        
    }

    ngOnDestroy(): void {
        this.savePredio$.unsubscribe();
        this.saveForm$.unsubscribe();
        this.itemBC$.unsubscribe();
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }    

    getValue(code: string, ds: any[]){
        let id = 0;
        ds.forEach(item => {
          if(item.code == code) id = item.value;
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

    limpiar(){}

    guardar(){
        let modal1: Title = { Title: '¿Está seguro de registrar el predio?' }
        
        const sdm = this.subDialog.open(ModalQuestionComponent, {
            width: '450px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal1
        });

        sdm.afterClosed().subscribe(resp => {
            if(resp){
              let dg = this.ModalLoading();

              let info = this.form.value;

              const formularioDatos = new FormData();
              this.imagenes.forEach(imagen => {
                  formularioDatos.append('guardarArchivos', imagen.imagen);
              });

              let datos: PredioBCRequest = {
                codigoUnidadAdministrativa: this.codigoUnidadAdministrativa,
                codigoTipoPartidaRegistral: this.getCode(info.partidaregistral, this.listPartidaRegistral),
                numeroPartida: info.numeropartida,
                codigoTipoDocumento: this.getCode(info.tipodocidentidad, this.listTipoDocumento),
                numeroDocumento: info.numerodocumento,
                codigoClasificacionPredio: this.getCode(info.clasificacionpredio, this.listClasificacionPrecio),
                codigoPredioCastradoEn: this.getCode(info.prediocatastralen, this.listPredioCatastralEn),
                codigoUso: this.getCode(info.codigoenuso, this.listCodigoEnUso),
                areaTerrenoVerificado: info.areaterreno,
                descripcionUso: info.descripcionuso
              };

              formularioDatos.append('model', JSON.stringify(datos));

              this.saveForm$ = this._bienesComunesService.GuardaEvidenciasBienComun(formularioDatos)
              .subscribe(result => {    
                setTimeout(() => {
                dg.close();
                 if(result.success) {
     
                    let modal: Title = { 
                        Title: 'Predio registrado', 
                        Subtitle: 'La información del predio se registró satisfactoriamente.', 
                        Icon: 'ok' 
                    }
     
                   const okModal = this.dialog.open(ModalMessageComponent, {
                       width: '500px',
                       enterAnimationDuration: '300ms',
                       exitAnimationDuration: '300ms',
                       disableClose: true,
                       data: modal
                   });
     
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
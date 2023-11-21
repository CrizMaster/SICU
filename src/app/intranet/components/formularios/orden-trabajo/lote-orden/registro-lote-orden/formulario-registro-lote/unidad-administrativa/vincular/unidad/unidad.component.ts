import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { UnidadAdministrativaService } from '../../unidad-administrativa.service';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { ImagenModel } from 'src/app/core/models/imagen.model';
import { Title } from 'src/app/core/models/title.model';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { UnidadPredioRequest } from 'src/app/intranet/components/formularios/models/unidadPredioRequest';
import { Subscription } from 'rxjs';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';
import { ArchivoModel } from 'src/app/intranet/components/formularios/models/caracterizacionResponse';
import { ImageViewerComponent } from 'src/app/core/shared/components/image-viewer/image-viewer.component';



@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.css']
})
export class UnidadComponent {

  pattern1Digs = '^[1-9]|([1-9][0-9])$';
  codigoUnidadAdministrativa: number = 0;
  formPredio: FormGroup;

  listClasificacionPrecio: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
  listPredioCatastralEn: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
  listCodigoEnUso: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];

  public saveForm$: Subscription = new Subscription;
  
  public imagenes: ImagenModel[] = [];

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _unidadAdministrativaService: UnidadAdministrativaService){
      this.formPredio = this.fb.group({
        clasificacionpredio: [0, Validators.required],  
        prediocatastralen: [0, Validators.required],
        codigoenuso: [0, [Validators.required]],
        descripcionuso: ['', [Validators.required]],
        predialrentas: ['', [Validators.required]],
        areaterreno: ['', [Validators.required]]
      });

      this.listClasificacionPrecio = getFilterMasterCatalog(CatalogoMasterEnum.ClasificacionPredio);
      this.listPredioCatastralEn = getFilterMasterCatalog(CatalogoMasterEnum.PrecioCatastradoEn);
      this.listCodigoEnUso = getFilterMasterCatalog(CatalogoMasterEnum.PredioCodigoUso);
      //this.listCondicion = getFilterMasterCatalog(CatalogoMasterEnum.ClasificacionPredio);  
      
      this._unidadAdministrativaService.UnidadAdministrativa.subscribe({
        next:(Data:StatusResponse<UnidadAdministrativaResponse>) => {
            // let lista:UnidadAdministrativaResponse[] = [];
            // lista.push(Data.data);
            
            this.codigoUnidadAdministrativa = Data.data.codigoUnidadAdministrativa;
        }
      });
  }

  ngOnInit(): void {
    this._unidadAdministrativaService.ConsultaUnidadPredio(this.codigoUnidadAdministrativa).subscribe({
      next:(result: StatusResponse<UnidadPredioRequest>) => {
        if(result.success){
          //console.log(result);
          let datos = result.data;
          this.formPredio.patchValue({ 
            clasificacionpredio: this.getValue(datos.codigoClasificacionPredio, this.listClasificacionPrecio), 
            prediocatastralen: this.getValue(datos.codigoPredioCastradoEn, this.listPredioCatastralEn), 
            codigoenuso: this.getValue(datos.codigoUso, this.listCodigoEnUso),
            descripcionuso: datos.descripcionUso,
            predialrentas: datos.codigoPredioRentas,
            areaterreno: datos.areaTerrenoVerificado
          }); 

          datos.listaArchivos.forEach(el => {
            this.getEvidencia(el);
          });
        }       
      }
    });
  }

  getEvidencia(archivo: ArchivoModel){
    this._unidadAdministrativaService.ConsultaImagenesUnidadPredio(archivo.codigoArchivo).subscribe({
      next:(result) => {
        if(result.success){
          let img: ImagenModel = {
            id: 0,
            name: archivo.nombreArchivo,
            tamanioBytes: 0,
            tamanio: "",
            type: "",
            base64: "data:image/jpeg;base64," + result.data
          };
          this.imagenes.push(img);
          //this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpeg;base64,${result.data}`);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.saveForm$.unsubscribe();
  }

  getValue(code: string, lista: ItemSelect<number>[]){
    let id = 0;
    lista.forEach(item => {
      if(item.code == code) id = item.value;
    });

    return id;
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

  guardar(){

    let modal1: Title = { Title: '¿Está seguro de actualizar la descripción del predio?'}
    console.log('ok 1');    

    const subDialogModal = this.dialog.open(ModalQuestionComponent, {
        width: '450px',
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        disableClose: true,
        data: modal1
    });

    subDialogModal.afterClosed().subscribe(resp => {
      if(resp){
        let dg = this.ModalLoading();

        let info = this.formPredio.value;
        let datos: UnidadPredioRequest = { 
          codigoUnidadAdministrativa: this.codigoUnidadAdministrativa,
          usuarioCreacion: 'carevalo',
          terminalCreacion: ''
        };

        this.listClasificacionPrecio.forEach(c => {
          if(c.value == info.clasificacionpredio) { 
            datos.codigoClasificacionPredio = c.code;
          }
        });

        this.listPredioCatastralEn.forEach(c => {
          if(c.value == info.prediocatastralen) { 
            datos.codigoPredioCastradoEn = c.code;
          }
        });

        this.listCodigoEnUso.forEach(c => {
          if(c.value == info.codigoenuso) { 
            datos.codigoUso = c.code;
          }
        });

        datos.descripcionUso = info.descripcionuso;
        datos.codigoPredioRentas = info.predialrentas;
        datos.areaTerrenoVerificado = info.areaterreno;
        datos.porBienComunTerrLegal = 0;
        datos.porBienComunConsLegal = 0;

        const formularioDatos = new FormData();
        this.imagenes.forEach(imagen => {
            formularioDatos.append('guardarArchivos', imagen.imagen);
        });

        formularioDatos.append('model', JSON.stringify(datos));

        //this.saveForm$ = this._unidadAdministrativaService.GuardarUnidadPredio(formularioDatos)

        // const ctrlValue = info.mesanio.toDate();
        // this.datos.c44FechaConstruccion = ctrlValue;
        // let mes = ctrlValue.getMonth() + 1;      
        // if(mes < 10) this.datos.c44FechaMes = '0' + mes;
        // else this.datos.c44FechaMes = '0' + String(mes);
  
        // let anio = ctrlValue.getFullYear();
        // this.datos.c44FechaAnio = String(anio);
  
        
        //this.dialogRef.close(this.datos);

        this.saveForm$ = this._unidadAdministrativaService.GuardarUnidadPredio(formularioDatos)
         .subscribe(result => {    
          setTimeout(() => {
            dg.close();
            if(result.success) {

              let modal: Title = { 
                Title: 'Predio Actualizado', 
                Subtitle: 'La información de la descripción del predio se actualizó satisfactoriamente.', 
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

  ModalLoading(): any {     
    let modal: Title = { 
      Title: 'Procesando su solicitud...'}
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
}

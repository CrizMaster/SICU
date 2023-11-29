import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { PersonaModalComponent } from '../persona-modal/persona-modal.component';
import { PersonaModel } from 'src/app/intranet/components/formularios/models/personaModel';
import { UnidadAdministrativaService } from '../../unidad-administrativa.service';
import { DireccionResponse } from 'src/app/intranet/components/formularios/models/armonizacionModel';
import { ImagenModel } from 'src/app/core/models/imagen.model';
import { InteresadoRequest, InteresadoResponse } from 'src/app/intranet/components/formularios/models/interesadoRequest';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-titularidad',
  templateUrl: './titularidad.component.html',
  styleUrls: ['./titularidad.component.css']
})
export class TitularidadComponent  implements OnInit, OnDestroy {
  pattern1Digs = '^[1-9]|([1-9][0-9])$';
  
  formTitu: FormGroup;
  expanding: Boolean = true;

  ApellidoPaterno:string = '';
  ApellidoMaterno:string = '';
  Nombres:string = '';

  public saveForm$: Subscription = new Subscription;
  public loadTitu$: Subscription = new Subscription;
  public armon$: Subscription = new Subscription;
  public undAdm$: Subscription = new Subscription;

  codigoUnidadAdministrativa: number = 0;
  habilitar: boolean = true;
  lista: InteresadoResponse[] = [];

  listCondicionTitular: ItemSelect<number>[] = [];
  listFormaAdquisicion: ItemSelect<number>[] = [];
  listTipoDocumento: ItemSelect<number>[] = [];
  listPartidaRegistral: ItemSelect<number>[] = [];

  dataPersona: PersonaModel = {};
  public imagenes: ImagenModel[] = [];

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _unidadAdministrativaService: UnidadAdministrativaService){
      this.formTitu = this.fb.group({
        condiciontitular: [0, Validators.required],  
        formaadquisicion: [0, Validators.required],  
        tipodocidentidad: [0, Validators.required],  
        partidaregistral: [0, Validators.required],
        numeropartida: ['', [Validators.required]]
      });

      this.listCondicionTitular = getFilterMasterCatalog(CatalogoMasterEnum.CondicionTitular);
      this.listFormaAdquisicion = getFilterMasterCatalog(CatalogoMasterEnum.FormaAdquisicion);
      this.listPartidaRegistral = getFilterMasterCatalog(CatalogoMasterEnum.TipoPartidaRegistral);
      this.listTipoDocumento = getFilterMasterCatalog(CatalogoMasterEnum.TipoDocumentoTitularidad);    
      
      this.armon$ = this._unidadAdministrativaService.InfoArmonizacion.subscribe({
        next:(Data:DireccionResponse) => {
            this.dataPersona.codigoContribuyente = Data.codigoContribuyente;
            // console.log('titularidad info armonización');
            // console.log(Data);
            if(Data.index != undefined && Data.index != 0){
              let ir: InteresadoResponse = {
                nombres: Data.nombres,
                apellidoPaterno: Data.apellidoPaterno,
                apellidoMaterno: Data.apellidoMaterno,
                nombreTipoDocumento: Data.tipoDocumento,
                numeroDocumento: Data.numeroDocumento,
                codigoTipoCotitular: '01',
                nombreTipoCotitular: 'PERSONA NATURAL'
              }
              this.lista.push(ir);
            }
        }
      }); 

      this.undAdm$ = this._unidadAdministrativaService.UnidadAdministrativa.subscribe({
        next:(Data:StatusResponse<UnidadAdministrativaResponse>) => {      
            if(Data != undefined && Data.data != undefined){
              this.habilitar = Data.data.codigoEstado != '03';
              this.codigoUnidadAdministrativa = Data.data.codigoUnidadAdministrativa;
              this.cargarTitulares();
            }
        }
      });

  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.saveForm$.unsubscribe();
    this.loadTitu$.unsubscribe();
    this.armon$.unsubscribe();
    this.undAdm$.unsubscribe();
  }

  getCode(value: number, ds: any[]) {
    let code = '';
    ds.forEach(elem => {
        if(elem.value == value) code = elem.code;
    }); 
    return code;
  }

  getValue(code: string, ds: any[]){
    let id = 0;
    ds.forEach(item => {
      if(item.code == code) id = item.value;
    });

    return id;
  }  

  cargarTitulares(){
    this.loadTitu$ = this._unidadAdministrativaService.ConsultarInteresados(this.codigoUnidadAdministrativa)
    .subscribe(resp => {
      if(resp.success){
/*
        condiciontitular: [0, Validators.required],  
        formaadquisicion: [0, Validators.required],  
        tipodocidentidad: [0, Validators.required],  
        partidaregistral: [0, Validators.required],
        numeropartida: ['', [Validators.required]]

*/

        this.formTitu.patchValue({ 
          condiciontitular: this.getValue(resp.data[0].codigoCondicionTitular, this.listCondicionTitular),
          formaadquisicion: this.getValue(resp.data[0].codigoFormaAdquisicion, this.listFormaAdquisicion)
        });        

        resp.data.forEach(info => {
          this.lista.push(info);
        });

        let i:number = 0;
        this.lista.forEach(el => {
          i++;
          el.id = i;
        });
      }      
    });    
  }

  onChangeSelCondTitu(newValue: string){
    let id = parseInt(newValue);
    this.dataPersona.ConConyuge = true;
    this.dataPersona.codigoCondicionTitular = '0';

    this.listCondicionTitular.forEach(el => {
      if(el.value == id){
        if(el.code == '01'//PROPIETARIO UNICO
          || el.code == '02'//SUCESION INTESTADA
          || el.code == '06'//LITIGIO
          || el.code == '07'//OTROS
        ){
          this.dataPersona.ConConyuge = false;
          this.dataPersona.unTitular = true;
        }
        else if(
          el.code == '03'//POSEEDOR
          || el.code == '04'//SOCIEDAD CONYUGAL
        ){
          this.dataPersona.ConConyuge = true;
          this.dataPersona.unTitular = true;
        }
        else if(
          el.code == '05'//COTITULARIDAD
        ){
          this.dataPersona.ConConyuge = false;
          this.dataPersona.unTitular = false;
        }        

        this.dataPersona.codigoCondicionTitular = el.code;
      }
    });
  }

  PersonaModal():void {

    const dialogPerNatural = this.dialog.open(PersonaModalComponent, {
        width: '760px',
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        disableClose: true,
        data: this.dataPersona
    });

    dialogPerNatural.afterClosed().subscribe((result:any) => {
      
      if(result.success){

        if(result.datos.codigoInteresado == 0)
        {
          if(this.lista.length > 0){
            const max = this.lista.reduce(function(prev, current) {
                return (prev.codigoInteresado > current.codigoInteresado) ? prev : current
            })
            result.datos.codigoInteresado = max.codigoInteresado + 1;
          }
          else{ result.datos.codigoInteresado = 1; }
  
          let condiciontitular = this.formTitu.get('condiciontitular');
          result.datos.codigoCondicionTitular = condiciontitular;

          //let formaadquisicion = this.formTitu.get('formaadquisicion');

          this.listCondicionTitular.forEach(el => {
            if(el.value == condiciontitular.value){
              result.datos.codigoCondicionTitular = el.code;
            }
          });

          this.lista.push(result.datos);
        }
        else{
          let newLista:InteresadoResponse[] = [];
          newLista = this.lista;
          this.lista = [];

          newLista.forEach(el => {
            if(el.codigoInteresado == result.datos.codigoInteresado) this.lista.push(result.datos);
            else this.lista.push(el);
          });
        }

        let i:number = 0;
        this.lista.forEach(el => {
          i++;
          el.id = i;
        });
      }      
    });
  }

  AgregarPersona(){
    this.dataPersona.Interesado = { codigoInteresado: 0 }
    this.PersonaModal();
  }

  EditarPersona(interesado: InteresadoResponse){
    this.dataPersona.Interesado = interesado;
    this.PersonaModal();
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

  GuardarInteresados(){
    let modal1: Title = { Title: '¿Está seguro de actualizar el registro de los titulares?'}
        
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

        let info = this.formTitu.value;

        this.lista.forEach((inter: InteresadoResponse) => {

            const formularioDatos = new FormData();
            inter.listArchivo.forEach(imagen => {
                formularioDatos.append('guardarArchivos', imagen.imagen);
            });

            let datos: InteresadoRequest = {
              usuarioCreacion: 'carevalo',
              terminalCreacion: '',
              usuarioModificacion: 'carevalo',
              terminalModificacion: '',
              codigoUnidadAdministrativa: this.codigoUnidadAdministrativa,
              listaInteresadosDrr: []
            };

            datos.listaInteresadosDrr.push({
              codigoInteresado: inter.codigoInteresado,
              apellidoPaterno: inter.apellidoPaterno,
              apellidoMaterno: inter.apellidoMaterno,
              nombres: inter.nombres,
              codigoEstadoCivil: inter.codigoEstadoCivil,
              codigoTipoDocumento: inter.codigoTipoDocumento,
              numeroDocumento: inter.numeroDocumento,
              razonSocial: inter.razonSocial,
              numeroTelefono: inter.numeroTelefono,
              correoElectronico: inter.correoElectronico,
              codigoDrr: inter.codigoDrr,
              codigoUnidadAdministrativa: this.codigoUnidadAdministrativa,
              codigoTipoCotitular: inter.codigoTipoCotitular,
              porcetajeCotitular: inter.porcetajeCotitular,
              codigoContribRentas: inter.codigoContribRentas,
              codigoPredioRentas: inter.codigoPredioRentas,
              usuarioCreacion: inter.usuarioCreacion,
              terminalCreacion: inter.terminalCreacion,
              usuarioModificacion: inter.usuarioModificacion,
              terminalModificacion: inter.terminalModificacion,
              nombreTipoDocumento: inter.nombreTipoDocumento,
              nombreTipoEstadoCivil: inter.nombreTipoEstadoCivil,
              nombreTipoCotitular: inter.nombreTipoCotitular,
              codigoCondicionTitular: this.getCode(info.condiciontitular, this.listCondicionTitular),
              codigoFormaAdquisicion: this.getCode(info.formaadquisicion, this.listFormaAdquisicion),
              codigoTipoDocumentoTitular: this.getCode(info.tipodocidentidad, this.listTipoDocumento),
              codigoTipoPartidaRegistral: this.getCode(info.partidaregistral, this.listPartidaRegistral),
              numeroPartida: info.numeropartida,
              codigoTipoGenero: inter.codigoTipoGenero,
              listConyuge: []
            });

            datos.listaInteresadosDrr[0].listConyuge = inter.listConyuge;

            formularioDatos.append('model', JSON.stringify(datos));

            this.saveForm$ = this._unidadAdministrativaService.GuardarTitulares(formularioDatos)
            .subscribe(result => {    
              setTimeout(() => {
              dg.close();
               if(result.success) {
   
                 let modal: Title = { 
                   Title: 'Titulares Actualizados', 
                   Subtitle: 'La información de los titulares se actualizó satisfactoriamente.', 
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
        });
      }            
    });    
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
  
}

import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { UnidadAdministrativaService } from '../../unidad-administrativa.service';
import { ArmonizacionRequest, DireccionResponse } from 'src/app/intranet/components/formularios/models/armonizacionModel';
import { Title } from 'src/app/core/models/title.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';

@Component({
  selector: 'app-vincular-unidad',
  templateUrl: './vincular-unidad.component.html',
  styleUrls: ['./vincular-unidad.component.css']
})
export class VincularUnidadComponent {

  pattern1Digs = '^[1-9]|([1-9][0-9])$';
  
  formVU: FormGroup;

  habilitar: boolean = true;
  ApellidoPaterno:string = '';
  ApellidoMaterno:string = '';
  Nombres:string = '';
  Direcciones:DireccionResponse[] = [];

  listTipoDocIdent: ItemSelect<number>[] = [];

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private _unidadAdministrativaService: UnidadAdministrativaService,
    public subDialog: MatDialog
    ){
      this.formVU = this.fb.group({
        tipodocidentidad: [0, Validators.required],  
        nrodocidentidad: ['', [Validators.required, Validators.pattern('[0-9]+')]],
        manzanaUrbana: [''],
        loteUrbano: [''],
        subloteUrbano: [''],
        tipoDivision: [''],
        nombreDivision: [''],
        direccion: ['']
      }); 

      this._unidadAdministrativaService.UnidadAdministrativa.subscribe({
        next:(Data:StatusResponse<UnidadAdministrativaResponse>) => {
            if(Data != undefined && Data.data != undefined){
              this.habilitar = Data.data.codigoEstado != '03';
            }            
        }
      });      

      this.listTipoDocIdent = getFilterMasterCatalog(CatalogoMasterEnum.TipoDocIdentidadTitular);
  }

  ngOnInit(): void {
    
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  ConsultaArmonizacion(){
    let dg = this.ModalLoading('Consultando información de armonización...');
    let data: ArmonizacionRequest = {
      codigoUbigeo: '200101',
      tipoDocumento: '02',
      numeroDocumento: '40615410',
      domicilioFiscal: ''
    };
    
    setTimeout(() => {

      this._unidadAdministrativaService.ConsultaArmonizacion(data)
      .subscribe(Data => {
          dg.close();
          if(Data.success){
            let info = Data.data[0];
  
            this.ApellidoPaterno = info.apellidoPaterno;
            this.ApellidoMaterno = info.apellidoMaterno;
            this.Nombres = info.nombres;
  
            info.direcciones.forEach(el => {
              el.codigoContribuyente = info.codigoContribuyente;
              el.nombres = info.nombres,
              el.apellidoPaterno = info.apellidoPaterno,
              el.apellidoMaterno = info.apellidoMaterno,
              el.codigoDocumento = info.codigoDocumento,
              el.tipoDocumento = info.tipoDocumento,
              el.numeroDocumento = info.numeroDocumento,
              el.codigoEstadoCivil = info.codigoEstadoCivil,
              el.estadoCivil = info.estadoCivil,
              el.fechaNacimiento = info.fechaNacimiento,
              el.genero = info.genero,
              el.correo = info.correo,
              el.telefono = info.telefono
            });
            this.Direcciones = info.direcciones;
  
          }   
      }); 

    }, 500);
 
  }

  seleccionarDatos(datos: DireccionResponse){
    
    if(this.habilitar){
      let modal1: Title = { Title: '¿Está seguro de vincular el registro seleccionado?'}
    
      const subDialogModal = this.subDialog.open(ModalQuestionComponent, {
          width: '450px',
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          disableClose: true,
          data: modal1
      });
  
      subDialogModal.afterClosed().subscribe(resp => {
        if(resp){
          let dg = this.ModalLoading('Procesando su solicitud...');
  
          //Cargando datos
          setTimeout(() => {
            dg.close();
  
            datos.index = 2;
            this._unidadAdministrativaService.InfoArmonizacion.next(datos);
  
          }, 1000);         
          
        }            
      });
    }
  }

  ModalLoading(msn: string): any {     
    let modal: Title = { 
      Title: msn
    }
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

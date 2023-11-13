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

@Component({
  selector: 'app-vincular-unidad',
  templateUrl: './vincular-unidad.component.html',
  styleUrls: ['./vincular-unidad.component.css']
})
export class VincularUnidadComponent {

  pattern1Digs = '^[1-9]|([1-9][0-9])$';
  
  formVU: FormGroup;

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

    this.listTipoDocIdent = getFilterMasterCatalog(CatalogoMasterEnum.TipoDocIdentidadTitular);
  }

  ngOnInit(): void {
    
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  ConsultaArmonizacion(){
    let data: ArmonizacionRequest = {
      codigoUbigeo: '200101',
      tipoDocumento: '02',
      numeroDocumento: '40615410',
      domicilioFiscal: ''
    };
    
    this._unidadAdministrativaService.ConsultaArmonizacion(data)
    .subscribe(Data => {
        if(Data.success){
          let info = Data.data[0];

          this.ApellidoPaterno = info.apellidoPaterno;
          this.ApellidoMaterno = info.apellidoMaterno;
          this.Nombres = info.nombres;

          info.direcciones.forEach(el => {
            el.codigoContribuyente = info.codigoContribuyente;
          });
          this.Direcciones = info.direcciones;

        }   
    });  
  }

  seleccionarDatos(datos: DireccionResponse){
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
        let dg = this.ModalLoading();

        //Cargando datos
        setTimeout(() => {
          dg.close();

          datos.index = 2;
          this._unidadAdministrativaService.InfoArmonizacion.next(datos);

        }, 2000);         
        
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

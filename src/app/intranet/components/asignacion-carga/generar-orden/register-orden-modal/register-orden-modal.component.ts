import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { GenerarOrdenService } from '../generar-orden.service';
import { OrdenTrabajoRequest, OrdenTrabajoResponse, UsuariosRequest } from '../../models/ordenTrabajoResponse';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { MatTableDataSource } from '@angular/material/table';
import { PersonalAsignado, UsuarioAsignado } from '../../models/personalAsignado.model';
import { Perfil, PerfilFilter } from '../../models/perfil.model';
import { Personal } from '../../models/personal.model';
import { OrdenTrabajo } from '../../models/ordenTrabajo.model';
import { Title } from 'src/app/core/models/title.model';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';



@Component({
    selector: 'app-register-orden-modal',
    templateUrl: './register-orden-modal.component.html',
    styleUrls: ['./register-orden-modal.component.css']
})
export class RegisterOrdenModalComponent implements OnInit, OnDestroy {

    dataFirst: OrdenTrabajoResponse;
    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    msnAsignacion: boolean = false;
    codigoOrden: number = 0;
    titleBtnGuardar: string = 'Crear Orden';

    listPerfil: Perfil[] = [];
    listPersonal: Personal[] = [{ codigoUsuario:0, persona:'Seleccionar' }];
    listTipo: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];

    displayedColumns = ['perfil', 'persona', 'tipo', 'accion'];
    dataSource = new MatTableDataSource<UsuarioAsignado>();

    public subPersonal$: Subscription = new Subscription;
    public subPerfil$: Subscription = new Subscription;
    public crearOT$: Subscription = new Subscription;
    public addUser$: Subscription = new Subscription;

    constructor(
      public dialogRef: MatDialogRef<RegisterOrdenModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: OrdenTrabajo,
      private _generarOrdenService: GenerarOrdenService,
      private fb: FormBuilder,
      private cd: ChangeDetectorRef,
      public subDialog: MatDialog
    ){

      this.form = this.fb.group({
        perfil: [0, Validators.required],
        personal: [0, Validators.required],
        tipo: [0, Validators.required]
      });

      this.listTipo = getFilterMasterCatalog(CatalogoMasterEnum.TipoPersonal);
    }
    
    ngAfterContentChecked(): void {
      this.cd.detectChanges();
    }

    ngOnDestroy(): void {
      this.subPersonal$.unsubscribe();
      this.subPerfil$.unsubscribe();
      this.crearOT$.unsubscribe();
      this.addUser$.unsubscribe();
    }

    ngOnInit(): void {

      this.subPerfil$ = this._generarOrdenService.listarPerfiles().subscribe(result => {
        if(result.success){
          this.listPerfil = result.data;
        }
      });

      this.codigoOrden = this.data.codigoOrden;
      if(this.codigoOrden > 0) this.titleBtnGuardar = 'Asignar Personal';
    }

    onChangeSelPerfil(newValuePerfil: string){
      this.msnAsignacion = false;

      let filter: PerfilFilter = { idOrganizacion: 0, idPerfil: parseInt(newValuePerfil) }

      this.subPersonal$ = this._generarOrdenService.listarPersonasPerfil(filter).subscribe(result => {
        if(result.success){
          this.listPersonal = result.data;
        }
      });
    }

    onChangeSelPersonal(){
      this.msnAsignacion = false;
    }

    onChangeSelTipo(){
      this.msnAsignacion = false;
    }

    agregar(){
      this.msnAsignacion = false;
      let info = this.form.value;
      let persAsign: UsuarioAsignado = {};

      this.listPerfil.forEach(it => {
        if(it.idPerfil == parseInt(info.perfil)){
          persAsign.codigoPerfil = it.idPerfil;
          persAsign.perfil = it.nombrePerfil;
        }
      });

      this.listPersonal.forEach(it => {
        if(it.codigoUsuario == parseInt(info.personal)){
          persAsign.codigoUsuario = it.codigoUsuario;
          persAsign.persona = it.persona;
        }
      });

      this.listTipo.forEach(it => {
        if(it.value == parseInt(info.tipo)){
          persAsign.codigoTipo = String(it.code);
          persAsign.tipo = it.text;
        }
      });      

      let sw: boolean = true;
      let listAsignada:UsuarioAsignado[] = this.dataSource.data;

      listAsignada.forEach(elem => {
        if(elem.codigoPerfil == persAsign.codigoPerfil && elem.codigoUsuario == persAsign.codigoUsuario){
          console.log('Personal ya se encuentra asignado');
          sw = false;
          this.msnAsignacion = true;
        }
      });

      if(sw) {
        listAsignada.push(persAsign); 
        this.dataSource = new MatTableDataSource<UsuarioAsignado>(listAsignada);
      }
    }

    quitar(elem: UsuarioAsignado){
      let newListAsignada:UsuarioAsignado[] = [];
      let listAsignada:UsuarioAsignado[] = this.dataSource.data;

      listAsignada.forEach(item => {
        if(!(elem.codigoPerfil == item.codigoPerfil && elem.codigoUsuario == item.codigoUsuario)) newListAsignada.push(item);
      });

      this.dataSource = new MatTableDataSource<PersonalAsignado>(newListAsignada);
    }

    guardar(){

      let usuarios: UsuariosRequest[] = [];
      this.dataSource.data.forEach(element => {
        usuarios.push({
          codigoOrden: 0,
          codigoUsuario: element.codigoUsuario,
          codigoPerfil: element.codigoPerfil,
          codigoTipo: element.codigoTipo,
          fechaAsignacion: "01/01/23"
        });
      });

      let ot: OrdenTrabajoRequest = {
        usuarioCreacion: 'carevalo',
        terminalCreacion: '127.0.0.0',
        fechaOrden: '01/01/23',
        codigoOrden: this.codigoOrden,
        manzanas: [{
          codigoOrden: 0,
          codigoRegistroCaracterizacion: this.data.codigoRegistroCaracterizacion,
          codigoLote: ""
        }],
        usuarios: usuarios
      };

      let modal1: Title = { Title: '¿Está seguro de crear la orden de trabajo?'}
      if(this.codigoOrden > 0){
        modal1.Title = '¿Está seguro de asignar el personal a la orden de trabajo ' + this.data.orden +  ' ?';
      }
      
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

            if(this.codigoOrden == 0){
              this.crearOT$ = this._generarOrdenService.crearOrden(ot)
              .subscribe(result => {    
                setTimeout(() => {
                  dg.close();
                  if(result.success){ 
                    
                    let codigo = '0000'.concat(String(result.data));
  
                    let modal: Title = { 
                      Title: 'Nueva orden de trabajo ' + codigo.substring(codigo.length - 4, codigo.length), 
                      Subtitle: 'La orden de trabajo se creó satisfactoriamente.', 
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
                      if(resp) this.dialogRef.close(true);
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
            else{
              this.addUser$ = this._generarOrdenService.agregarUsuario(ot)
              .subscribe(result => {    
                setTimeout(() => {
                  dg.close();
                  if(result.success){ 

                    let modal: Title = { 
                      Title: 'Personal asignado',
                      Subtitle: 'El personal se asignó a la orden de trabajo satisfactoriamente.', 
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
                      if(resp) this.dialogRef.close(true);
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
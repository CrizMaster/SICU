import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { GenerarOrdenService } from '../generar-orden.service';
import { OrdenTrabajoResponse } from '../../models/ordenTrabajoResponse';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { MatTableDataSource } from '@angular/material/table';
import { PersonalAsignado } from '../../models/personalAsignado.model';
import { Perfil, PerfilFilter } from '../../models/perfil.model';
import { Personal } from '../../models/personal.model';



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

    listPerfil: Perfil[] = [];
    listPersonal: Personal[] = [{ codigoUsuario:0, persona:'Seleccionar' }];
    listTipo: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];

    displayedColumns = ['perfil', 'personal', 'tipo', 'accion'];
    dataSource = new MatTableDataSource<PersonalAsignado>();

    public subPersonal$: Subscription = new Subscription;
    public subPerfil$: Subscription = new Subscription;

    constructor(
      public dialogRef: MatDialogRef<RegisterOrdenModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: OrdenTrabajoResponse,
      private _generarOrdenService: GenerarOrdenService,
      private fb: FormBuilder,
      private cd: ChangeDetectorRef
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
    }

    ngOnInit(): void {

      this.subPerfil$ = this._generarOrdenService.listarPerfiles().subscribe(result => {
        if(result.success){
          this.listPerfil = result.data;
        }
      });

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
      let persAsign: PersonalAsignado = {};

      this.listPerfil.forEach(it => {
        if(it.idPerfil == parseInt(info.perfil)){
          persAsign.idPerfil = it.idPerfil;
          persAsign.perfil = it.nombrePerfil;
        }
      });

      this.listPersonal.forEach(it => {
        if(it.codigoUsuario == parseInt(info.personal)){
          persAsign.idPersonal = it.codigoUsuario;
          persAsign.personal = it.persona;
        }
      });

      this.listTipo.forEach(it => {
        if(it.value == parseInt(info.tipo)){
          persAsign.idTipo = it.value;
          persAsign.tipo = it.text;
        }
      });      

      let sw: boolean = true;
      let listAsignada:PersonalAsignado[] = this.dataSource.data;

      listAsignada.forEach(elem => {
        if(elem.idPerfil == persAsign.idPerfil && elem.idPersonal == persAsign.idPersonal){
          console.log('Personal ya se encuentra asignado');
          sw = false;
          this.msnAsignacion = true;
        }
      });

      if(sw) { 
        listAsignada.push(persAsign); 
        this.dataSource = new MatTableDataSource<PersonalAsignado>(listAsignada);
      }

      // let per: PersonalAsignado[] = [persAsign]      

      // if(this.dataFirst === undefined){
      //   info.idFicha = 0
      // }
      // else{ 
      //   info.idFicha = this.dataFirst.idFicha; 
      // }

      // this.distritos.forEach(dist => {
      //   if(dist.id == info.distrito) { 
      //     info.codigoUbigeo = dist.ubigeo; 
      //     info.codigoDistrito = dist.ubigeoDistrito;
      //     info.distrito = dist.id;
      //   }
      // });

      // this.sectores.forEach(sect => {
      //   if(sect.idSector == info.sector) info.codigoSector = sect.codigoSector;
      // });

      // this.manzanas.forEach(manz => {
      //   if(manz.idManzana == info.manzana) info.codigoManzana = manz.codigoManzana;
      // });

      //this.dialogRef.close(info);
    }

    quitar(elem: PersonalAsignado){
      let newListAsignada:PersonalAsignado[] = [];
      let listAsignada:PersonalAsignado[] = this.dataSource.data;

      listAsignada.forEach(item => {
        if(!(elem.idPerfil == item.idPerfil && elem.idPersonal == item.idPersonal)) newListAsignada.push(item);
      });

      this.dataSource = new MatTableDataSource<PersonalAsignado>(newListAsignada);
    }

    guardar(){

    }

}
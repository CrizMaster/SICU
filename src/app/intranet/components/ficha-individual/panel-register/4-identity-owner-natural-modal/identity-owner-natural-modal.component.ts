import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef, Input  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FichaIndividualService } from '../../ficha-individual.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { Owner } from '../../models/IdentityOwner/owner.model';

@Component({
    selector: 'app-identity-owner-natural-modal',
    templateUrl: './identity-owner-natural-modal.component.html',
    styleUrls: ['./identity-owner-natural-modal.component.css']
})
export class IdentityOwnerNaturalModalComponent implements OnInit, OnDestroy {

    pattern1Digs = '^[1-9]|([1-9][0-9])$';

    form: FormGroup;

    @Input() conConyuge: boolean = true;

    resp:Owner = { Titular: { IdEstadoCivil: 0, DocIdentidad: ['','','','','','','','','',''] }, Conyuge: { DocIdentidad: ['','','','','','','','','',''] }};

    listCatalogoMaster: CatalogoMaster[] = [];
    listEstadoCivil: ItemSelect<number>[] = [];
    listTipoDocIdent: ItemSelect<number>[] = [];
    listTipoDocIdentConyuge: ItemSelect<number>[] = [];

    constructor(
      public dialogRef: MatDialogRef<IdentityOwnerNaturalModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Owner,
      private _fichaIndividualService: FichaIndividualService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){
        this.form = this.fb.group({
            estadocivil: [0, Validators.required],
            tipodocidentidad: [0, Validators.required],  
            nrodocidentidad: ['', [Validators.required, Validators.pattern('[0-9]+')]],                      
            nombres: ['', Validators.required],
            apellidopaterno: ['', Validators.required],
            apellidomaterno: [''],
            tipodocidentidadconyuge: [0, Validators.required],
            nrodocidentidadconyuge: ['', [Validators.required, Validators.pattern('[0-9]+')]],
            nombresconyuge: ['', Validators.required],
            apellidopaternoconyuge: ['', Validators.required],
            apellidomaternoconyuge: ['']
        });

        this.listCatalogoMaster = _fichaIndividualService.getCatalogoMaster();
        this.listEstadoCivil = this.getList<number>(CatalogoMasterEnum.EstadoCivil);
        this.listTipoDocIdent = this.getList<number>(CatalogoMasterEnum.TipoDocIdentidadTitular);
        this.listTipoDocIdentConyuge = this.getList<number>(CatalogoMasterEnum.TipoDocIdentidadTitular);
    }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnInit(): void {
        
        this._fichaIndividualService.obsSharedThirdData.subscribe({
            next:(data) => {

                this.conConyuge = true;
                if(data.codigoCondicionTitular == '01'//PROPIETARIO UNICO
                    || data.codigoCondicionTitular == '02'//SUCESION INTESTADA
                    || data.codigoCondicionTitular == '06'//LITIGIO
                ) 
                {
                    this.conConyuge = false;

                    this.form.get('tipodocidentidadconyuge').clearValidators();
                    this.form.get('nrodocidentidadconyuge').clearValidators();
                    this.form.get('nombresconyuge').clearValidators();
                    this.form.get('apellidopaternoconyuge').clearValidators();
                    this.form.get('apellidomaternoconyuge').clearValidators();

                    this.form.get('tipodocidentidadconyuge').updateValueAndValidity();
                    this.form.get('nrodocidentidadconyuge').updateValueAndValidity();
                    this.form.get('nombresconyuge').updateValueAndValidity();
                    this.form.get('apellidopaternoconyuge').updateValueAndValidity();
                    this.form.get('apellidomaternoconyuge').updateValueAndValidity();
                }
            }
        });

        if(this.data.Titular.IdEstadoCivil == 0){
            console.log('nuevo');
        }
        else {
            this.form.patchValue({ 
                estadocivil: this.data.Titular.IdEstadoCivil, 
                tipodocidentidad: this.data.Titular.IdTipoDocIdentidad,
                nrodocidentidad: this.data.Titular.NroDocIdentidad,
                nombres: this.data.Titular.Nombres,
                apellidopaterno: this.data.Titular.ApellidoPaterno,
                apellidomaterno: this.data.Titular.ApellidoMaterno
              });

            if(this.data.ConConyuge){
            this.form.patchValue({
                tipodocidentidadconyuge: this.data.Conyuge.IdTipoDocIdentidad,
                nrodocidentidadconyuge: this.data.Conyuge.NroDocIdentidad,
                nombresconyuge: this.data.Conyuge.Nombres,
                apellidopaternoconyuge: this.data.Conyuge.ApellidoPaterno,
                apellidomaternoconyuge: this.data.Conyuge.ApellidoMaterno
              });
            }
        }
    }

    onChangeSelDocIdent(newValue: string){
        let codigo = '';
        this.listTipoDocIdent.forEach(item => {
            if(item.value == parseInt(newValue)){
                codigo = item.code;
            };
        });
        
        const nrodocidentidad = this.form.get('nrodocidentidad');
        if(codigo == "01"){            
            this.form.patchValue({ nrodocidentidadconyuge: '' });
            nrodocidentidad.disable();
            nrodocidentidad.clearValidators();            
            //this.form.get('nrodocidentidad').updateValueAndValidity();
        }
        else{
            nrodocidentidad.addValidators(Validators.required);
            nrodocidentidad.enable();
        }

        nrodocidentidad.updateValueAndValidity();
    }

    onChangeSelDocIdentConyugue(newValue: string){
        let codigo = '';
        this.listTipoDocIdent.forEach(item => {
            if(item.value == parseInt(newValue)){
                codigo = item.code;
            };
        });

        const nrodocidentidadconyuge = this.form.get('nrodocidentidadconyuge');
        if(codigo == "01"){            
            this.form.patchValue({ nrodocidentidadconyuge: '' });
            nrodocidentidadconyuge.disable();
            nrodocidentidadconyuge.clearValidators();            
            //this.form.get('nrodocidentidad').updateValueAndValidity();
        }
        else{
            nrodocidentidadconyuge.addValidators(Validators.required);
            nrodocidentidadconyuge.enable();
        }

        nrodocidentidadconyuge.updateValueAndValidity();
    }

    ngOnDestroy(): void {
    //   this.listProv$.unsubscribe();
    //   this.listDist$.unsubscribe();
    }

    getList<T>(Grupo: string) : ItemSelect<T>[]{
        let list: ItemSelect<T>[] = [];

        this.listCatalogoMaster.forEach(item => {
            if(item.grupo == Grupo){
                list.push({
                    value: item.id,
                    text: item.nombre,
                    code: item.orden
                });
            };
        });

        list = list.sort((n1,n2) => {
            if (n1.text > n2.text) {
                return 1;
            }
            if (n1.text < n2.text) {
                return -1;
            }
            return 0;
        });

        list.unshift({ value: 0, text: 'Seleccionar'});

        return list;
    }    

    guardar(){
        let info = this.form.value;

        this.listEstadoCivil.forEach(ec => {
          if(ec.value == info.estadocivil) {
            this.resp.Titular.IdEstadoCivil = ec.value;
            this.resp.Titular.CodeEstadoCivil = ec.code;
            this.resp.Titular.EstadoCivil = ec.text;
          }
        });

        this.listTipoDocIdent.forEach(td => {
            if(td.value == info.tipodocidentidad) {
              this.resp.Titular.IdTipoDocIdentidad = td.value;
              this.resp.Titular.CodeTipoDocIdentidad = td.code;
              this.resp.Titular.TipoDocIdentidad = td.text;
            }
          });

        this.resp.Titular.NroDocIdentidad = '';
        if(info.nrodocidentidad != undefined ) this.resp.Titular.NroDocIdentidad = info.nrodocidentidad;

        let nrodoc = this.resp.Titular.NroDocIdentidad.split('');
        for (let i = 0; i < nrodoc.length; i++) {
            this.resp.Titular.DocIdentidad[i] = nrodoc[i];
        }

        this.resp.Titular.Nombres = info.nombres;
        this.resp.Titular.ApellidoPaterno = info.apellidopaterno;
        this.resp.Titular.ApellidoMaterno = info.apellidomaterno;

        this.resp.ConConyuge = this.conConyuge;
        if(this.conConyuge){            
            this.listTipoDocIdentConyuge.forEach(td => {
                if(td.value == info.tipodocidentidadconyuge) {
                  this.resp.Conyuge.IdTipoDocIdentidad = td.value;
                  this.resp.Conyuge.CodeTipoDocIdentidad = td.code;
                  this.resp.Conyuge.TipoDocIdentidad = td.text;
                }
              });
    
            this.resp.Conyuge.NroDocIdentidad = '';
            if(info.nrodocidentidadconyuge != undefined ) this.resp.Conyuge.NroDocIdentidad = info.nrodocidentidadconyuge;

            let nrodoc = this.resp.Conyuge.NroDocIdentidad.split('');
            for (let i = 0; i < nrodoc.length; i++) {
                this.resp.Conyuge.DocIdentidad[i] = nrodoc[i];
            }

            this.resp.Conyuge.Nombres = info.nombresconyuge;
            this.resp.Conyuge.ApellidoPaterno = info.apellidopaternoconyuge;
            this.resp.Conyuge.ApellidoMaterno = info.apellidomaternoconyuge;
        }

        this.form.reset();
        this.dialogRef.close(this.resp);
    }

}
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PersonaRequest, PersonaResponse } from 'src/app/intranet/models/personaResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfiguracionService } from '../../configuracion.service';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { fnFilterMasterCatalog } from 'src/app/core/shared/function/fnFilterMasterCatalog';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { IntranetService } from 'src/app/intranet/intranet.service';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { getCode } from 'src/app/core/shared/function/fnGlobal';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

@Component({
    selector: 'app-persona-modal',
    templateUrl: './persona-modal.component.html',
    styleUrls: ['./persona-modal.component.css']
})
export class PersonaModalComponent implements OnInit, OnDestroy {

    form: FormGroup;
    
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    mascara = '00000000';

    ListaTipoDocumento: ItemSelect<number>[] = [];
    ListaCargo: ItemSelect<number>[] = [];
    
    public listaPersonal$: Subscription = new Subscription;
    public listaCargo$: Subscription = new Subscription;
    public saveForm$: Subscription = new Subscription;

    constructor(
        private _configuracionService: ConfiguracionService,
        private _intranetSerice: IntranetService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<PersonaModalComponent>,
          @Inject(MAT_DIALOG_DATA) public data: PersonaResponse,
        ){
            this.form = this.fb.group({
                tipodocumento: [0, Validators.required],
                numerodocumento: ['', Validators.required],
                apellidopaterno: ['', Validators.required],
                apellidomaterno: [''],
                nombres: ['', Validators.required],
                cargo: [0, Validators.required],
                celular: ['', Validators.required],
                correo: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            });

            this.ListaTipoDocumento = fnFilterMasterCatalog(CatalogoMasterEnum.TipoDocumentoIdentidadPersona);
    }

    ngOnInit(): void {
        this.ListaCargo = [];
        this.ListaCargo.push({ value: 0, text: 'seleccionar' });
        this.listaCargo$ = this._intranetSerice.ListarCargo().subscribe(resp => {
            if(resp.success){
                let lista = resp.data;
                lista.forEach(elem => {
                    this.ListaCargo.push({
                        value: elem.idCargo,
                        text: elem.nombreCargo,
                        code: elem.codigoCargo
                    });                    
                });
            }
        });

        let info = this.data;
        if(info.accion == 2)
        {
            this.form.patchValue({
                tipodocumento: info.idTipoDocumento,
                numerodocumento: info.numeroDocumento,
                apellidopaterno: info.apePaterno,
                apellidomaterno: info.apeMaterno,
                nombres: info.nombres,
                cargo: info.idCargo,
                celular: info.celular,
                correo: info.correo
            });            
        }
    }    

    ngOnDestroy(): void {
        this.listaPersonal$.unsubscribe();
        this.listaCargo$.unsubscribe();
        this.saveForm$.unsubscribe();
    }

    limpiar(e){
        this.form.patchValue({ 
            tipodocumento: 0,
            numerodocumento: '',
            apellidopaterno: '',
            apellidomaterno: '',
            nombres: '',
            cargo: 0,
            celular: '',
            correo: ''
        });

        this.form.markAsUntouched();

        e.stopPropagation();
        e.preventDefault();
    }

    onChangeSelDocIdent()
    {
        const tipodocumento = this.form.get('tipodocumento');
        const numerodocumento = this.form.get('numerodocumento');
        
        numerodocumento.clearValidators();
        numerodocumento.setValue('');

        let code = getCode(tipodocumento.value, this.ListaTipoDocumento);
        if(code == 1){            
            this.mascara = '00000000';
            numerodocumento.addValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
        }
        else{
            numerodocumento.clearValidators();
            this.mascara = '000000000';
            numerodocumento.addValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
        }
        numerodocumento.updateValueAndValidity();
    }

    guardar(){
        let info = this.form.value;
        let request: PersonaRequest = {
            idPersona: this.data.idPersona,
            accion: this.data.accion,
            nombres: info.nombres,
            apePaterno: info.apellidopaterno,
            apeMaterno: info.apellidomaterno,
            idTipoDocumento: info.tipodocumento,
            numeroDocumento: info.numerodocumento,
            idCargo: info.cargo,
            celular: info.celular,
            correo: info.correo,
            archivoFoto: null
        }

        let dg = this.ModalLoading();
        this.saveForm$ = this._configuracionService.GestionarPersona(request)
        .subscribe(result => {                
            setTimeout(() => {
                dg.close();
                if(result.success)
                {
                    let modal: Title = { 
                        Title: (request.accion == 1 ? 'Nuevo Personal' : 'Personal Actualizado'), 
                        Subtitle: result.message, 
                        Icon: 'ok' 
                        }
                    const okModal = this.dialog.open(ModalMessageComponent, {
                        width: '500px',
                        enterAnimationDuration: '300ms',
                        exitAnimationDuration: '300ms',
                        disableClose: true,
                        data: modal,
                        scrollStrategy: new NoopScrollStrategy()
                    });

                    okModal.afterClosed().subscribe(result => {
                        if(result){
                            this.form.reset();
                            this.dialogRef.close(true);   
                        }      
                    });
                }
                else
                {
                    let modal: Title = { 
                        Title: 'Opss...', 
                        Subtitle: result.message, 
                        Icon: 'error' 
                    }
                    this.dialog.open(ModalMessageComponent, {
                        width: '500px',
                        enterAnimationDuration: '300ms',
                        exitAnimationDuration: '300ms',
                        disableClose: true,
                        data: modal,
                        scrollStrategy: new NoopScrollStrategy()
                    });
                }
            }, 300);
        });
    }

    ModalLoading(): any {     
        let modal: Title = { 
          Title: 'Guardando...'}
        let dgRef = this.dialog.open(ModalLoadingComponent, {
            width: '300px',
            height: '95px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal,
            scrollStrategy: new NoopScrollStrategy()
        }); 
  
        return dgRef;
    }       

}
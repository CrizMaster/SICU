import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PersonaResponse, UsuarioRequest } from 'src/app/intranet/models/personaResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfiguracionService } from '../../configuracion.service';
import { IntranetService } from 'src/app/intranet/intranet.service';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
  
@Component({
    selector: 'app-usuario-modal',
    templateUrl: './usuario-modal.component.html',
    styleUrls: ['./usuario-modal.component.css']
})

export class UsuarioModalComponent implements OnInit, OnDestroy {

    form: FormGroup;
    hide: boolean = true;
    hiderepite: boolean = true;
    hideactual: boolean = true;
    title = {
        title: 'Nuevo Usuario',
        icon: 'person_add',
        titlePass: 'Password',
        titlePass2: 'Repetir Password'
    };

    public saveForm$: Subscription = new Subscription;

    constructor(
        private _configuracionService: ConfiguracionService,
        private _intranetSerice: IntranetService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<UsuarioModalComponent>,
          @Inject(MAT_DIALOG_DATA) public data: PersonaResponse,
        ){
            this.form = this.fb.group({
                passwordactual: [''],
                password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
                passwordrepite: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]]
            });
        }

    ngOnInit(): void {

        let info = this.data;
        if(info.accion == 1){
            this.title = {
                title: 'Nuevo Usuario',
                icon: 'person_add',
                titlePass: 'Password',
                titlePass2: 'Repetir Password'
            }            
        }
        else if(info.accion == 2){
            this.title = {
                title: 'Cambiar Password',
                icon: 'key',
                titlePass: 'Nuevo Password',
                titlePass2: 'Repetir Nuevo Password'
            }
            const passwordactual = this.form.get('passwordactual');
            passwordactual.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(30)]);
        }
    }    

    ngOnDestroy(): void {
        this.saveForm$.unsubscribe();
    }

    get PasswordActual() {
        return this.form.controls.passwordactual; 
    }

    get Password() {
        return this.form.controls.password; 
    }
    get PasswordRepite() { 

        let pass = this.form.controls.password.value;
        let passrep = this.form.controls.passwordrepite.value;
        
        if(pass != passrep) this.form.setErrors({ confirmedValidator: true });
        else this.form.setErrors(null);

        return this.form.controls.passwordrepite; 
    }

    guardar(){
        let info = this.form.value;
        
        let request: UsuarioRequest = {
            idPersona: this.data.idPersona,
            accion: this.data.accion,
            password: info.password,
            passwordRepite: info.passwordrepite
        }

        if(this.data.accion == 2) request.passwordActual = info.passwordactual;

        let dg = this.ModalLoading();
        this.saveForm$ = this._configuracionService.GestionarUsuario(request)
        .subscribe(result => {                
            setTimeout(() => {
                dg.close();
                if(result.success)
                {
                    let modal: Title = { 
                        Title: (request.accion == 1 ? 'Nuevo Usuario' : 'Password Cambiado'), 
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
          Title: 'Creando Usuario...'}
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
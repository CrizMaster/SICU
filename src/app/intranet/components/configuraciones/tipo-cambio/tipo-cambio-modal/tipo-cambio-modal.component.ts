import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfiguracionService } from '../../configuracion.service';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { TipoCambioRequest } from 'src/app/intranet/models/tipoCambioResponse';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
  
@Component({
    selector: 'app-tipo-cambio-modal',
    templateUrl: './tipo-cambio-modal.component.html',
    styleUrls: ['./tipo-cambio-modal.component.css']
})
export class TipoCambioModalComponent implements OnInit, OnDestroy {

    form: FormGroup;
    public saveForm$: Subscription = new Subscription;

    constructor(
        private _configuracionService: ConfiguracionService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<TipoCambioModalComponent>,
          @Inject(MAT_DIALOG_DATA) public data: any,
        ){
            this.form = this.fb.group({
                tccompra: ['', [Validators.required, Validators.pattern('^[0-9]*\.[0-9]{0,3}$')]],
                tcventa: ['', [Validators.required, Validators.pattern('^[0-9]*\.[0-9]{0,3}$')]]
            });
    }

    ngOnInit(): void {
    }    

    ngOnDestroy(): void {
        this.saveForm$.unsubscribe();
    }

    guardar(){
        let info = this.form.value;
        let request: TipoCambioRequest = {
            tcCompra: info.tccompra,
            tcVenta: info.tcventa
        }

        let dg = this.ModalLoading();
        this.saveForm$ = this._configuracionService.GestionarTipoCambio(request)
        .subscribe(result => {                
            setTimeout(() => {
                dg.close();
                if(result.success)
                {
                    let modal: Title = { 
                        Title: 'Nuevo Tipo de Cambio', 
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
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { fnFilterMasterCatalog } from 'src/app/core/shared/function/fnFilterMasterCatalog';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { MantenimientoService } from '../../../mantenimiento.service';
import { ProductoRequest, ProductoResponse } from 'src/app/intranet/models/productoResponse';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
  
@Component({
    selector: 'app-producto-modal',
    templateUrl: './producto-modal.component.html',
    styleUrls: ['./producto-modal.component.css']
})
export class ProductoModalComponent implements OnInit, OnDestroy {

    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';

    ListaMoneda: ItemSelect<number>[] = [];

    public saveForm$: Subscription = new Subscription;

    constructor(
        private _mantenimientoServicio: MantenimientoService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ProductoModalComponent>,
          @Inject(MAT_DIALOG_DATA) public data: ProductoResponse,
        ){
            this.form = this.fb.group({
                codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
                nombreproducto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
                moneda: [0, [Validators.required, Validators.pattern(this.pattern1Digs)]],
                valorcompra: ['', [Validators.required, Validators.pattern('^[0-9]*\.[0-9]{0,2}$')]]
            });

            this.ListaMoneda = fnFilterMasterCatalog(CatalogoMasterEnum.Moneda);
    }

    ngOnInit(): void {

        let info = this.data;
        if(info.accion == 2)
        {
            this.form.patchValue({
                codigo: info.codigo,
                nombreproducto: info.nombreProducto,
                moneda: info.idMoneda,
                valorcompra: info.valorCompra
            });            
        }
    }    

    ngOnDestroy(): void {
        this.saveForm$.unsubscribe();
    }

    limpiar(e){
        this.form.patchValue({ 
            codigo: '',
            nombreproducto: '',
            moneda: 0,
            valorcompra: ''
        });

        this.form.markAsUntouched();

        e.stopPropagation();
        e.preventDefault();
    }

    guardar(){
        let info = this.form.value;
        let request: ProductoRequest = {
            idProducto: this.data.idProducto,
            accion: this.data.accion,
            codigo: info.codigo,
            nombreProducto: info.nombreproducto,
            idMoneda: info.moneda,
            valorCompra: info.valorcompra
        }

        let dg = this.ModalLoading();
        this.saveForm$ = this._mantenimientoServicio.GestionarProducto(request)
        .subscribe(result => {                
            setTimeout(() => {
                dg.close();
                if(result.success)
                {
                    let modal: Title = { 
                        Title: (request.accion == 1 ? 'Nuevo Producto' : 'Producto Actualizado'), 
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
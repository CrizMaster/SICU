import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PersonaFilter, PersonaResponse } from 'src/app/intranet/models/personaResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Title } from 'src/app/core/models/title.model';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfiguracionService } from '../../configuracion.service';
  
@Component({
    selector: 'app-persona-modal',
    templateUrl: './persona-modal.component.html',
    styleUrls: ['./persona-modal.component.css']
})
export class PersonaModalComponent implements OnInit, OnDestroy {

    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    //Persona: PersonaResponse = {};
    
    public listaPersonal$: Subscription = new Subscription;
    
    ListaTipoDocumento: any[] = [
        { value: 1, text: 'DNI'},
        { value: 3, text: 'CE'}
    ];

    ListaCargo: any[] = [];

    constructor(
        private _configuracionService: ConfiguracionService,
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
                correo: ['', Validators.required]
            });                        
    }

    ngOnInit(): void {

    }    

    ngOnDestroy(): void {
        this.listaPersonal$.unsubscribe();
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

    guardar(){

    }

    ModalLoading(): any {     
        let modal: Title = { 
          Title: 'Procesando...'}
        let dgRef = this.dialog.open(ModalLoadingComponent, {
            width: '300px',
            height: '95px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal
        }); 
  
        return dgRef;
    }       

}
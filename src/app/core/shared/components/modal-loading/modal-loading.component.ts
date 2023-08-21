import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Title } from 'src/app/core/models/title.model';

@Component({
    selector: 'app-modal-loading',
    templateUrl: './modal-loading.component.html',
    styleUrls: ['./modal-loading.component.css']
})
export class ModalLoadingComponent implements OnInit{

    constructor(
        public dialogRef: MatDialogRef<ModalLoadingComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Title){}

    ngOnInit(): void {
        
    }

    Aceptar(){
        this.dialogRef.close(true);
    }

    Cancelar(){
        this.dialogRef.close(false);
    }

}
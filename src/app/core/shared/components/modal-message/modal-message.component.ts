import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Title } from 'src/app/core/models/title.model';

@Component({
    selector: 'app-modal-message',
    templateUrl: './modal-message.component.html',
    styleUrls: ['./modal-message.component.css']
})
export class ModalMessageComponent implements OnInit{

    constructor(
        public dialogRef: MatDialogRef<ModalMessageComponent>,
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
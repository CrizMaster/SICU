import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Title } from 'src/app/core/models/title.model';

@Component({
    selector: 'app-modal-question',
    templateUrl: './modal-question.component.html',
    styleUrls: ['./modal-question.component.css']
})
export class ModalQuestionComponent implements OnInit{

    constructor(
        public dialogRef: MatDialogRef<ModalQuestionComponent>,
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
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImagenModel } from 'src/app/core/models/imagen.model';

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit{

    constructor(
        public dialogRef: MatDialogRef<ImageViewerComponent>,
        @Inject(MAT_DIALOG_DATA) public Data: ImagenModel){}

    ngOnInit(): void {
        
    }

    Aceptar(){
        this.dialogRef.close(true);
    }

    Cancelar(){
        this.dialogRef.close(false);
    }

}
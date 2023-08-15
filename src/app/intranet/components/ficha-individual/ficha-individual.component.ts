import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
// import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
// import Swal from 'sweetalert2';

  
@Component({
    selector: 'app-ficha-individual',
    templateUrl: './ficha-individual.component.html',
    styleUrls: ['./ficha-individual.component.css']
})
export class FichaIndividualComponent implements OnInit{

    tituloForm: Title = { Title: 'FICHAS CATASTRALES INDIVIDUALES', Subtitle : 'Bandeja Principal', Icon : 'person' };
    BreadcrumbForm: Breadcrumb[] = [{ name : "Fichas Catastrales" },{ name : "Individual" },{ name : "Bandeja Principal" }];    

    // @ViewChild('deleteSwal')
    // public readonly deleteSwal!: SwalComponent;

    constructor(){
    }

    ngOnInit(): void {        
    } 

    // Prueba(){
    //     Swal.fire(
    //         'Good job!',
    //         'You clicked the button!',
    //         'success'
    //       )
    // }

    // public saveFile(fileName: string): void {
    //     // ... save file

    //   }
    
    //   public handleDenial(): void {
    //       // ... don't save file and quit
    //   }
    
    //   public handleDismiss(dismissMethod: any): void {
    //     // dismissMethod can be 'cancel', 'overlay', 'close', and 'timer'
    //     // ... do something
    //   }    
    //     file: any = { name: 'peru' }
    //   deleteFile(arch: any){

    //   }

}
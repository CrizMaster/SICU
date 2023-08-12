import { Component, OnInit } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';

  
@Component({
    selector: 'app-ficha-individual',
    templateUrl: './ficha-individual.component.html',
    styleUrls: ['./ficha-individual.component.css']
})
export class FichaIndividualComponent implements OnInit{

    tituloForm: Title = { Title: 'FICHAS CATASTRALES INDIVIDUALES', Subtitle : 'Bandeja Principal', Icon : 'person' };
    BreadcrumbForm: Breadcrumb[] = [{ name : "Fichas Catastrales" },{ name : "Individual" },{ name : "Bandeja Principal" }];    

    constructor(){
    }

    ngOnInit(): void {        
    } 

}
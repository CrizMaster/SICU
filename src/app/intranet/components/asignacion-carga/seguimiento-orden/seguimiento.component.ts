import { Component, OnInit } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
import { ActivatedRoute } from '@angular/router';
import { Sector } from '../../ficha-individual/models/sector.model';
  
@Component({
    selector: 'app-seguimiento',
    templateUrl: './seguimiento.component.html',
    styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit{

    tituloForm: Title = { Title: 'SEGUIMIENTO DE ORDEN', Subtitle : 'Bandeja de ordenes', Icon : 'assignment', Url: '' };
    BreadcrumbForm: Breadcrumb[] = [{ name : "Asignación de carga" },{ name : "Seguimiento de orden" }];

    sectores: Sector[];
    
    constructor(
        private actRoute: ActivatedRoute
        ){            
    }

    ngOnInit(): void {
        this.actRoute.data.subscribe(resp => {
            if(resp.resolve.success){
                this.sectores = resp.resolve.data;
            }
            else{ console.log(resp.resolve.message); }
        });
    }    

}
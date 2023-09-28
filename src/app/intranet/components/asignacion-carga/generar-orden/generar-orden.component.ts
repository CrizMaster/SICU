import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
import { GenerarOrdenService } from './generar-orden.service';
import { ActivatedRoute } from '@angular/router';
import { Sector } from '../../ficha-individual/models/sector.model';
  
@Component({
    selector: 'app-generar-orden',
    templateUrl: './generar-orden.component.html',
    styleUrls: ['./generar-orden.component.css']
})
export class GenerarOrdenComponent implements OnInit{

    tituloForm: Title = { Title: 'GENERAR ORDEN', Subtitle : 'Bandeja de ordenes', Icon : 'assignment' };
    BreadcrumbForm: Breadcrumb[] = [{ name : "Asignación de carga" },{ name : "Generar Orden" },{ name : "Bandeja de ordenes" }];

    sectores: Sector[];
    
    constructor(
        private _generarOrdenServicio: GenerarOrdenService,
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
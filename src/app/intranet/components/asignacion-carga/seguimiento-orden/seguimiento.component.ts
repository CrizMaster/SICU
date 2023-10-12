import { Component, OnInit } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
import { ActivatedRoute } from '@angular/router';
import { Sector } from '../../ficha-individual/models/sector.model';
import { AsignacionCargaService } from '../asignacion-carga.service';
  
@Component({
    selector: 'app-seguimiento',
    templateUrl: './seguimiento.component.html',
    styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit{

    tituloForm: Title = { Title: 'SEGUIMIENTO DE ORDENES DE TRABAJO', Subtitle : 'Bandeja de ordenes de trabajo', Icon : 'assignment', Url: '' };
    BreadcrumbForm: Breadcrumb[] = [{ name : "Asignación de carga" },{ name : "Seguimiento de orden de trabajo" }];

    sectores: Sector[];
    
    constructor(
        private actRoute: ActivatedRoute,
        private _asignacionCarga: AsignacionCargaService
        ){            
    }

    ngOnInit(): void {
        this.actRoute.data.subscribe(resp => {
            if(resp.resolve.success){
                this.sectores = resp.resolve.data;
            }
            else{ console.log(resp.resolve.message); }
        });

        this._asignacionCarga.OrigenFilter.next(2);
    }    

}
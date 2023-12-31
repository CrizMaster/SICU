import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
import { ActivatedRoute } from '@angular/router';
import { Sector } from '../../ficha-individual/models/sector.model';
import { AsignacionCargaService } from '../asignacion-carga.service';
  
@Component({
    selector: 'app-generar-orden',
    templateUrl: './generar-orden.component.html',
    styleUrls: ['./generar-orden.component.css']
})
export class GenerarOrdenComponent implements OnInit{

    tituloForm: Title = { Title: 'GENERAR ORDEN DE TRABAJO', Subtitle : 'Bandeja de ordenes de trabajo', Icon : 'assignment', Url: '' };
    BreadcrumbForm: Breadcrumb[] = [{ name : "Asignación de carga" },{ name : "Generar Orden de trabajo" },{ name : "Bandeja de ordenes de trabajo" }];

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

        this._asignacionCarga.OrigenFilter.next(1);
    }    

}
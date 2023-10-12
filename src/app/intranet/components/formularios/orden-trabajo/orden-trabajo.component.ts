import { Component, OnInit } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
import { ActivatedRoute } from '@angular/router';
import { Sector } from '../../ficha-individual/models/sector.model';
import { AsignacionCargaService } from '../../asignacion-carga/asignacion-carga.service';
  
@Component({
    selector: 'app-orden-trabajo',
    templateUrl: './orden-trabajo.component.html',
    styleUrls: ['./orden-trabajo.component.css']
})
export class OrdenTrabajoComponent implements OnInit{

    tituloForm: Title = { Title: 'ORDENES DE TRABAJO', Subtitle : 'Bandeja de ordenes de trabajo', Icon : 'assignment', Url: '' };
    BreadcrumbForm: Breadcrumb[] = [{ name : "Formularios" },{ name : "Orden de trabajo" }];

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
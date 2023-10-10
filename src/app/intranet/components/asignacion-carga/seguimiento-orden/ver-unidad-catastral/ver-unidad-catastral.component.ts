import { Component, Input, OnInit } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
import { OrdenTrabajoView } from '../../models/ordenTrabajoResponse';
import { SeguimientoService } from '../seguimiento.service';
import { Subscription } from 'rxjs';
  
@Component({
    selector: 'app-ver-unidad-catastral',
    templateUrl: './ver-unidad-catastral.component.html',
    styleUrls: ['./ver-unidad-catastral.component.css']
})
export class VerUnidadCatastralComponent implements OnInit{

    tituloForm: Title = { Title: 'ORDEN DE TRABAJO', Subtitle : 'Seguimiento de unidades catastrales', 
    Icon : 'assignment', Url:'/intranet/verlote' };

    BreadcrumbForm: Breadcrumb[] = 
    [{ name : "Asignación de carga" },
    { name : "Seguimiento de orden de trabajo", navigate: '/intranet/seguimiento' },
    { name : "Lotes", navigate: '/intranet/verlote' },
    { name : "Unidades catastrales"}];

    datos:OrdenTrabajoView = {};

    public viewOT$: Subscription = new Subscription;
    
    constructor(
        private _seguimientoService: SeguimientoService
        ){}

    ngOnInit(): void {

        this.viewOT$  = this._seguimientoService.viewOrdenTrabajo.subscribe({
            next:(Data) => {
                this.datos = Data;
                this.tituloForm.Title = 'ORDEN DE TRABAJO ' + this.datos.orden + ' > LOTE ' + this.datos.nroLote;
            }
          });
    }    

    ngOnDestroy(): void {
        this.viewOT$.unsubscribe();
      }

}
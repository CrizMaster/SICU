import { Component, Input, OnInit } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
import { Subscription } from 'rxjs';
import { OrdenTrabajoService } from '../orden-trabajo.service';
import { OrdenTrabajoView } from '../../../asignacion-carga/models/ordenTrabajoResponse';
  
@Component({
    selector: 'app-lote-orden',
    templateUrl: './lote-orden.component.html',
    styleUrls: ['./lote-orden.component.css']
})
export class LoteOrdenComponent implements OnInit{

    tituloForm: Title = { Title: 'ORDEN DE TRABAJO', Subtitle : 'Bandeja de lotes', 
    Icon : 'assignment', Url:'/intranet/seguimiento' };
    BreadcrumbForm: Breadcrumb[] = [{ name : "Formularios" },
    { name : "Orden de trabajo", navigate: '/intranet/ordentrabajo' },
    { name : "Lotes" }];

    datos:OrdenTrabajoView = {};

    public viewOT$: Subscription = new Subscription;
    
    constructor(
        private _ordenTrabajoService: OrdenTrabajoService
        ){}

    ngOnInit(): void {

        this.viewOT$  = this._ordenTrabajoService.viewOrdenTrabajo.subscribe({
            next:(Data) => {
                this.datos = Data;
                this.tituloForm.Title = 'ORDEN DE TRABAJO ' + this.datos.orden;
            }
          });
    }    

    ngOnDestroy(): void {
        this.viewOT$.unsubscribe();
      }

}
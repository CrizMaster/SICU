import { Component, Input, OnInit } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
import { OrdenTrabajoView } from '../../models/ordenTrabajoResponse';
import { SeguimientoService } from '../seguimiento.service';
import { Subscription } from 'rxjs';
  
@Component({
    selector: 'app-ver-orden',
    templateUrl: './ver-orden.component.html',
    styleUrls: ['./ver-orden.component.css']
})
export class VerOrdenComponent implements OnInit{

    tituloForm: Title = { Title: 'ORDEN DE TRABAJO', Subtitle : 'Seguimiento de ordenes', 
    Icon : 'assignment', Url:'/intranet/seguimiento' };
    BreadcrumbForm: Breadcrumb[] = [{ name : "Asignación de carga" },
    { name : "Seguimiento de orden", navigate: '/intranet/seguimiento' },
    { name : "Orden" }];

    datos:OrdenTrabajoView = {};

    public viewOT$: Subscription = new Subscription;
    
    constructor(
        private _seguimientoService: SeguimientoService
        ){}

    ngOnInit(): void {

        this.viewOT$  = this._seguimientoService.viewOrdenTrabajo.subscribe({
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
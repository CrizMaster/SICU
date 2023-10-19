import { Component, Input, OnInit } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';
import { Subscription } from 'rxjs';
import { OrdenTrabajoService } from '../../orden-trabajo.service';
import { OrdenTrabajoView } from 'src/app/intranet/components/asignacion-carga/models/ordenTrabajoResponse';
  
@Component({
    selector: 'app-registro-lote-orden',
    templateUrl: './registro-lote-orden.component.html',
    styleUrls: ['./registro-lote-orden.component.css']
})
export class RegistroLoteOrdenComponent implements OnInit{

    tituloForm: Title = { Title: 'ORDEN DE TRABAJO', Subtitle : 'Bandeja de lotes', 
    Icon : 'assignment', Url:'/intranet/seguimiento' };
    BreadcrumbForm: Breadcrumb[] = [{ name : "Formularios" },
    { name : "Orden de trabajo", navigate: '/intranet/ordentrabajo' },
    { name : "Lotes", navigate: '/intranet/loteOrden' },
    { name : "Lote" }];

    datos:OrdenTrabajoView = {};

    public viewOT$: Subscription = new Subscription;
    public filterLote$: Subscription = new Subscription;
    
    constructor(
        private _ordenTrabajoService: OrdenTrabajoService
        ){}

    ngOnInit(): void {

        this.viewOT$  = this._ordenTrabajoService.viewOrdenTrabajo.subscribe({
            next:(Data) => {
                this.datos = Data;
            }
        });

        this.filterLote$ = this._ordenTrabajoService.filterCaracterizacion.subscribe({
            next:(info) => {                
                this.tituloForm.Title = 'ORDEN DE TRABAJO ' + this.datos.orden + " > LOTE " + info.codigoLoteCaracterizacion;
            }
        });
    }    

    ngOnDestroy(): void {
        this.viewOT$.unsubscribe();
        this.filterLote$.unsubscribe();
      }

}
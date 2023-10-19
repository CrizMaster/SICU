import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SeguimientoService } from '../seguimiento.service';
import { OrdenTrabajoView, UsuariosRequest } from '../../models/ordenTrabajoResponse';
  
@Component({
    selector: 'app-info-orden',
    templateUrl: './info-orden.component.html',
    styleUrls: ['./info-orden.component.css']
})
export class InfoOrdenComponent implements OnInit{


    @Input() datos: OrdenTrabajoView = {};
    color: string = 'primary';
    constructor(){            
    }

    ngOnInit(): void {
        console.log(this.datos);
    }

    getColor(dato: UsuariosRequest): string{
        return dato.codigoTipo == '01' ? 'primary' : undefined;
    }

}
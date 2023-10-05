import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SeguimientoService } from '../../seguimiento.service';
import { OrdenTrabajoView } from '../../../models/ordenTrabajoResponse';
  
@Component({
    selector: 'app-info-orden',
    templateUrl: './info-orden.component.html',
    styleUrls: ['./info-orden.component.css']
})
export class InfoOrdenComponent implements OnInit{


    @Input() datos: OrdenTrabajoView = {};
    
    constructor(){            
    }

    ngOnInit(): void {
    }

}
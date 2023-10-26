import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { UnidadAdministrativaService } from './unidad-administrativa.service';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';

@Component({
    selector: 'app-unidad-administrativa',
    templateUrl: './unidad-administrativa.component.html',
    styleUrls: ['./unidad-administrativa.component.css']
})
export class UnidadAdministrativaComponent implements OnInit, OnDestroy {

    viewBandeja: boolean = false;

    constructor(
        private _unidadAdministrativaService: UnidadAdministrativaService
    ){}


    ngOnInit(): void {
        this._unidadAdministrativaService.UnidadAdministrativa.subscribe({
            next:(Data:StatusResponse<UnidadAdministrativaResponse>) => {
                this.viewBandeja = Data.success;
            }
        });        
    }

    ngOnDestroy(): void {}

}
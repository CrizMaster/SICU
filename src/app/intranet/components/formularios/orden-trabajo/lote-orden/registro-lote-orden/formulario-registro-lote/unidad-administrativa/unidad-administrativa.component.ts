import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
        private _unidadAdministrativaService: UnidadAdministrativaService,
        private cd: ChangeDetectorRef
    ){
        //console.log('const');
    }


    ngOnInit(): void {
        this._unidadAdministrativaService.UnidadAdministrativa.subscribe({
            next:(Data:StatusResponse<UnidadAdministrativaResponse>) => {
                this.viewBandeja = Data.success;
            }
        });
       //console.log('init');
    }

    ngAfterContentChecked(): void {
        this.cd.detectChanges();
    }

    ngOnDestroy(): void {}

}
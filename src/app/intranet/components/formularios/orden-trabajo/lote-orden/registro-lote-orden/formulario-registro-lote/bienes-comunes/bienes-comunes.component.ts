import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { BienesComunesService } from './bienes-comunes.service';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { UnidadAdministrativaResponse } from 'src/app/intranet/components/formularios/models/unidadAdministrativaResponse';
import { BienesComunesResponse } from 'src/app/intranet/components/formularios/models/bienesComunesResponse';

@Component({
    selector: 'app-bienes-comunes',
    templateUrl: './bienes-comunes.component.html',
    styleUrls: ['./bienes-comunes.component.css']
})
export class BienesComunesComponent implements OnInit, OnDestroy {

    viewActualizar: boolean = false;

    constructor(
        private _BienesComunesService: BienesComunesService,
        //private cd: ChangeDetectorRef
    ){
        //console.log('const');
    }


    ngOnInit(): void {
        this._BienesComunesService.BienesComunes.subscribe({
            next:(Data:StatusResponse<BienesComunesResponse>) => {
                this.viewActualizar = Data.success;
            }
        });
       //console.log('init');
    }

    // ngAfterContentChecked(): void {
    //     this.cd.detectChanges();
    // }

    ngOnDestroy(): void {}

}
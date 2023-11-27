import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecapitulacionEdificaResponse } from 'src/app/intranet/components/formularios/models/recapitulacionEdificaResponse';
import { BienesComunesService } from '../../bienes-comunes.service';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-recapitulacion-matriz',
    templateUrl: './recapitulacion-matriz.component.html',
    styleUrls: ['./recapitulacion-matriz.component.css']
})
export class RecapitulacionMatrizComponent implements OnInit, OnDestroy {

    form: FormGroup;
    total: number = 0;
    totalPorc: number = 0;
    strTotal: string = '';
    strTotalPorc: string = '';
    
    //displayedColumns: string[] = ['Dpto', 'Prov', 'Dist', 'Sec', 'Mz', 'Lote', 'Edifica', 'AreaTerreno', 'Porcentaje'];;

    //dataSource = new MatTableDataSource<RecapitulacionEdificaResponse>();

    public listRecapMatriz$: Subscription = new Subscription;
    
    constructor(
        private route: Router,
        private _activatedRoute:ActivatedRoute,
        private _BienesComunesService: BienesComunesService,
        private fb: FormBuilder
    ){

        this.form = this.fb.group({
            lista: this.fb.array([],[Validators.required])
        });

        this.listRecapMatriz$ = this._BienesComunesService.ConsultaDatosRecapitulacionEdifica(0)
        .subscribe((Data:StatusResponse<RecapitulacionEdificaResponse[]>) => {
            if(Data.data != undefined){

                Data.data.forEach(el => {

                    const edificaForm = this.fb.group({
                        dpto: [el.codigoDepartamento],
                        prov: [el.codigoProvincia],
                        dist: [el.codigoDistrito],
                        sec: [el.codigoSector],
                        mz: [el.codigoManzana],
                        lote: [el.codigoLote],
                        edifica: [el.numeroEdificacion],
                        area: [el.areaTerrenoOcupado, [Validators.required, Validators.pattern("^[0-9]+\.?[0-9]*$")]],
                        porcentaje: [el.porcentajeAreaTerrenoOcupado]
                    });

                    const control = this.form.get('lista') as FormArray;
                    control.push(edificaForm);

                });

            }
        });        
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.listRecapMatriz$.unsubscribe();
    }

    CreateFormGroup(): FormGroup {
        return this.fb.group({
            dpto:[''],
            prov:[''],
            dist:[''],
            sec:[''],
            mz:[''],
            lote:[''],
            edifica:[''],
            area: [0, Validators.required],
            porcentaje: ['', Validators.required]
        });
    }

    get getFormControl(){
        const control = this.form.get('lista') as FormArray;
        return control;
    }    

    onBlur(edi: FormGroup){
        if(edi.valid){
            let ctrlArea = edi.get('area');
            ctrlArea.setValue(parseFloat(ctrlArea.value).toFixed(2));
        }
    }

    onKeyupEvent(event: any){
        
        this.total = 0;
        this.strTotal = '';
        this.totalPorc = 0;
        this.strTotalPorc = '';
        
        const lista = this.form.get('lista') as FormArray;

        lista.controls.forEach((ctrl:any) => {
            let ctrlPorc = ctrl.get('porcentaje');
            ctrlPorc.setValue('');
        });

        if(this.form.valid){
            lista.value.forEach(el => {
                //el.area = parseFloat(el.area);
                this.total = this.total + parseFloat(el.area);
            });

            lista.controls.forEach((ctrl:any) => {
                let ctrlPorc = ctrl.get('porcentaje');
                let ctrlArea = ctrl.get('area');
                
                let Porc = ((parseFloat(ctrlArea.value) * 100) / this.total);

                this.totalPorc = this.totalPorc + Porc;
                ctrlPorc.setValue(Porc.toFixed(2));
            });

            this.strTotal = this.total.toFixed(2);
            this.strTotalPorc = this.totalPorc.toFixed(2);
        }

    }    

}
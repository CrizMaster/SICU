import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BienesComunesService } from '../../bienes-comunes.service';
import { Subscription } from 'rxjs';
import { StatusResponse } from 'src/app/core/models/statusResponse.model';
import { RecapitulacionBCResponse } from 'src/app/intranet/components/formularios/models/recapitulacionBCResponse';

@Component({
    selector: 'app-recapitulacion-bc',
    templateUrl: './recapitulacion-bc.component.html',
    styleUrls: ['./recapitulacion-bc.component.css']
})
export class RecapitulacionBcComponent implements OnInit, OnDestroy {

    form: FormGroup;
    total: number = 0;
    totalPorc: number = 0;
    strTotal: string = '';
    strTotalPorc: string = '';
    
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

        this.listRecapMatriz$ = this._BienesComunesService.ConsultaDatosRecapitulacionBC(0)
        .subscribe((Data:StatusResponse<RecapitulacionBCResponse[]>) => {
            if(Data.data != undefined){

                Data.data.forEach(el => {

                    const edificaForm = this.fb.group({
                        nro: [el.nro],
                        edifica: [el.codigoEdifica],
                        entrada: [el.entrada],
                        piso: [el.piso],
                        unidad: [el.unidad],
                        areaverificada: [el.areaTerrenoVerificada],
                        areaocupada: [el.areaTerrenoOcupado, [Validators.required, Validators.pattern("^[0-9]+\.?[0-9]*$")]],
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

    get getFormControl(){
        const control = this.form.get('lista') as FormArray;
        return control;
    }

    onBlur(edi: FormGroup){
        if(edi.valid){
            let ctrlArea = edi.get('areaocupada');
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
                //el.areaocupada = parseFloat(el.areaocupada);
                this.total = this.total + parseFloat(el.areaocupada);
            });

            lista.controls.forEach((ctrl:any) => {
                let ctrlPorc = ctrl.get('porcentaje');
                let ctrlArea = ctrl.get('areaocupada');
                
                let Porc = ((parseFloat(ctrlArea.value) * 100) / this.total);

                this.totalPorc = this.totalPorc + Porc;
                ctrlPorc.setValue(Porc.toFixed(2));
            });

            this.strTotal = this.total.toFixed(2);
            this.strTotalPorc = this.totalPorc.toFixed(2);
        }

    }    

}
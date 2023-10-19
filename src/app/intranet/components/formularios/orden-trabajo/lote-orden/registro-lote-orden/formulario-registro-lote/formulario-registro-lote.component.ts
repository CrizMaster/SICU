import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
  
@Component({
    selector: 'app-formulario-registro-lote',
    templateUrl: './formulario-registro-lote.component.html',
    styleUrls: ['./formulario-registro-lote.component.css'],
    providers: [
        {
          provide: STEPPER_GLOBAL_OPTIONS,
          useValue: {displayDefaultIndicatorType: false},
        },
      ]
})
export class FormularioRegistroLoteComponent implements OnInit{

    firstComplete = false;
    secondComplete = false;
    thirdComplete = false;
    roomComplete = false;
    fifthComplete = false;

    firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
    });

    secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    });

    thirdFormGroup = this._formBuilder.group({
        thirdCtrl: ['', Validators.required],
    });

    roomFormGroup = this._formBuilder.group({
        roomCtrl: ['', Validators.required],
    });

    fifthFormGroup = this._formBuilder.group({
        fifthCtrl: ['', Validators.required],
    });

    constructor(private _formBuilder: FormBuilder){}

    ngOnInit(): void {

    }    

    ngOnDestroy(): void {
    }

}
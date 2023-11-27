import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';
import { ViasCaracterizacion } from 'src/app/intranet/components/formularios/models/vias.model';
import { OrdenTrabajoService } from 'src/app/intranet/components/formularios/orden-trabajo/orden-trabajo.service';

@Component({
    selector: 'app-ubicacion-bc',
    templateUrl: './ubicacion-bc.component.html',
    styleUrls: ['./ubicacion-bc.component.css']
})
export class UbicacionBcComponent implements OnInit, OnDestroy {

    form : FormGroup;

    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    listEntrada: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listCondicionNumerica: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listTipopuerta: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    
    public listEntrada$: Subscription = new Subscription;
    
    // index: number = 1;
    // displayedColumns: string[] = ['Dpto', 'Prov', 'Dist', 'Sec', 'Mz', 'Lote', 'Edifica', 'Entrada', 'Piso', 'Unidad', 'Accion'];;

    // dataSource = new MatTableDataSource<BienesComunesResponse>();
    
    constructor(
        private route: Router,
        private _activatedRoute:ActivatedRoute,
        private _ordenTrabajoService: OrdenTrabajoService,
        private fb: FormBuilder,
        private changeDetector: ChangeDetectorRef
    ){
        this.form = this.fb.group({
            entrada: [0, Validators.required],
            tipopuerta: [0, Validators.required],
            condicionnumerica: [0, Validators.required],
            nromunicipalbc: ['', Validators.required]
          });

        this.listTipopuerta = getFilterMasterCatalog(CatalogoMasterEnum.TipoPuerta);
        this.listCondicionNumerica = getFilterMasterCatalog(CatalogoMasterEnum.CondicionNumeracion);
    }

    ngOnInit(): void {
        this.listEntrada$ = this._ordenTrabajoService.listaVias.subscribe({
            next:(Data:ViasCaracterizacion[]) => {
                
                this.listEntrada = [{ value:0, text:'Seleccionar' }];
                Data.forEach(elem => {
                    if(elem.checkedAct){
                        this.listEntrada.push({
                            value: elem.codigoViaLote, 
                            text: elem.nombreVia + ' - ' + elem.nombreTipoPuerta + ' ' + ( elem.numeroMunicipal || '')
                        });
                    }                    
                });
            }
        });        
    }

    ngOnDestroy(): void {
        this.listEntrada$.unsubscribe();
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }    

    onChangeCondicionNumerica(cn: string){
        const numeroMunicipal = this.form.get('nromunicipalbc');        
        let idCondicion = parseInt(cn);
        if(idCondicion == 4){            
            numeroMunicipal.setValue('S/N');
            numeroMunicipal.disable();
        }
        else if(idCondicion == 5){
            numeroMunicipal.setValue('');
            numeroMunicipal.disable();
            numeroMunicipal.clearValidators();
        }
        else{
            numeroMunicipal.setValue('');
            numeroMunicipal.enable();
            numeroMunicipal.setValidators([Validators.required]);
        }
        numeroMunicipal.updateValueAndValidity();
        numeroMunicipal.markAsUntouched();         
    }

    limpiar(){}
    guardar(){}

}
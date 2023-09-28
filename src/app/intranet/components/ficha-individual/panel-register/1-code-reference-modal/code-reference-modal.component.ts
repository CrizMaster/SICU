import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Ubigeo } from 'src/app/core/models/ubigeo.model';
import { FichaIndividualService } from '../../ficha-individual.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sector } from '../../models/sector.model';
import { Manzana } from '../../models/manzana.model';
import { Observable, Subscription } from 'rxjs';
import { SaveFichaIndividual } from '../../models/saveFichaIndividual.model';



@Component({
    selector: 'app-code-reference-modal',
    templateUrl: './code-reference-modal.component.html',
    styleUrls: ['./code-reference-modal.component.css']
})
export class CodeReferenceModalComponent implements OnInit, OnDestroy {

    dataFirst: SaveFichaIndividual;
    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    public listDpto$: Observable<Ubigeo[]> = new Observable;

    provincias: Ubigeo[] = [{ id: 0, ubigeo: '000000', nombreProvincia: 'Seleccionar', ubigeoProvincia: '00' }];
    distritos: Ubigeo[] = [{ id: 0, ubigeo: '000000', nombreDistrito: 'Seleccionar', ubigeoDistrito: '00' }];
    sectores: Sector[] = [{ idSector:0 , codigoSector: 'Seleccionar'}];
    manzanas: Manzana[] = [{ idManzana:0 , codigoManzana: 'Seleccionar'}];     

    public listProv$: Subscription = new Subscription;
    public listDist$: Subscription = new Subscription;
    public listSect$: Subscription = new Subscription;
    public listManz$: Subscription = new Subscription;

    constructor(
      public dialogRef: MatDialogRef<CodeReferenceModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: SaveFichaIndividual,
      private _fichaIndividualService: FichaIndividualService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){

      this.form = this.fb.group({
        codigoDepartamento: ['00', Validators.required],
        codigoProvincia: ['00', Validators.required],
        distrito: [0, Validators.required],
        sector: [0, Validators.required],
        manzana: [0, Validators.required],
        lote: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
        edifica: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        entrada: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        piso: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        unidad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
        //dc: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      });

      this.dataFirst = data;
    }
    
    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnDestroy(): void {
      this.listProv$.unsubscribe();
      this.listDist$.unsubscribe();
      this.listSect$.unsubscribe();
      this.listManz$.unsubscribe();
    }

    ngOnInit(): void {

      this.listDpto$ = this._fichaIndividualService.listarDepartamentos();

      if(this.dataFirst.idObjeto == 0){
        console.log('nuevo');
      }
      else{

        this.form.patchValue({ 
          lote: this.dataFirst.lote, 
          edifica: this.dataFirst.edifica, 
          entrada: this.dataFirst.entrada,
          piso: this.dataFirst.piso,
          unidad: this.dataFirst.unidad,
          codigoDepartamento: this.dataFirst.codigoDepartamento
        });

        this.onChangeSelDepa(this.dataFirst.codigoDepartamento, true);
      }
    }

    onChangeSelDepa(newValueDpto: string, sw: boolean){

      this.listProv$ = this._fichaIndividualService.listarProvincias(newValueDpto).subscribe({
        next:(result) => {
          this.provincias = result;
          
          this.distritos = [];
          this.sectores = [];
          this.manzanas = [];
          this.distritos.unshift({ id: 0, ubigeo: '000000', nombreDistrito: 'Seleccionar', ubigeoDistrito: '00' });
          this.sectores.unshift({ idSector: 0, codigoSector: 'Seleccionar'});
          this.manzanas.unshift({ idManzana: 0, codigoManzana: 'Seleccionar'});          

          if(sw) {
            this.form.patchValue({ codigoProvincia: this.dataFirst.codigoProvincia, distrito: parseInt(this.dataFirst.distrito) });
            this.onChangeSelProv(this.dataFirst.codigoProvincia, this.dataFirst.codigoDepartamento, true);
          }
          else{
            this.form.patchValue({ codigoProvincia: '00', distrito: 0, sector: 0, manzana: 0 });
          }
        }
      });
    }

    onChangeSelProv(newValueProv: string, newValueDpto: string, sw: boolean){

      this.listDist$ = this._fichaIndividualService.listarDistritos(newValueProv, newValueDpto).subscribe(result => {

        this.distritos = result;

        this.sectores = [];
        this.manzanas = [];
        this.sectores.unshift({ idSector: 0, codigoSector: 'Seleccionar'});
        this.manzanas.unshift({ idManzana: 0, codigoManzana: 'Seleccionar'});        

        if(sw) {

          this.distritos.forEach(e => {
            if(e.ubigeoDistrito == this.dataFirst.codigoDistrito) this.dataFirst.distrito = String(e.id);
          });

          this.form.patchValue({ distrito: parseInt(this.dataFirst.distrito) });
          this.onChangeSelDist(this.dataFirst.distrito, true);
        }
        else{
          this.form.patchValue({ distrito: 0, sector: 0, manzana: 0 });
        }
      });
    }

    onChangeSelDist(newValueDist: string, sw: boolean){
      console.log(newValueDist);
      this.listSect$ = this._fichaIndividualService.listarSectores(parseInt(newValueDist)).subscribe(result => {

        this.sectores = result.data;

        this.manzanas = [];
        this.manzanas.unshift({ idManzana: 0, codigoManzana: 'Seleccionar'});

        if(sw) {
          this.form.patchValue({ sector: parseInt(this.dataFirst.sector) });
          this.onChangeSelSector(this.dataFirst.sector, true);
        }
        else{
          this.form.patchValue({ sector: 0, manzana: 0 });
        }
      });
    }

    onChangeSelSector(newValueSect: string, sw: boolean){
      let codSector = '';
      this.sectores.forEach(sec => {
        if(sec.idSector == parseInt(newValueSect)) codSector = sec.codigoSector;
      });

      this.listManz$ = this._fichaIndividualService.listarManzanas(codSector).subscribe(result => {

        this.manzanas = result.data;
        
        if(sw) {
          this.form.patchValue({ manzana: parseInt(this.dataFirst.manzana) });
        }
        else{
          this.form.patchValue({ manzana: 0 });
        }
      });
    }

    guardar(){
      let info = this.form.value;

      // if(this.dataFirst === undefined){
      //   info.idFicha = 0
      // }
      // else{ 
      //   info.idFicha = this.dataFirst.idFicha; 
      // }

      this.distritos.forEach(dist => {
        if(dist.id == info.distrito) { 
          info.codigoUbigeo = dist.ubigeo; 
          info.codigoDistrito = dist.ubigeoDistrito;
          info.distrito = dist.id;
        }
      });

      this.sectores.forEach(sect => {
        if(sect.idSector == info.sector) info.codigoSector = sect.codigoSector;
      });

      this.manzanas.forEach(manz => {
        if(manz.idManzana == info.manzana) info.codigoManzana = manz.codigoManzana;
      });

      this.dialogRef.close(info);
    }


}
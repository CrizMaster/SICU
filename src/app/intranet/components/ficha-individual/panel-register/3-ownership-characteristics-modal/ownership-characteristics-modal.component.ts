import { Component, OnInit, Inject, ChangeDetectorRef  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FichaIndividualService } from '../../ficha-individual.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { OwnershipCharacteristics } from '../../models/OwnershipCharacteristics/ownership-characteristics.model';


@Component({
    selector: 'app-ownership-characteristics-modal',
    templateUrl: './ownership-characteristics-modal.component.html',
    styleUrls: ['./ownership-characteristics-modal.component.css']
})
export class OwnershipCharacteristicsModalComponent implements OnInit {

    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    listCatalogoMaster: CatalogoMaster[] = [];

    listCondTitular: ItemSelect<number>[] = [];
    listFormaAdquision: ItemSelect<number>[] = [];
    listTipoDocumento: ItemSelect<number>[] = [];
    listTipoPartidaRegistral: ItemSelect<number>[] = [];

    constructor(
      public dialogRef: MatDialogRef<OwnershipCharacteristicsModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _fichaIndividualService: FichaIndividualService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){

      this.form = this.fb.group({
        condiciontitular: [0, Validators.required],
        formaadquisicion: [0, Validators.required],
        tipodocumento: [0],
        tipopartidaregistral: [0],
        numero: ['']
      });

      this.listCatalogoMaster = _fichaIndividualService.getCatalogoMaster();

      this.listCondTitular = this.getList<number>(CatalogoMasterEnum.CondicionTitular);
      this.listFormaAdquision = this.getList<number>(CatalogoMasterEnum.FormaAdquisicion);
      this.listTipoDocumento = this.getList<number>(CatalogoMasterEnum.TipoDocumentoTitularidad);
      this.listTipoPartidaRegistral = this.getList<number>(CatalogoMasterEnum.TipoPartidaRegistral);
      
    }
    
    getList<T>(Grupo: string) : ItemSelect<T>[]{
      let list: ItemSelect<T>[] = [];

      this.listCatalogoMaster.forEach(item => {
          if(item.grupo == Grupo){
              list.push({
                  value: item.id,
                  text: item.nombre,
                  code: item.orden
              });
          };
      });

      list = list.sort((n1,n2) => {
          if (n1.text > n2.text) {
              return 1;
          }
          if (n1.text < n2.text) {
              return -1;
          }
          return 0;
      });

      list.unshift({ value: 0, text: 'Seleccionar'});

      return list;
  }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnInit(): void {
      if(this.data.IdCondicionTitular == undefined){
        console.log('Nuevo');
      }
      else{
        this.form.patchValue({ 
          condiciontitular: this.data.IdCondicionTitular, 
          formaadquisicion: this.data.IdFormaAdquision,
          tipodocumento: this.data.IdTipoDocumento,
          tipopartidaregistral: this.data.IdTipoPartidaRegistral,
          numero: this.data.NumeroPartidaRegistral
          });
      }
    }

    onChangeSelCondTitular(newValue: string){

      const tipopartida = this.form.get('tipopartidaregistral');
      const numero = this.form.get('numero');

      this.listCondTitular.forEach(item => {
        if(item.value == parseInt(newValue)){
          if(item.code == '01' //Propietario Unico
          || item.code == '02' //Sucesión Intestada
          || item.code == '04' //Sociedad Conyugal
          || item.code == '05' //Cotitularidad
          )
          {
            tipopartida.addValidators([Validators.required, Validators.pattern(this.pattern1Digs)]);
            numero.addValidators(Validators.required);              
          }
        }
        else{
          tipopartida.clearValidators();
          numero.clearValidators();          
        }

        tipopartida.updateValueAndValidity();
        numero.updateValueAndValidity();

        this.form.markAsUntouched();  

      });

    //     this.swSincodigo = event.checked;
    //     if(this.swSincodigo){
    //         this.form.get('tipoviasel').setValidators([Validators.required, Validators.pattern(this.pattern1Digs)]);
    //         this.form.get('tipovia').clearValidators();
    //     }
    //     else{
    //         this.form.get('tipovia').setValidators([Validators.required]);
    //         this.form.get('tipoviasel').clearValidators();
    //     }
    //     this.form.get('tipoviasel').updateValueAndValidity();
    //     this.form.get('tipovia').updateValueAndValidity();

    //     this.form.patchValue({ codigovia:0, tipoviasel: 0, nombrevia: '', tipovia: ''});
    //     this.form.markAsUntouched();      
    }

    guardar(){
      let info = this.form.value;
      let resp: OwnershipCharacteristics = {};

      this.listCondTitular.forEach(item => {
        if(item.value == info.condiciontitular){
          resp.IdCondicionTitular = item.value;
          resp.CodeCondicionTitular = item.code;
          resp.CondicionTitular = item.text;
        }
      });

      this.listFormaAdquision.forEach(item => {
        if(item.value == info.formaadquisicion){
          resp.IdFormaAdquision = item.value;
          resp.CodeFormaAdquision = item.code;
          resp.FormaAdquision = item.text;
        }
      });

      this.listTipoDocumento.forEach(item => {
        if(item.value == info.tipodocumento){
          resp.IdTipoDocumento = item.value;
          resp.CodeTipoDocumento = item.code;
          resp.TipoDocumento = item.text;
        }
      });

      this.listTipoPartidaRegistral.forEach(item => {
        if(item.value == info.tipopartidaregistral){
          resp.IdTipoPartidaRegistral = item.value;
          resp.CodeTipoPartidaRegistral = item.code;
          resp.TipoPartidaRegistral = item.text;
        }
      });

      resp.NumeroPartidaRegistral = info.numero;
      this.dialogRef.close(resp);
    }
}
import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef  } from '@angular/core';
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
export class OwnershipCharacteristicsModalComponent implements OnInit, OnDestroy {

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
        tipodocumento: [0, Validators.required],
        tipopartidaregistral: [0, Validators.required],
        numero: ['', Validators.required]
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

    ngOnDestroy(): void {
      // this.listDist$.unsubscribe();
      // this.listSect$.unsubscribe();
      // this.listManz$.unsubscribe();
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
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';

@Component({
  selector: 'app-vincular-unidad',
  templateUrl: './vincular-unidad.component.html',
  styleUrls: ['./vincular-unidad.component.css']
})
export class VincularUnidadComponent {

  pattern1Digs = '^[1-9]|([1-9][0-9])$';
  
  formVU: FormGroup;

  ApellidoPaterno:string = '';
  ApellidoMaterno:string = '';
  Nombres:string = '';

  listTipoDocIdent: ItemSelect<number>[] = [];

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef){
    this.formVU = this.fb.group({
      tipodocidentidad: [0, Validators.required],  
      nrodocidentidad: ['', [Validators.required, Validators.pattern('[0-9]+')]],                      
      nombres: ['', Validators.required],
      apellidopaterno: ['', Validators.required],
      apellidomaterno: ['']
    }); 

    this.listTipoDocIdent = getFilterMasterCatalog(CatalogoMasterEnum.TipoDocIdentidadTitular);
  }

  ngOnInit(): void {
    
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }
}

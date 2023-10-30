import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';

@Component({
  selector: 'app-titularidad',
  templateUrl: './titularidad.component.html',
  styleUrls: ['./titularidad.component.css']
})
export class TitularidadComponent {
  pattern1Digs = '^[1-9]|([1-9][0-9])$';
  
  formTitu: FormGroup;

  ApellidoPaterno:string = '';
  ApellidoMaterno:string = '';
  Nombres:string = '';

  listCondicionTitular: ItemSelect<number>[] = [];
  listFormaAdquisicion: ItemSelect<number>[] = [];
  listTipoDocIdent: ItemSelect<number>[] = [];
  listPartidaRegistral: ItemSelect<number>[] = [];

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef){
    this.formTitu = this.fb.group({
      condiciontitular: [0, Validators.required],  
      formaadquisicion: [0, Validators.required],  
      tipodocidentidad: [0, Validators.required],  
      partidaregistral: [0, Validators.required],
      nrodocidentidad: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      numeropartida: ['', [Validators.required]]
    }); 
  }
}

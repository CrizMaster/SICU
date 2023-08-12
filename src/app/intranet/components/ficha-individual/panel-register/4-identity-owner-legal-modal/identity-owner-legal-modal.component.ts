import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef, Input  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FichaIndividualService } from '../../ficha-individual.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { Owner } from '../../models/IdentityOwner/owner.model';
import { PersonLegal } from '../../models/IdentityOwner/personLegal.model';

@Component({
    selector: 'app-identity-owner-legal-modal',
    templateUrl: './identity-owner-legal-modal.component.html',
    styleUrls: ['./identity-owner-legal-modal.component.css']
})
export class IdentityOwnerLegalModalComponent implements OnInit, OnDestroy {

    pattern1Digs = '^[1-9]|([1-9][0-9])$';

    form: FormGroup;

    @Input() conConyuge: boolean = true;

    resp:Owner = { Empresa: { IdPersonaJuridica: 0, DocIdentidad: ['','','','','','','','','','',''] }};

    listCatalogoMaster: CatalogoMaster[] = [];
    listPersonaJuridica: ItemSelect<number>[] = [];

    constructor(
      public dialogRef: MatDialogRef<IdentityOwnerLegalModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: PersonLegal,
      private _fichaIndividualService: FichaIndividualService,
      private fb: FormBuilder,
      private changeDetector: ChangeDetectorRef
    ){
        this.form = this.fb.group({
            personajuridica: [0, Validators.required],
            ruc: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('[0-9]+')]],  
            telefonoanexo: [''],                      
            razonsocial: ['', Validators.required],
            email: ['', Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]
        });

        this.listCatalogoMaster = _fichaIndividualService.getCatalogoMaster();
        this.listPersonaJuridica = this.getList<number>(CatalogoMasterEnum.PersonaJuridica);
    }

    ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
    }

    ngOnInit(): void {
        console.log(this.data);
        if(this.data.IdPersonaJuridica == 0){
            console.log('nuevo');
        }
        else{
            this.form.patchValue({ 
                personajuridica: this.data.IdPersonaJuridica, 
                ruc: this.data.RUC,
                telefonoanexo: this.data.TelefonoAnexo,
                razonsocial: this.data.RazonSocial,
                email: this.data.Email
              });
        }
    }

    ngOnDestroy(): void {
    //   this.listProv$.unsubscribe();
    //   this.listDist$.unsubscribe();
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

    guardar(){
        let info = this.form.value;

        this.listPersonaJuridica.forEach(ec => {
          if(ec.value == info.personajuridica) {
            this.resp.Empresa.IdPersonaJuridica = ec.value;
            this.resp.Empresa.CodePersonaJuridica = ec.code;
            this.resp.Empresa.PersonaJuridica = ec.text;
          }
        });

        this.resp.Empresa.RUC = info.ruc;
        let ruc = info.ruc.split('');
        for (let i = 0; i < ruc.length; i++) {
            this.resp.Empresa.DocIdentidad[i] = ruc[i];
        }

        this.resp.Empresa.TelefonoAnexo = info.telefonoanexo;
        this.resp.Empresa.RazonSocial = info.razonsocial;
        this.resp.Empresa.Email = info.email;

        this.form.reset();
        this.dialogRef.close(this.resp);
    }

}
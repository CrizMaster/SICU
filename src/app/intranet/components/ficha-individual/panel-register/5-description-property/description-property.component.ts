import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { FichaIndividualService } from '../../ficha-individual.service';
import { OwnershipCharacteristics } from '../../models/OwnershipCharacteristics/ownership-characteristics.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { CatalogoMaster } from 'src/app/core/models/catalogo-master.model';
import { MatStepper } from '@angular/material/stepper';
import { DescriptionPredio } from '../../models/DescriptionProperty/descriptionProperty.model';
import { DescriptionPropertyModalComponent } from '../5-description-property-modal/description-property-modal.component';
import { Subscription } from 'rxjs';
import { DescriptionPropertyRequest } from '../../models/DescriptionProperty/description-property-request.model';
import { Title } from 'src/app/core/models/title.model';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { ModalLoadingComponent } from 'src/app/core/shared/components/modal-loading/modal-loading.component';
import { FichaCatastralIndividual } from '../../models/fichaCatastralIndividual.model';
  
@Component({
    selector: 'app-description-property',
    templateUrl: './description-property.component.html',
    styleUrls: ['./description-property.component.css']
})
export class DescriptionPropertyComponent implements OnInit, OnDestroy {

    // @Output() fifthComplete = new EventEmitter<boolean>();
    // @Input() idFicha:number = 0;
    @Input() Stepper: MatStepper;
    
    @Output() outputSeccion = new EventEmitter<DescriptionPropertyRequest>();

    @Input() inputSeccion: DescriptionPropertyRequest = { idObjeto: 0 };  

    //progress: boolean = false;
    form: FormGroup;
    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    ipv4: string = '';

    public saveDP$: Subscription = new Subscription;
    public editData$: Subscription = new Subscription;
    
    dataEdit: FichaCatastralIndividual;
    mDescPredio: DescriptionPredio = { IdClasificacionPredio: 0, CodeUso: ['','','','','',''] };
    titleBtn: string = 'Agregar';


    btnNextDisabled: boolean = true;
    dataFirst: OwnershipCharacteristics = {};
    
    listCatalogoMaster: CatalogoMaster[] = [];
    listTipoTitular: ItemSelect<number>[] = [];

    constructor(public dialog: MatDialog,
        private _fichaIndividualService: FichaIndividualService,
        private fb: FormBuilder,
        private changeDetector: ChangeDetectorRef) { 

        this.form = this.fb.group({
            tipotitular: [0, Validators.required]
        });

        this.listCatalogoMaster = _fichaIndividualService.getCatalogoMaster();
        this.listTipoTitular = this.getList<number>(CatalogoMasterEnum.TipoTitular);
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    ngOnInit(): void {        
        this.editData$ = this._fichaIndividualService.obsEditFichaCatastralIndividual.subscribe({
            next:(data) => {
                this.dataEdit = data;
            }
          });
    }

    ngOnDestroy(): void {
        this.saveDP$.unsubscribe();
        this.editData$.unsubscribe();
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

    AgregarModal(enterAnimationDuration: string, exitAnimationDuration: string):void {

        const dialogRef = this.dialog.open(DescriptionPropertyModalComponent, {
            width: '600px',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data: this.mDescPredio
        });
    
        dialogRef.afterClosed().subscribe((result:any) => {
          if(result !== ''){
            this.mDescPredio = result;
            this.mDescPredio.CodeUso = result.CodigoUso.split('');
            this.titleBtn = 'Modificar';
            // this.btnNextDisabled = false;

            // let request: DescriptionPropertyRequest = 
            // {   idObjeto: this.idFicha, 
            //     usuarioCreacion: 'carevalo',
            //     terminalCreacion: this.ipv4,
            //     c38ClasificacionPredio: this.mDescPredio.CodeClasificacionPredio,
            //     c39PredioEn: this.mDescPredio.CodePredioCatastralEn,
            //     c40CodigoUso: this.mDescPredio.CodigoUso,
            //     c41DescripcionUso: this.mDescPredio.DescripcionUso,
            //     c42AreaTerreno: String(this.mDescPredio.AreaTerrenoVerificada)
            // };
            this.inputSeccion.ClasificacionPredio = this.mDescPredio.ClasificacionPredio;
            this.inputSeccion.c38ClasificacionPredio = this.mDescPredio.CodeClasificacionPredio;
            this.inputSeccion.c39PredioEn = this.mDescPredio.CodePredioCatastralEn;
            this.inputSeccion.c40CodigoUso = this.mDescPredio.CodigoUso;
            this.inputSeccion.c41DescripcionUso = this.mDescPredio.DescripcionUso;
            this.inputSeccion.c42AreaTerreno = String(this.mDescPredio.AreaTerrenoVerificada);

            this.outputSeccion.emit(this.inputSeccion);
            //this.fifthComplete.emit(false);
          }            
        });
    }

    Agregar(){
        this.AgregarModal('300ms', '300ms');
    }

    // ModalMessage(): any {     
    //     let modal: Title = { 
    //       Title: 'Registrando la descripción del predio...'
    //     }
    //     let dgRef = this.dialog.open(ModalLoadingComponent, {
    //         width: '400px',
    //         height: '95px',
    //         enterAnimationDuration: '300ms',
    //         exitAnimationDuration: '300ms',
    //         disableClose: true,
    //         data: modal
    //     }); 
  
    //     return dgRef;
    // }

    // goNext(){
    //     //this.progress = true;
    //     let dg = this.ModalMessage();

    //     let request: DescriptionPropertyRequest = 
    //     {   idObjeto: this.idFicha, 
    //         usuarioCreacion: 'carevalo',
    //         terminalCreacion: this.ipv4,
    //         c38ClasificacionPredio: this.mDescPredio.CodeClasificacionPredio,
    //         c39PredioEn: this.mDescPredio.CodePredioCatastralEn,
    //         c40CodigoUso: this.mDescPredio.CodigoUso,
    //         c41DescripcionUso: this.mDescPredio.DescripcionUso,
    //         c42AreaTerreno: String(this.mDescPredio.AreaTerrenoVerificada)
    //     };

    //     this.fifthComplete.emit(true);

    //     this.saveDP$ = this._fichaIndividualService.save5DescripcionPredio(request)
    //     .subscribe(result => {
            
    //         dg.close();

    //         if(result.success){

    //             this.dataEdit.seccion5 = request;
    //             this._fichaIndividualService.obsEditFichaCatastralIndividual.next(this.dataEdit);

    //             this.fifthComplete.emit(true);                
    //             setTimeout(() => {
    //                 //this.progress = false;
    //                 this.btnNextDisabled = true;
    //                 this.Stepper.next();
    //               }, 500); 
    //         }
    //         else{
    //             //this.progress = false;
    //             let modal: Title = { 
    //                 Title: 'Opss...', 
    //                 Subtitle: result.message, 
    //                 Icon: 'error' }
    //               this.dialog.open(ModalMessageComponent, {
    //                   width: '500px',
    //                   enterAnimationDuration: '300ms',
    //                   exitAnimationDuration: '300ms',
    //                   disableClose: true,
    //                   data: modal
    //               });
    //             console.log(result.message);
    //         }
    //     });     
    // }

}
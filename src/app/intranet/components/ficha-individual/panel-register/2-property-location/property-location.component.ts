import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PropertyLocationModalComponent } from '../2-property-location-modal/property-location-modal.component';
import { UbicacionPredial } from '../../models/ubicacionPredial.model';
import { ModalQuestionComponent } from 'src/app/core/shared/components/modal-question/modal-question.component';
import { Title } from 'src/app/core/models/title.model';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { Via } from '../../models/via.model';
import { FichaIndividualService } from '../../ficha-individual.service';
import { Edificacion, Habilitacion, HabilitacionEdificacion } from '../../models/habilitacionEdificacion.model';
import { PropertyLocationHabiedifModalComponent } from '../2-property-location-habiedif-modal/property-location-habiedif-modal.component';
import { MatStepper } from '@angular/material/stepper';
import { UbicacionPredioDetalleModel, UbicacionPredioModel } from '../../models/saveFichaIndividual.model';
import { Subscription } from 'rxjs';
import { SharedData } from '../../models/sharedFirstData.model';
import Swal from 'sweetalert2';
  
@Component({
    selector: 'app-property-location',
    templateUrl: './property-location.component.html',
    styleUrls: ['./property-location.component.css']
})
export class PropertyLocationComponent implements OnInit, OnDestroy {

    @Output() secondComplete = new EventEmitter<boolean>();
    @Input() idFicha:number = 0;
    @Input() Stepper: MatStepper;
    @Input() listaVias: ItemSelect<Via>[] = [];
    @Input() listUbicacionPredial: UbicacionPredial[] = [];

    public saveUP$: Subscription = new Subscription;
    
    btnCompleteInfoDisabled: boolean = true;
    btnNextDisabled: boolean = true;
    dataFirst: UbicacionPredial;
    progress: boolean = false;
    ipv4: string = '';

    habilitacion: Habilitacion = { codigoHabilitacion: '', nombreHabilitacion: '', sectorZonaEtapa: '', manzanaUrbana: ''};
    edificacion: Edificacion = { codigoEspecifico: '', nombreEdificacion: '' };

    constructor(public dialog: MatDialog,
        private _fichaIndividualService: FichaIndividualService) { }

    ngOnInit(): void {
        this._fichaIndividualService.obsHabilitacionEdificacion.subscribe({
            next:(data) => {
                if(data.edificacion !== undefined ){
                    this.habilitacion = data.habilitacion;
                    this.edificacion = data.edificacion;
                }
            }
          })   
          
        // this._fichaIndividualService.getIpV4().then((result) => {
        //     this.ipv4 = result;    
        // });
    }

    ngOnDestroy(): void {
        this.saveUP$.unsubscribe();
    }

    UbicacionPredial(enterAnimationDuration: string, exitAnimationDuration: string):void {

        const dialogRef = this.dialog.open(PropertyLocationModalComponent, {
            width: '680px',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data: this.dataFirst
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if(result != ''){
            if(result.id == 0){
                if(this.listUbicacionPredial.length > 0){
                    const max = this.listUbicacionPredial.reduce(function(prev, current) {
                        return (prev.id > current.id) ? prev : current
                    })
                    result.id = max.id + 1;
                }
                else{ result.id = 1; }

                this.listUbicacionPredial.push(result);
            }
            else{
                let lista: UbicacionPredial[] = [];
                this.listUbicacionPredial.forEach(item => {
                    if(item.id == result.id){
                        lista.push(result);
                    }
                    else{
                        lista.push(item);
                    }
                });
                this.listUbicacionPredial = lista;
            }
            this.btnCompleteInfoDisabled = false;
            this.secondComplete.emit(false);
          }            
        });
    }

    Agregar(){
        this.dataFirst = { id:0, listaVias: this.listaVias };
        this.UbicacionPredial('300ms', '300ms');
    }

    Editar(up: UbicacionPredial){
        this.dataFirst = up;
        this.UbicacionPredial('300ms', '300ms');
    }

    Borrar(up:UbicacionPredial){
        let modal: Title = { Title: '¿Está seguro de borrar el registro?', Subtitle: '', Icon: '' }
        const dialogModal = this.dialog.open(ModalQuestionComponent, {
            width: '450px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal
        });

        dialogModal.afterClosed().subscribe(resp => {
            if(resp){
                let lista: UbicacionPredial[] = [];
                this.listUbicacionPredial.forEach(item => {
                    if(item.id !== up.id){
                        lista.push(item);
                    }
                });
                this.listUbicacionPredial = lista;

                if(this.listUbicacionPredial.length == 0) { 
                    this.btnNextDisabled = true;
                    this.btnCompleteInfoDisabled = false;
                    this.secondComplete.emit(false);
                }
            }            
          });
    }

    CompletarInfo(){
        const dialogRef = this.dialog.open(PropertyLocationHabiedifModalComponent, {
            width: '400px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: this.dataFirst
        });

        dialogRef.afterClosed().subscribe(resp => {
            if(resp){                
                this.habilitacion.lote = resp.Lote;
                this.habilitacion.sublote = resp.Sublote;

                this.edificacion.idTipoInterior = resp.IdTipoInterior;
                this.edificacion.codigoTipoInterior = resp.CodeTipoInterior;
                this.edificacion.numeroInterior = resp.NumeroInterior;

                if(this.listUbicacionPredial.length > 0) { 
                    this.btnNextDisabled = false;
                    this.secondComplete.emit(false);
                }
            }            
          });        
    }

    goNext(){
        this.progress = true;

        let detalle: UbicacionPredioDetalleModel[] = [];
        this.listUbicacionPredial.forEach(item => {
            detalle.push({ 
                idObjeto: this.idFicha,
                c05CodigoVia: item.CodeVia,
                c06TipoVia: item.CodeTipoVia,
                c07Nombrevia: item.NombreVia,
                c08TipoPuerta: item.CodeTipoPuerta,
                c09NroMunicipal: item.NroMunicipal,
                c10Numero: item.CondNumeracion
            });
        });

        let request: UbicacionPredioModel = 
        {   idObjeto: this.idFicha,
            terminalCreacion: this.ipv4,
            ubicacionPredioDetalle: detalle,
            c11TipoEdificacion: '',
            c12NombreEdifica: '',
            c13TipoInterior: this.edificacion.codigoTipoInterior,
            c14NroInterior: this.edificacion.numeroInterior,
            c15CodigoHu: '',
            c16NombreHu: '',
            c17ZonaSectorEtapa: '',
            c18Manzana: '',
            c19Lote: this.habilitacion.lote,
            c20SubLote: this.habilitacion.sublote
        };

        this.saveUP$ = this._fichaIndividualService.saveUbicacionPredial(request)
        .subscribe(result => {
            if(result.success){
                this.secondComplete.emit(true);

                setTimeout(() => {
                    this.progress = false;
                    this.btnNextDisabled = true;
                    this.Stepper.next();
                    
                  }, 500); 
            }
            else{
                this.progress = false;
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                      confirmButton: 'btn btn-primary bg-cofopri'
                    },
                    buttonsStyling: false
                  });
                  
                swalWithBootstrapButtons.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: result.message,
                    confirmButtonText: 'Cerrar'
                  });
                console.log(result.message);
            }
        });
    }    

}
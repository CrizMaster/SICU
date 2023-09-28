import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FichaCatastralIndividual } from '../../../ficha-individual/models/fichaCatastralIndividual.model';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { Via } from '../../../ficha-individual/models/via.model';
import { BuildingsRequest } from '../../../ficha-individual/models/Buildings/buildings-request.model';
import { AdditionalWorksRequest } from '../../../ficha-individual/models/AdditionalWorks/additions-works-request.model';
import { OrdenTrabajo } from '../../models/ordenTrabajo.model';
import { GenerarOrdenService } from '../generar-orden.service';
import { OrdenTrabajoFilter } from '../../models/ordenTrabajoFilter.model';
import { SelectionModel } from '@angular/cdk/collections';
import { RegisterOrdenModalComponent } from '../register-orden-modal/register-orden-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
  
@Component({
    selector: 'app-bandeja-orden',
    templateUrl: './bandeja-orden.component.html',
    styleUrls: ['./bandeja-orden.component.css'],
    animations: [
      trigger('detailExpand', [
        state('collapsed', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ]
})
export class BandejaOrdenComponent implements OnInit{

    filter: OrdenTrabajoFilter;
    fi:any=[];
    loading: boolean = true;
    disablebtnAsignar: boolean = true;
    //expandedElement: Boolean = false;
    // displayedColumns: string[] = ['IdFichaCatastral','numeroFicha', 'fichaLote', 'codigoUnicoCatastral', 'codigoRefenciaCatastral',
    // 'codigoContribuyenteRenta', 'codigoPredialRentas', 'condicionTitular', 'tipoTitular', 
    // 'apellidoPaterno', 'apellidoMaterno', 'nombres', 'estado'];
    displayedColumns: string[] = ['Dpto', 'Prov', 'Dist', 'Sec', 
    'Mz', 'TotalLotes', 'NroOrden', 'EstadoOrden', 'FechaAsignacion', 'PersonalAsignado','seleccion'];
    columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];

    expandedElement: OrdenTrabajo | null;

    dataSource = new MatTableDataSource<OrdenTrabajo>();
    selection = new SelectionModel<OrdenTrabajo>(true, []);
  
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    
    pageEvent?: PageEvent;
    page: number = 0;
    itemsByPage: number = 5;
    color:string = 'primary';
  
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  
    constructor(
      private _generarOrdenService: GenerarOrdenService,
      private route: Router,
      public dialog: MatDialog){
      this.filter = { Page:1, ItemsByPage: 5, Sector: '', Manzana: '', IdUbigeo: 0, Estado: 0}
    }

    ngOnInit(): void {  
  
      this._generarOrdenService.listarOrdenesTrabajoxDistrito(this.filter).subscribe({
        next:(Data) => {

          if(Data.success){
            Data.data.forEach(elem => {
              elem.codigoEstadoOrden = "";
              elem.seleccion = false;
              elem.expandir = false;
              if(elem.codigoManzana == '004') elem.codigoEstadoOrden = "01";
            });

            this.loading = false;
            let info = Data.data;
            info.length = Data.total;          

            this.dataSource = new MatTableDataSource<OrdenTrabajo>(info);
            this.dataSource.paginator = this.paginator;
          }
          else{
            this.dataSource = new MatTableDataSource<OrdenTrabajo>([]);
            this.dataSource.paginator = this.paginator;
          }
        }
      })
  
      this._generarOrdenService.DataTableOT.subscribe({
        next:(Data) => {
  
          if(Data.total > 0){
            this.loading = true;
  
            setTimeout(() => {
              this.paginator.pageIndex = 0;
              this.paginator.pageSize = 5;
    
              let fi: OrdenTrabajo[];

              Data.data.forEach(elem => {
                elem.codigoEstadoOrden = "";
                elem.seleccion = false;
                elem.expandir = false;
                if(elem.codigoManzana == '004') elem.codigoEstadoOrden = "01";
              });

              fi = Data.data;
              fi.length = Data.total;
              
              this.dataSource = new MatTableDataSource<OrdenTrabajo>(fi);
              this.dataSource.paginator = this.paginator;
    
              this.loading = false;
            }, 500);
          }
          // else{
          //   this.dataSource = new MatTableDataSource<OrdenTrabajo>([]);
          // }
        }
      })
  
    } 

    ExpandirContraer(elem: any){
      elem.expandir = !elem.expandir;
    }

    pageChanged(event: PageEvent){
      this.loading = true;
      let pageIndex = event.pageIndex;
      let pageSize = event.pageSize;
  
      let previousIndex = event.previousPageIndex;
      let previousSize = pageSize * pageIndex;
  
      this.filter.Page = pageIndex + 1;
      this.filter.ItemsByPage = pageSize;
  
      this._generarOrdenService.listarOrdenesTrabajoxDistrito(this.filter).subscribe({
        next:(Data) => {
            this.loading = false;
  
            Data.data.forEach(elem => {
              elem.codigoEstadoOrden = "";
              elem.seleccion = false;
              elem.expandir = false;
              if(elem.codigoManzana == '004') elem.codigoEstadoOrden = "01";
            });

            this.fi.length = previousSize;
            this.fi.push(...Data.data);
            this.fi.length = Data.total;
            
            this.selection.selected.forEach(sel => {
              this.fi.forEach(item => {
                if(item.id == sel.id) item.seleccion = true;
              });
            });

            this.dataSource = new MatTableDataSource<OrdenTrabajo>(this.fi);
            this.dataSource._updateChangeSubscription();
  
            this.dataSource.paginator = this.paginator;
        }
      })
    }

    // NuevoRegistro(){
    //   console.log(this.selection);
    //   console.log(this.selection.selected);

    // }

    changeCheckbox(val:any, elem: any){

      if(val.checked){
        let sw: boolean = false;
        this.selection.selected.forEach(el => {
          if(el.id == elem.id){
            sw = true;
          }
        });
        if(!sw) this.selection.select(elem);
      }
      else{
        this.selection.selected.forEach(el => {
          if(el.id == elem.id){
            this.selection.deselect(el);
          }
        });      
      }      

      this.disablebtnAsignar = this.selection.selected.length == 0;

      //console.log(this.selection.selected);
    }

    AsignarPersonalModal(enterAnimationDuration: string, exitAnimationDuration: string):void {

      const dialogPerJuridica = this.dialog.open(RegisterOrdenModalComponent, {
          width: '800px',
          enterAnimationDuration,
          exitAnimationDuration,
          disableClose: true,
          data: this.selection
      });
  
      dialogPerJuridica.afterClosed().subscribe((result:any) => {
        if(result !== ''){

        }            
      });
    }

    AsignarPersonal(){
      this.AsignarPersonalModal('300ms', '300ms');
    }

    EditarRegistro(element: any){
      
      let listaVias: ItemSelect<Via>[] = [
        { value:0, text:'seleccionar', data: { id: 0, codigoVia:'seleccionar', nombreVia: '', nombreEspecifico: '' }},
        { value:1, text:'000003', data: { id: 1, codigoVia:'000003', nombreVia: 'APURIMAC', nombreEspecifico: 'JR.' }}
      ];
  
      let building: BuildingsRequest[] = [];
      let additionalWorks: AdditionalWorksRequest[] = [];
  
      let edit: FichaCatastralIndividual = {
        idObjeto: element.idFichaCatastral,
        seccion1: {
          idObjeto: element.idFichaCatastral,
          codigoDepartamento: '15',
          codigoProvincia: '01',
          codigoDistrito: '17',
          sector: '01',
          manzana: '005',
          lote: '',
          edifica: '',
          entrada: '',
          piso: '',
          unidad: '',
          dc: 0,
          crc:'15011701005-------------'
        },
        seccion2: {
          idObjeto: element.idFichaCatastral,
          c11TipoEdificacion: '',
          c12NombreEdifica: '',
          c13TipoInterior: '',
          c14NroInterior: '',
          c15CodigoHabilitacion: '0003',
          c16NombreHabilitacion: 'PRO LIMA III ETAPA',
          c17SectorZonaEtapa: 'ZONA INDUSTRIAL',
          c18ManzanaUrbana: 'C',
          c19Lote: '',
          c20SubLote: '',
          listaVias: listaVias,
          ubicacionPredioDetalle: []
        },
        seccion3: {
          idObjeto: element.idFichaCatastral,
          c21CodigoCondicion: '',
          c22FormaAdquisicion: '',
          c23CodigoTipoDocumento: '',
          c24TipoPartida: '',
          c25Numero: ''
        },
        seccion4: {
          idObjeto: element.idFichaCatastral,
          c26TipoTitular: '',
          c27EstadoCivil: '',
          c28aTipoDocumento: '',
          c28bTipoDocumento: '',
          c29aNroDocumento: '',
          c29bNroDocumento: '',
          c30aNombres: '',
          c30bNombres: '',
          c31aApellidoPaterno: '',
          c31bApellidoPaterno: '',
          c32aApellidoMaterno: '',
          c32bApellidoMaterno: '',
          c33PersonaJuridica: '',
          c34Ruc: '',
          c35TelefonoAnexo: '',
          c36RazonSocial: '',
          c37CorreoElectronico: '',
          conConyuge: false,
          conTitular: false,
          conEmpresa: false
        },
        seccion5: {
          idObjeto: element.idFichaCatastral,
          c38ClasificacionPredio: '',
          c39PredioEn: '',
          c40CodigoUso: '',
          c41DescripcionUso: '',
          c42AreaTerreno: '',
          ClasificacionPredio: ''
        },
        seccion6:building,
        seccion7: additionalWorks
      };
  
      //this._asignacionCargaService.obsEditFichaCatastralIndividual.next(edit);
  
      this.route.navigateByUrl('intranet/registro');
    }
}
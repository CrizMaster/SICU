import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { FichaCatastral } from '../models/fichaCatastral.model';
import { FichaCatastralFilter } from '../models/fichaCatastralFilter.model'

import { FichaIndividualService } from '../ficha-individual.service';
import { Router } from '@angular/router';
import { FichaCatastralIndividual } from '../models/fichaCatastralIndividual.model';
import { Via } from '../models/via.model';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { BuildingsRequest } from '../models/Buildings/buildings-request.model';
import { AdditionalWorksRequest } from '../models/AdditionalWorks/additions-works-request.model';
  
@Component({
    selector: 'app-datatableFI',
    templateUrl: './datatableFI.component.html',
    styleUrls: ['./datatableFI.component.css']
})
export class DatatableFIComponent implements OnInit{

  filter: FichaCatastralFilter;
  fi:any=[];
  loading: boolean = true;

  // displayedColumns: string[] = ['IdFichaCatastral','numeroFicha', 'fichaLote', 'codigoUnicoCatastral', 'codigoRefenciaCatastral',
  // 'codigoContribuyenteRenta', 'codigoPredialRentas', 'condicionTitular', 'tipoTitular', 
  // 'apellidoPaterno', 'apellidoMaterno', 'nombres', 'estado'];
  displayedColumns: string[] = ['IdFichaCatastral','numeroFicha', 'codigoRefenciaCatastral',
  'condicionTitular', 'tipoTitular', 
  'apellidoPaterno', 'apellidoMaterno', 'nombres', 'estado','accion'];
  dataSource = new MatTableDataSource<FichaCatastral>();

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  
  pageEvent?: PageEvent;
  page: number = 0;
  itemsByPage: number = 5;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private _fichaIndividualService: FichaIndividualService,
    private route: Router){
    this.filter = { Page:1, ItemsByPage: 5, NroFicha: '', FichaLote: '', CUC: '', IdCondicion: 0, IdTipoTitular: 0 }
  }

  ngOnInit(): void {

    //let networkInterfaces = os.networkInterfaces();
    //console.log(os);

    this._fichaIndividualService.listarFichasCatastrales(this.filter).subscribe({
      next:(Data) => {
          this.loading = false;
          let datos = Data.data;
          datos.length = Data.total;

          this.dataSource = new MatTableDataSource<FichaCatastral>(datos);
          this.dataSource.paginator = this.paginator;
      }
    })

    this._fichaIndividualService.DataTableFI.subscribe({
      next:(menuData) => {

        if(menuData.total > 0){
          this.loading = true;

          setTimeout(() => {
            this.paginator.pageIndex = 0;
            this.paginator.pageSize = 5;
  
            let fi: FichaCatastral[];
            fi = menuData.data;
            fi.length = menuData.total;
            
            this.dataSource = new MatTableDataSource<FichaCatastral>(fi);
            this.dataSource.paginator = this.paginator;
  
            this.loading = false;
          }, 1000);
        }
        else{
          this.dataSource = new MatTableDataSource<FichaCatastral>([]);
        }
      }
    })

  } 

  pageChanged(event: PageEvent){
    this.loading = true;
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;

    let previousIndex = event.previousPageIndex;
    let previousSize = pageSize * pageIndex;

    this.filter.Page = pageIndex + 1;
    this.filter.ItemsByPage = pageSize;

    this._fichaIndividualService.listarFichasCatastrales(this.filter).subscribe({
      next:(Data) => {
          this.loading = false;

          this.fi.length = previousSize;
          this.fi.push(...Data.data);
          this.fi.length = Data.total;
          
          this.dataSource = new MatTableDataSource<FichaCatastral>(this.fi);
          this.dataSource._updateChangeSubscription();

          this.dataSource.paginator = this.paginator;
      }
    })
  }

  NuevoRegistro(){
    let edit: FichaCatastralIndividual = {
      idObjeto: 0
    };

    this._fichaIndividualService.obsEditFichaCatastralIndividual.next(edit);
    this.route.navigateByUrl('intranet/registro');
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

    this._fichaIndividualService.obsEditFichaCatastralIndividual.next(edit);

    this.route.navigateByUrl('intranet/registro');
  }
}
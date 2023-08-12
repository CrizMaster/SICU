import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { FichaCatastral } from '../models/fichaCatastral.model';
import { FichaCatastralFilter } from '../models/fichaCatastralFilter.model'

import { FichaIndividualService } from '../ficha-individual.service';
import { Router } from '@angular/router';
  
@Component({
    selector: 'app-datatableFI',
    templateUrl: './datatableFI.component.html',
    styleUrls: ['./datatableFI.component.css']
})
export class DatatableFIComponent implements OnInit{

  filter: FichaCatastralFilter;
  fi:any=[];
  loading: boolean = true;

  displayedColumns: string[] = ['IdFichaCatastral','numeroFicha', 'fichaLote', 'codigoUnicoCatastral', 'codigoRefenciaCatastral',
  'codigoContribuyenteRenta', 'codigoPredialRentas', 'condicionTitular', 'tipoTitular', 
  'apellidoPaterno', 'apellidoMaterno', 'nombres', 'estado'];
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
  
    this._fichaIndividualService.listarFichasCatastrales(this.filter).subscribe({
      next:(Data) => {
          //console.log(Data);
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
    this.route.navigateByUrl('intranet/registro');
  }
}
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { IntranetComponent } from "./intranet.component";
import { FichaIndividualComponent } from "./components/ficha-individual/ficha-individual.component";
import { FichaCotitularidadComponent } from "./components/ficha-cotitularidad/ficha-cotitularidad.component";
import { FichaBiencomunComponent } from "./components/ficha-biencomun/ficha-biencomun.component";
import { PanelRegisterComponent } from "./components/ficha-individual/panel-register/panel-register.component";
import { IntranetGuard } from "./guards/intranet.guard";
import { AccessDeniedComponent } from "../core/shared/components/access-denied/access-denied.component";
import { GenerarOrdenComponent } from "./components/asignacion-carga/generar-orden/generar-orden.component";
import { SectorResolver } from "./resolvers/sector.resolver";
import { SeguimientoComponent } from "./components/asignacion-carga/seguimiento-orden/seguimiento.component";
import { VerLoteComponent } from "./components/asignacion-carga/seguimiento-orden/ver-lote/ver-lote.component";
import { VerUnidadCatastralComponent } from "./components/asignacion-carga/seguimiento-orden/ver-unidad-catastral/ver-unidad-catastral.component";
import { OrdenTrabajoComponent } from "./components/formularios/orden-trabajo/orden-trabajo.component";
import { LoteOrdenComponent } from "./components/formularios/orden-trabajo/lote-orden/lote-orden.component";
import { RegisterOrdenModalComponent } from "./components/asignacion-carga/generar-orden/register-orden-modal/register-orden-modal.component";
import { RegistroLoteOrdenComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/registro-lote-orden.component";
import { InfoCaracterizacionResolver } from "./resolvers/infoCaracterizacion.resolver";
import { BandejaLUnidadCatastralComponent } from "./components/asignacion-carga/seguimiento-orden/ver-unidad-catastral/bandeja-unidad-catastral/bandeja-unidad-catastral.component";
import { VincularUnidadComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/vincular-unidad/vincular-unidad.component";
import { TitularidadComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/titularidad/titularidad.component";
import { UnidadComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/unidad/unidad.component";
import { ConstruccionesComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/construcciones/construcciones.component";
import { OtrasInstalacionesComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/otras-instalaciones/otras-instalaciones.component";
import { UbicacionBcComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/ubicacion/ubicacion-bc.component";
import { PredioBcComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/predio/predio-bc.component";
import { ConstruccionesBcComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/construcciones/construcciones-bc.component";
import { OtrasInstalacionesBcComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/otras-instalaciones/otras-instalaciones-bc.component";
import { RecapitulacionBcComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/recapitulacion/recapitulacion-bc.component";
import { RecapitulacionMatrizComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/recapitulacion-matriz/recapitulacion-matriz.component";

const routes: Routes = [
    { path: '', component: IntranetComponent,      
      children:
      [        
        { path: 'individual', 
          component: FichaIndividualComponent, 
          pathMatch:'full',
          canMatch: [IntranetGuard],
        },
        { path: 'cotitularidad', 
          component: FichaCotitularidadComponent,
          canMatch: [IntranetGuard]
        },
        { path: 'biencomun', 
          component: FichaBiencomunComponent,
          pathMatch:'full',
          canMatch: [IntranetGuard],          
        },
        { path: 'generarorden', 
          component: GenerarOrdenComponent,
          pathMatch:'full',
          canMatch: [IntranetGuard],
          resolve: {
            resolve: SectorResolver
          }
        },
        { path: 'registro', 
          component: PanelRegisterComponent
        },
        { path: 'seguimiento', 
          component: SeguimientoComponent,
          pathMatch:'full',
          canMatch: [IntranetGuard],
          resolve: {
            resolve: SectorResolver
          }
        },
        { path: 'verlote', 
          component: VerLoteComponent, 
          pathMatch:'full',
          canMatch: [IntranetGuard],
        },
        { path: 'verunidadcatastral', 
          component: VerUnidadCatastralComponent, 
          pathMatch:'full',
          canMatch: [IntranetGuard],
        },
        { path: 'ordentrabajo', 
          component: OrdenTrabajoComponent,
          pathMatch:'full',
          canMatch: [IntranetGuard],
          resolve: {
            resolve: SectorResolver
          }
        },
        { path: 'loteOrden', 
          component: LoteOrdenComponent, 
          pathMatch:'full',
          canMatch: [IntranetGuard],
        },
        { path: 'registroLoteOrden', 
          component: RegistroLoteOrdenComponent, 
          //pathMatch:'full',
          canMatch: [IntranetGuard],
          children:[
            { path: '', component: VincularUnidadComponent },
            { path: 'vincular', component: VincularUnidadComponent },
            { path: 'titularidad', component: TitularidadComponent },
            { path: 'unidad', component: UnidadComponent },
            { path: 'construcciones', component: ConstruccionesComponent },
            { path: 'otras-instalaciones', component: OtrasInstalacionesComponent },
            { path: 'ubicacion', component: UbicacionBcComponent },
            { path: 'predio', component: PredioBcComponent },
            { path: 'construcciones-bc', component: ConstruccionesBcComponent },
            { path: 'otras-instalaciones-bc', component: OtrasInstalacionesBcComponent },
            { path: 'recapitulacion-bc', component: RecapitulacionBcComponent },
            { path: 'recapitulacion-matriz', component: RecapitulacionMatrizComponent }
          ],
          resolve: {
            resolve: InfoCaracterizacionResolver
          }
/*
            case 1: this.route.navigate(['ubicacion'], { relativeTo: this._activatedRoute })
                    break;
            case 2: this.route.navigate(['predio'], { relativeTo: this._activatedRoute })
                    break;
            case 3: this.route.navigate(['construcciones-bc'], { relativeTo: this._activatedRoute })
                    break;
            case 4: this.route.navigate(['otras-instalaciones-bc'], { relativeTo: this._activatedRoute })
                    break;
            case 5: this.route.navigate(['recapitulacion-bc'], { relativeTo: this._activatedRoute })

*/



        }
      ] 
    }
];

@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule]
})

export class IntranetRoutingModule{}
//export const routingComponents = [RegistroLoteOrdenComponent, TitularidadComponent]
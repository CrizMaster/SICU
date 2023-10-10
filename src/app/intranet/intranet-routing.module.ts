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
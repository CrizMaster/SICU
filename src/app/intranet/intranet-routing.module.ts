import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { IntranetComponent } from "./intranet.component";
import { IntranetGuard } from "./guards/intranet.guard";
import { MenuResolver } from "./resolvers/menu.resolver";
import { PersonalUsuarioComponent } from "./components/configuraciones/personal-usuario/personal-usuario.component";
import { TipoCambioComponent } from "./components/configuraciones/tipo-cambio/tipo-cambio.component";
import { ProductoComponent } from "./components/mantenimiento/catalogo/producto/producto.component";
import { authGuard } from "../core/shared/guards/auth.guard";

const routes: Routes = [
    { path: '', 
      component: IntranetComponent,
      resolve: {
        datos: MenuResolver
      },
      children:
      [ {
          path: 'configuracion',
          children:[
          { path: 'personal', 
            component: PersonalUsuarioComponent, 
            pathMatch:'full',
            canMatch: [IntranetGuard],
          },
          { path: 'tipoCambio', 
            component: TipoCambioComponent, 
            pathMatch:'full',
            canMatch: [IntranetGuard],
          }]
        },
        {
          path: 'mantenimiento',
          children:[
          { path: 'catalogoProductos', 
            component: ProductoComponent, 
            pathMatch:'full',
            canMatch: [IntranetGuard],
          }]
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
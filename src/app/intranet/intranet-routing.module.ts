import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { IntranetComponent } from "./intranet.component";
import { FichaIndividualComponent } from "./components/ficha-individual/ficha-individual.component";
import { FichaCotitularidadComponent } from "./components/ficha-cotitularidad/ficha-cotitularidad.component";
import { FichaBiencomunComponent } from "./components/ficha-biencomun/ficha-biencomun.component";
import { PanelRegisterComponent } from "./components/ficha-individual/panel-register/panel-register.component";

const routes: Routes = [
    { path: '', component: IntranetComponent, 
    children:
      [        
        { path: 'individual', component: FichaIndividualComponent, pathMatch:'full'},
        { path: 'cotitularidad', component: FichaCotitularidadComponent},
        { path: 'biencomun', component: FichaBiencomunComponent},
        { path: 'registro', component: PanelRegisterComponent}
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
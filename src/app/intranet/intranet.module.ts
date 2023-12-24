import { NgModule } from "@angular/core";
import { SharedModule } from "../core/shared/shared.module";
import { IntranetRoutingModule } from "./intranet-routing.module"
import { IntranetService } from "./intranet.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IntranetComponent } from "./intranet.component";
import { UserComponent } from "./components/user/user.component";
import { MenuComponent } from "./components/menu/menu.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "../core/shared/interceptors/auth.interceptor";
import { PersonalUsuarioComponent } from "./components/configuraciones/personal-usuario/personal-usuario.component";
import { ConfiguracionService } from "./components/configuraciones/configuracion.service";
import { PersonaModalComponent } from "./components/configuraciones/personal-usuario/persona-modal/persona-modal.component";
import { UsuarioModalComponent } from "./components/configuraciones/personal-usuario/usuario-modal/usuario-modal.component";
import { TipoCambioComponent } from "./components/configuraciones/tipo-cambio/tipo-cambio.component";
import { TipoCambioModalComponent } from "./components/configuraciones/tipo-cambio/tipo-cambio-modal/tipo-cambio-modal.component";
import { ProductoComponent } from "./components/mantenimiento/catalogo/producto/producto.component";
import { MantenimientoService } from "./components/mantenimiento/mantenimiento.service";
import { ProductoModalComponent } from "./components/mantenimiento/catalogo/producto/producto-modal/producto-modal.component";

@NgModule({
    imports: [
        FormsModule,
        IntranetRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    declarations: [
        IntranetComponent,
        UserComponent,
        MenuComponent,

        PersonalUsuarioComponent,
        PersonaModalComponent,
        UsuarioModalComponent,
        TipoCambioComponent,
        TipoCambioModalComponent,
        ProductoComponent,
        ProductoModalComponent
    ],
    exports: [],
    providers: [
        { provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true 
        },
        IntranetService,
        ConfiguracionService,
        MantenimientoService
    ]
})

export class IntranetModule {
    
    constructor(){}
}

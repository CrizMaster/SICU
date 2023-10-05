import { NgModule } from "@angular/core";
import { SharedModule } from "../core/shared/shared.module";
import { IntranetRoutingModule } from "./intranet-routing.module"
import { IntranetService } from "./intranet.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { PanelFilterComponent } from "./components/ficha-individual/panel-filter/panel-filter.component";
import { IntranetComponent } from "./intranet.component";
import { UserComponent } from "./components/user/user.component";
import { MenuComponent } from "./components/menu/menu.component";
import { FichaIndividualComponent } from "./components/ficha-individual/ficha-individual.component";
import { FichaCotitularidadComponent } from "./components/ficha-cotitularidad/ficha-cotitularidad.component";
import { FichaBiencomunComponent } from "./components/ficha-biencomun/ficha-biencomun.component";
import { DatatableFIComponent } from "./components/ficha-individual/datatableFI/datatableFI.component";
import { FichaIndividualService } from "./components/ficha-individual/ficha-individual.service";
import { PanelRegisterComponent } from "./components/ficha-individual/panel-register/panel-register.component";
import { CodeReferenceModalComponent } from "./components/ficha-individual/panel-register/1-code-reference-modal/code-reference-modal.component";
import { CodeReferenceComponent } from "./components/ficha-individual/panel-register/1-code-reference/code-reference.component";
import { PropertyLocationComponent } from "./components/ficha-individual/panel-register/2-property-location/property-location.component";
import { PropertyLocationModalComponent } from "./components/ficha-individual/panel-register/2-property-location-modal/property-location-modal.component";
import { PropertyLocationHabiedifModalComponent } from "./components/ficha-individual/panel-register/2-property-location-habiedif-modal/property-location-habiedif-modal.component";
import { OwnershipCharacteristicsComponent } from "./components/ficha-individual/panel-register/3-ownership-characteristics/ownership-characteristics.component";
import { OwnershipCharacteristicsModalComponent } from "./components/ficha-individual/panel-register/3-ownership-characteristics-modal/ownership-characteristics-modal.component";
import { IdentityOwnerComponent } from "./components/ficha-individual/panel-register/4-identity-owner/identity-owner.component";
import { IdentityOwnerNaturalModalComponent } from "./components/ficha-individual/panel-register/4-identity-owner-natural-modal/identity-owner-natural-modal.component";
import { IdentityOwnerLegalModalComponent } from "./components/ficha-individual/panel-register/4-identity-owner-legal-modal/identity-owner-legal-modal.component";
import { DescriptionPropertyComponent } from "./components/ficha-individual/panel-register/5-description-property/description-property.component";
import { DescriptionPropertyModalComponent } from "./components/ficha-individual/panel-register/5-description-property-modal/description-property-modal.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "../core/shared/interceptors/auth.interceptor";
import { BuildingsComponent } from "./components/ficha-individual/panel-register/6-buildings/buildings.component";
import { BuildingsModalComponent } from "./components/ficha-individual/panel-register/6-buildings-modal/buildings-modal.component";
import { AdditionalWorkComponent } from "./components/ficha-individual/panel-register/7-additional-works/additional-works.component";
import { AdditionalWorksModalComponent } from "./components/ficha-individual/panel-register/7-additional-works-modal/additional-works-modal.component";
import { SummaryModalComponent } from "./components/ficha-individual/panel-register/8-summary-modal/summary-modal.component";
import { AsignacionCargaService } from "./components/asignacion-carga/asignacion-carga.service";
import { GenerarOrdenService } from "./components/asignacion-carga/generar-orden/generar-orden.service";
import { GenerarOrdenComponent } from "./components/asignacion-carga/generar-orden/generar-orden.component";
import { PanelFilterOrdenComponent } from "./components/asignacion-carga/generar-orden/panel-filter/panel-filter-orden.component";
import { BandejaOrdenComponent } from "./components/asignacion-carga/generar-orden/bandeja/bandeja-orden.component";
import { RegisterOrdenModalComponent } from "./components/asignacion-carga/generar-orden/register-orden-modal/register-orden-modal.component";
import { SeguimientoService } from "./components/asignacion-carga/seguimiento-orden/seguimiento.service";
import { SeguimientoComponent } from "./components/asignacion-carga/seguimiento-orden/seguimiento.component";
import { BandejaSeguimientoComponent } from "./components/asignacion-carga/seguimiento-orden/bandeja/bandeja-seguimiento.component";
import { PanelFilterSeguimientoComponent } from "./components/asignacion-carga/seguimiento-orden/panel-filter/panel-filter-seguimiento.component";
import { VerOrdenComponent } from "./components/asignacion-carga/seguimiento-orden/ver-orden/ver-orden.component";
import { InfoOrdenComponent } from "./components/asignacion-carga/seguimiento-orden/ver-orden/info-orden/info-orden.component";
import { BandejaLoteComponent } from "./components/asignacion-carga/seguimiento-orden/ver-orden/bandeja-lote/bandeja-lote.component";

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
        FichaIndividualComponent,
        FichaCotitularidadComponent,
        FichaBiencomunComponent,
        DatatableFIComponent,
        PanelFilterComponent,
        PanelRegisterComponent,
        CodeReferenceModalComponent,
        CodeReferenceComponent,
        PropertyLocationComponent,
        PropertyLocationModalComponent,
        PropertyLocationHabiedifModalComponent,
        OwnershipCharacteristicsComponent,
        OwnershipCharacteristicsModalComponent,
        IdentityOwnerComponent,
        IdentityOwnerNaturalModalComponent,
        IdentityOwnerLegalModalComponent,
        DescriptionPropertyComponent,
        DescriptionPropertyModalComponent,
        BuildingsComponent,
        BuildingsModalComponent,
        AdditionalWorkComponent,
        AdditionalWorksModalComponent,
        SummaryModalComponent,

        GenerarOrdenComponent,
        PanelFilterOrdenComponent,
        BandejaOrdenComponent,
        RegisterOrdenModalComponent,
        SeguimientoComponent,
        BandejaSeguimientoComponent,
        PanelFilterSeguimientoComponent,
        VerOrdenComponent,
        InfoOrdenComponent,
        BandejaLoteComponent
    ],
    exports: [],
    providers: [
        { provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true 
        },
        IntranetService,
        FichaIndividualService,
        AsignacionCargaService,
        GenerarOrdenService,
        SeguimientoService
    ]
})

export class IntranetModule {
    
    constructor(){}
}

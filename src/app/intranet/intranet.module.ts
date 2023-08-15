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
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "../core/shared/interceptors/auth.interceptor";


@NgModule({
    imports: [
        FormsModule,
        IntranetRoutingModule,
        SharedModule,
        ReactiveFormsModule
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
        DescriptionPropertyModalComponent
    ],
    exports: [],
    providers: [
        { provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true 
        },
        IntranetService,
        FichaIndividualService
    ]
})

export class IntranetModule {
    
    constructor(){}
}

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

import { BandejaOrdenComponent } from "./components/asignacion-carga/generar-orden/bandeja/bandeja-orden.component";
import { RegisterOrdenModalComponent } from "./components/asignacion-carga/generar-orden/register-orden-modal/register-orden-modal.component";
import { SeguimientoService } from "./components/asignacion-carga/seguimiento-orden/seguimiento.service";
import { SeguimientoComponent } from "./components/asignacion-carga/seguimiento-orden/seguimiento.component";
import { BandejaSeguimientoComponent } from "./components/asignacion-carga/seguimiento-orden/bandeja/bandeja-seguimiento.component";
import { PanelFilterOrdenComponent } from "./components/asignacion-carga/panel-filter-orden/panel-filter-orden.component";
import { VerUnidadCatastralComponent } from "./components/asignacion-carga/seguimiento-orden/ver-unidad-catastral/ver-unidad-catastral.component";
import { InfoOrdenComponent } from "./components/asignacion-carga/seguimiento-orden/info-orden/info-orden.component";
import { BandejaLoteComponent } from "./components/asignacion-carga/seguimiento-orden/ver-lote/bandeja-lote/bandeja-lote.component";
import { VerLoteComponent } from "./components/asignacion-carga/seguimiento-orden/ver-lote/ver-lote.component";
import { BandejaLUnidadCatastralComponent } from "./components/asignacion-carga/seguimiento-orden/ver-unidad-catastral/bandeja-unidad-catastral/bandeja-unidad-catastral.component";
import { OrdenTrabajoComponent } from "./components/formularios/orden-trabajo/orden-trabajo.component";
import { OrdenTrabajoService } from "./components/formularios/orden-trabajo/orden-trabajo.service";
import { BandejaOrdenTrabajoComponent } from "./components/formularios/orden-trabajo/bandeja/bandeja-orden-trabajo.component";
import { LoteOrdenComponent } from "./components/formularios/orden-trabajo/lote-orden/lote-orden.component";
import { BandejaLoteOrdenComponent } from "./components/formularios/orden-trabajo/lote-orden/bandeja-lote-orden/bandeja-lote-orden.component";
import { RegistroLoteOrdenComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/registro-lote-orden.component";
import { FormularioRegistroLoteComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/formulario-registro-lote.component";
import { InformacionLoteComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/informacion-lote/informacion-lote.component";
import { EdificacionesComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/edificaciones/edificaciones.component";
import { EditarEdificacionModalComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/edificaciones/editar-edificacion-modal/editar-edificacion-modal.component";
import { UnidadAdministrativaComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/unidad-administrativa.component";
import { EditarUnidadAdministrativaModalComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/editar-unidad-administrativa-modal/editar-unidad-administrativa-modal.component";
import { BandejaUnidadAdministrativaComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/bandeja-unidad-administrativa/bandeja-unidad-administrativa.component";
import { VincularComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/vincular.component";
import { UnidadAdministrativaService } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/unidad-administrativa.service";
import { VincularUnidadComponent } from './components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/vincular-unidad/vincular-unidad.component';
import { TitularidadComponent } from './components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/titularidad/titularidad.component';
import { UnidadComponent } from './components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/unidad/unidad.component';
import { ConstruccionesComponent } from './components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/construcciones/construcciones.component';
import { OtrasInstalacionesComponent } from './components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/otras-instalaciones/otras-instalaciones.component';
import { PersonaModalComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/persona-modal/persona-modal.component";
import { ConstruccionModalComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/construccion-modal/construccion-modal.component";
import { OtraInstalacionModalComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/unidad-administrativa/vincular/otra-instalacion-modal/otra-instalacion-modal.component";
import { BienesComunesComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/bienes-comunes.component";
import { BienesComunesService } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/bienes-comunes.service";
import { BandejaBienesComunesComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/bandeja-bienes-comunes/bandeja-bienes-comunes.component";
import { ActualizarBcComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/actualizar-bc.component";
import { UbicacionBcComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/ubicacion/ubicacion-bc.component";
import { PredioBcComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/predio/predio-bc.component";
import { ConstruccionesBcComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/construcciones/construcciones-bc.component";
import { OtrasInstalacionesBcComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/otras-instalaciones/otras-instalaciones-bc.component";
import { ConstruccionBcModalComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/construccion-modal/construccion-bc-modal.component";
import { OtraInstalacionBcModalComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/otra-instalacion-modal/otra-instalacion-bc-modal.component";
import { RecapitulacionBcComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/recapitulacion/recapitulacion-bc.component";
import { RecapitulacionMatrizComponent } from "./components/formularios/orden-trabajo/lote-orden/registro-lote-orden/formulario-registro-lote/bienes-comunes/actualizar/recapitulacion-matriz/recapitulacion-matriz.component";

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
        BandejaOrdenComponent,
        RegisterOrdenModalComponent,
        SeguimientoComponent,
        BandejaSeguimientoComponent,
        PanelFilterOrdenComponent,
        InfoOrdenComponent,
        BandejaLoteComponent,
        VerLoteComponent,
        VerUnidadCatastralComponent,
        BandejaLUnidadCatastralComponent,
        OrdenTrabajoComponent,
        BandejaOrdenTrabajoComponent,
        LoteOrdenComponent,
        BandejaLoteOrdenComponent,
        RegistroLoteOrdenComponent,
        FormularioRegistroLoteComponent,
        InformacionLoteComponent,
        EdificacionesComponent,
        EditarEdificacionModalComponent,
        UnidadAdministrativaComponent,
        EditarUnidadAdministrativaModalComponent,
        BandejaUnidadAdministrativaComponent,
        VincularComponent,
        VincularUnidadComponent,
        TitularidadComponent,
        UnidadComponent,
        ConstruccionesComponent,
        OtrasInstalacionesComponent,
        PersonaModalComponent,
        ConstruccionModalComponent,
        OtraInstalacionModalComponent,
        BienesComunesComponent,
        BandejaBienesComunesComponent,
        ActualizarBcComponent,
        UbicacionBcComponent,
        PredioBcComponent,
        ConstruccionesBcComponent,
        ConstruccionBcModalComponent,
        OtrasInstalacionesBcComponent,
        OtraInstalacionBcModalComponent,
        RecapitulacionBcComponent,
        RecapitulacionMatrizComponent
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
        SeguimientoService,
        OrdenTrabajoService,
        UnidadAdministrativaService,
        BienesComunesService
    ]
})

export class IntranetModule {
    
    constructor(){}
}

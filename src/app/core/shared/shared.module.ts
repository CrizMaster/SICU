import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { IConfig, NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask'
import { ReactiveFormsModule } from '@angular/forms'

import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatBadgeModule} from '@angular/material/badge';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarModule,
    MatSnackBarVerticalPosition,
  } from '@angular/material/snack-bar';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';

import localeEsPE from '@angular/common/locales/es-PE';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionServiceModule } from 'ngx-connection-service';

import { NotFoundComponent } from "./components/not-found/not-found.component";
import { TitleComponent } from "./components/title/title.component";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { DisableControlDirective } from "./directive/disable-control.directive";
import { ModalQuestionComponent } from "./components/modal-question/modal-question.component";
import { NetworkStatusComponent } from "./components/network-status/network-status.component";
import { TemplateSnackbarComponent } from "./components/network-status/template-snackbar/template-snackbar.component";
import { AccessDeniedComponent } from "./components/access-denied/access-denied.component";
import { ModalMessageComponent } from "./components/modal-message/modal-message.component";
import { ModalLoadingComponent } from "./components/modal-loading/modal-loading.component";

const maskConfig: Partial<IConfig> = {
    validation: false,
  };

@NgModule({
    imports: [
        HttpClientModule,
        RouterModule,
        CommonModule,
        MatTabsModule,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        MatButtonModule,
        MatInputModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSidenavModule,
        MatExpansionModule,
        MatListModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatPaginatorModule,
        MatStepperModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatBadgeModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatCheckboxModule,

        NgbModule,
        NgxMaskDirective, 
        NgxMaskPipe,
        ReactiveFormsModule,
        ConnectionServiceModule
    ],
    declarations: [
        NotFoundComponent,
        TitleComponent,
        BreadcrumbComponent,
        ModalQuestionComponent,
        ModalMessageComponent,
        NetworkStatusComponent,
        TemplateSnackbarComponent,
        DisableControlDirective,
        AccessDeniedComponent,
        ModalLoadingComponent
    ],
    exports: [
        HttpClientModule,
        RouterModule,
        CommonModule,

        NotFoundComponent,
        TitleComponent,
        BreadcrumbComponent,
        ModalQuestionComponent,
        ModalMessageComponent,
        NetworkStatusComponent,
        DisableControlDirective,
        AccessDeniedComponent,
        ModalLoadingComponent,

        MatTabsModule,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        MatButtonModule,
        MatInputModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSidenavModule,
        MatExpansionModule,
        MatListModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatPaginatorModule,
        MatStepperModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatBadgeModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatCheckboxModule,

        NgbModule,
        NgxMaskDirective, 
        NgxMaskPipe,
        ReactiveFormsModule,
        ConnectionServiceModule
    ],
    providers: [
        provideEnvironmentNgxMask(maskConfig),
        //GeneralService
        //AuthService
    ]
})

export class SharedModule {
    constructor(){}
}

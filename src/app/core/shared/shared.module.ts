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

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NotFoundComponent } from "./components/not-found/not-found.component";
import { TitleComponent } from "./components/title/title.component";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { DisableControlDirective } from "./directive/disable-control.directive";
import { ModalQuestionComponent } from "./components/modal-question/modal-question.component";
import { NetworkStatusComponent } from "./components/network-status/network-status.component";

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
        NgbModule,
        NgxMaskDirective, 
        NgxMaskPipe,
        ReactiveFormsModule        
    ],
    declarations: [
        NotFoundComponent,
        TitleComponent,
        BreadcrumbComponent,
        ModalQuestionComponent,
        NetworkStatusComponent,
        DisableControlDirective
    ],
    exports: [
        HttpClientModule,
        RouterModule,
        CommonModule,

        NotFoundComponent,
        TitleComponent,
        BreadcrumbComponent,
        ModalQuestionComponent,
        NetworkStatusComponent,
        DisableControlDirective,

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

        NgbModule,
        NgxMaskDirective, 
        NgxMaskPipe,
        ReactiveFormsModule
    ],
    providers: [
        provideEnvironmentNgxMask(maskConfig)
    ]
})

export class SharedModule {
    constructor(){}
}

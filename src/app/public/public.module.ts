import { NgModule } from "@angular/core";
import { SharedModule } from "../core/shared/shared.module";
import { PublicRoutingModule } from "./public-routing.module"
import { ReactiveFormsModule } from "@angular/forms";

import { PublicComponent } from "./public.component";
import { LoginComponent } from "./login/login.component";
import { PublicService } from "./public.service";


import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from 'ng-recaptcha';

@NgModule({
    imports: [
        PublicRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        RecaptchaV3Module
    ],
    declarations: [
        PublicComponent,
        LoginComponent
    ],
    exports: [],
    providers: [
        PublicService,
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: "6Lf9BE4nAAAAAIDxDESVz3wPsQRKPH95qc5IByB4",
        }
    ]
})

export class PublicModule {
    constructor(){}
}

import { NgModule } from "@angular/core";
import { SharedModule } from "../core/shared/shared.module";
import { PublicRoutingModule } from "./public-routing.module"

import { PublicComponent } from "./public.component";
import { HomeComponent } from "./home/containers/home.component";
import { LoginComponent } from "./login/login.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";

import { PublicService } from "./public.service";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ReactiveFormsModule } from "@angular/forms";

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
        HomeComponent,
        LoginComponent,
        HeaderComponent,
        FooterComponent,
        NavbarComponent
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

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

//import { PublicComponent } from "./public.component";
//import { HomeComponent } from "./home/containers/home.component";
//import { LoginComponent } from "./login/containers/login.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
    { path: '', component: LoginComponent
    },
    {
      path: 'login', component: LoginComponent
    }
];

@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule]
})

export class PublicRoutingModule{}
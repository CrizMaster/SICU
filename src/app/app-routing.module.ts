import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/shared/components/not-found/not-found.component';
import { authGuard } from './core/shared/guards/auth.guard';
import { AccessDeniedComponent } from './core/shared/components/access-denied/access-denied.component';

const routes: Routes = [
  { path:'', loadChildren:() => import('./public/public.module').then(m => m.PublicModule) },
  { 
    path:'intranet', 
    canMatch: [authGuard],
    loadChildren:() => import('./intranet/intranet.module').then(m => m.IntranetModule)
  },
  {
    path: 'access-denied', component: AccessDeniedComponent, 
  },  
  { path:'**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

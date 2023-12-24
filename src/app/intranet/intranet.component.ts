import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../core/shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalMessageComponent } from '../core/shared/components/modal-message/modal-message.component';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '../core/models/title.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-public',
    templateUrl: './intranet.component.html',
    styleUrls: ['./intranet.component.css']
})
export class IntranetComponent implements OnInit, OnDestroy  {

  public isLoggerIn$: Subscription = new Subscription;
  public isOffLine$: Subscription = new Subscription;
  
  
    constructor(private _authService: AuthService,
      private route: Router,
      private actRoute: ActivatedRoute,
      public dialog: MatDialog
      ){}

    mode: string = 'side';
    hasBackdrop: boolean = true;
    userLoginOn: boolean = false;
    offline: boolean = false;

    ngOnInit(): void {
      const elemt = document.querySelectorAll('.mat-drawer-inner-container');
      elemt[0].className = "mat-drawer-content-notscrollx";

      this.isLoggerIn$ = this._authService.isLoggedIn.subscribe({
        next:(sw) => {
          if(!sw) this.SesionTerminada();
        }
      });

      this.isOffLine$ = this._authService.isOffLine.subscribe({
        next:(sw) => {
          this.offline = sw;
        }
      });

      this.actRoute.data.subscribe(resp => {
        if(!resp.datos.Success) {
            let modal: Title = { 
              Title: 'Opss...', 
              Subtitle: 'No se pudo recuperar la información necesaria para continuar con el sistema, inicie una nueva sesión. Si el inconveniente presiste, contacte con el administrador del sistema.',
              Icon: 'error' 
            };
            let win = this.dialog.open(ModalMessageComponent, {
                width: '500px',
                enterAnimationDuration: '300ms',
                exitAnimationDuration: '300ms',
                disableClose: true,
                data: modal
            });

            win.afterClosed().subscribe(result => {
                this.CerrarSesion();          
            });
        }
      });      

    }

    ngOnDestroy(): void {
      this.isLoggerIn$.unsubscribe();
      this.isOffLine$.unsubscribe();
    }

    SesionTerminada(){
      let modal: Title = { 
        Title: 'Sesión Finalizada', 
        Subtitle: 'Su sesión a finalizado. Inicie nuevamente sesión para continuar utilizando el sistema.',
        Icon: 'error' 
      };
      let win = this.dialog.open(ModalMessageComponent, {
          width: '500px',
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          disableClose: true,
          data: modal
      });

      win.afterClosed().subscribe(result => {
        this.route.navigateByUrl('/login');
      });      
    } 

    CerrarSesion(){
      this.route.navigateByUrl('/login');
    }    

}
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalMessageComponent } from '../core/shared/components/modal-message/modal-message.component';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '../core/models/title.model';

@Component({
    selector: 'app-public',
    templateUrl: './intranet.component.html',
    styleUrls: ['./intranet.component.css']
})
export class IntranetComponent implements OnInit{

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

      this._authService.isOffLine.subscribe({
        next:(sw) => {
          this.offline = sw;
        }
      });

      this.actRoute.data.subscribe(resp => {
        console.log('resp');
        console.log(resp);

        if(!resp.datos.success) {
            //console.log('Cerrando sesión. No se puede obtener el catalogo maestro.');
            let modal: Title = { 
              Title: 'Opss...', 
              Subtitle: 'No se puedo recuperar la información necesaria para continuar con el sistema, verifique su conexión a internet o contacte con el administrador del sistema.',
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

    CerrarSesion(){
      this._authService.isLoggedIn.next(false);
      this.route.navigateByUrl('/login');
    }    

}
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
    }

    CerrarSesion(){
      this._authService.isLoggedIn.next(false);
      this.route.navigateByUrl('/login');
    }    

}
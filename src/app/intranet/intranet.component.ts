import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/shared/services/auth.service';
import { Router } from '@angular/router';

// interface SelectValue {
//   value: string;
//   viewValue: string;
// }

// export interface Section {
//     name: string;
//     icon: string;
//   }

@Component({
    selector: 'app-public',
    templateUrl: './intranet.component.html',
    styleUrls: ['./intranet.component.css']
})
export class IntranetComponent implements OnInit{

    constructor(private _authService: AuthService,
      private route: Router,
      ){}

    mode: string = 'side';
    hasBackdrop: boolean = true;
    userLoginOn: boolean = false;

    ngOnInit(): void {
      const elemt = document.querySelectorAll('.mat-drawer-inner-container');
      elemt[0].className = "mat-drawer-content-notscrollx";
    }

    CerrarSesion(){
      this._authService.isLoggedIn.next(false);
      this.route.navigateByUrl('');
    }    

}
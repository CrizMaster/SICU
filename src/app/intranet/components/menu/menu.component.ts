import { Component, OnInit } from '@angular/core';
import { IntranetService } from '../../intranet.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/shared/services/auth.service';
import { LocalService } from 'src/app/core/shared/services/local.service';
  
@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{

    menus : any[] = [];

    customCollapsedHeight: string = '34px';
    customExpandedHeight: string = '34px';

    constructor(private _intranetService: IntranetService,
      private _authService: AuthService,
      private _localService: LocalService,
      private route: Router){}

    ngOnInit(): void {

      let menu = this._localService.getData("eylmenu");
      if(menu.length > 0){
        let currentMenu = JSON.parse(menu);      
        this.menus = currentMenu;        
      }
    }
    
    ir(path: string){
      this.route.navigateByUrl(path);
    }

}
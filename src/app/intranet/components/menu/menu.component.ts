import { Component, OnInit } from '@angular/core';
import { IntranetService } from '../../intranet.service';
import { Router } from '@angular/router';
  
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
      private route: Router){}

    ngOnInit(): void {

      this._intranetService.currentComponentMenu.subscribe({
        next:(menuData) => {
            console.log('componente menu');
            console.log(menuData);
            this.menus = menuData;
        }
      })
    }
    
    ir(path: string){
      this.route.navigateByUrl(path);
    }

}
import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { PublicService } from '../../public.service';

@Component({
    selector : 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

    userLoginOn :boolean;
    // subscription: any;

    constructor(private route: Router,
        private _publicService: PublicService){
        this.userLoginOn = false;
    }

    ngOnInit(): void {
    //     this.subscription = this._publicService.getComponentLogin()
    //   .subscribe(status => this.userLoginOn = status);

      this._publicService.currentComponentLogin.subscribe({
        next:(userLoginOn) => {
            this.userLoginOn = userLoginOn;
        }
      })
    }

    ngOnDestroy():void {
        this._publicService.currentComponentLogin.unsubscribe();
    }

    inicio(){
        this.userLoginOn = false;
        this.route.navigateByUrl('/home');
    }

    iniciarSesion(){
        this.userLoginOn = true;
        this.route.navigateByUrl('/login');
    }

}
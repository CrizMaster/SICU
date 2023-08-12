import { Component, OnInit } from '@angular/core';
import { PublicService } from '../../public.service';

@Component({
    selector : 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

    userLoginOn :boolean = false;

    characters: any[] = [];
    continents: any[] = [];
    
    constructor(private _publicService: PublicService){}

    ngOnInit(): void {
        // this.getCaracters();
        // this.getContinens();
    }

    // getCaracters(){
    //     this._publicService.getCharacters().subscribe(
    //         response => this.characters = response,
    //         error => console.log(error)
    //     )
    // }

    // getContinens(){
    //     this._publicService.getContinents().subscribe(
    //         response => this.continents = response,
    //         error => console.log(error)
    //     )
    // }

}
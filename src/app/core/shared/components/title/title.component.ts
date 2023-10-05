import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from 'src/app/core/models/title.model';

@Component({
    selector: 'app-title',
    templateUrl: './title.component.html',
    styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit{


    @Input() Data: Title = { Title : '', Subtitle : '', Icon : '', Url: '' };

    constructor(private route: Router){

    }

    ngOnInit(): void {
        
    }

    regresar(){
        if(this.Data.Url.length > 0){
            this.route.navigateByUrl(this.Data.Url);
        }        
    }

}
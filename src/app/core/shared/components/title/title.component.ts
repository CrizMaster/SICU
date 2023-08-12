import { Component, Input, OnInit } from '@angular/core';
import { Title } from 'src/app/core/models/title.model';

@Component({
    selector: 'app-title',
    templateUrl: './title.component.html',
    styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit{


    @Input() Data: Title = { Title : '', Subtitle : '', Icon : '' };

    constructor(){

    }

    ngOnInit(): void {
        
    }
}
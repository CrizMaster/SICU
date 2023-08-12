import { Component, Input, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/core/models/breadcrumb.model';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit{

    @Input() Data: Breadcrumb[] = [];

    constructor(){}

    ngOnInit(): void {
        
    }
}
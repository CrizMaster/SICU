import { Component, OnInit } from '@angular/core';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
    selector: 'app-network-status',
    templateUrl: './network-status.component.html',
    styleUrls: ['./network-status.component.css']
})
export class NetworkStatusComponent implements OnInit{

    public netStatus: string;

    constructor(){}

    ngOnInit(): void {
        fromEvent(window, 'offline').pipe(
            debounceTime(100)).subscribe((event: Event) => {
            console.log('offline');
            console.log(event);
            this.netStatus = event.type;
        });

        fromEvent(window, 'online').pipe(
            debounceTime(100)).subscribe((event: Event) => {
            console.log('online');
            console.log(event);
            this.netStatus = event.type;
        });
    }

}
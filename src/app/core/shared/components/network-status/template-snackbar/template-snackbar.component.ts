import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ConnectionService } from 'ngx-connection-service';
import { of } from 'rxjs';

@Component({
    selector: 'app-template-snackbar',
    templateUrl: './template-snackbar.component.html',
    styleUrls: ['./template-snackbar.component.css']
})
export class TemplateSnackbarComponent implements OnInit  {

    image: string = '0';
    cont: number = 4;
    ngOnInit(): void {
        setTimeout(() => {
            this.changeImge();
          }, 500);
    }

    changeImge(): void {
        this.image = this.cont.toString();
        this.cont --;
        if(this.cont < 0) this.cont = 4;

        setTimeout(() => {
            this.changeImge();
          }, 500);
    }
    
}
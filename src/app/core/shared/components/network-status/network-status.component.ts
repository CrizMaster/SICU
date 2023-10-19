import { Component, Input} from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ConnectionService } from 'ngx-connection-service';
import { TemplateSnackbarComponent } from './template-snackbar/template-snackbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-network-status',
    templateUrl: './network-status.component.html',
    styleUrls: ['./network-status.component.css']
})
export class NetworkStatusComponent  {

    @Input() horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    @Input() verticalPosition: MatSnackBarVerticalPosition = 'top';

    hasNetworkConnection: boolean;
    hasInternetAccess: boolean;
    progress: boolean = false;
    inicio: boolean = true;
    swOpen: boolean = false;
    constructor(private connectionService: ConnectionService,
        private _authService: AuthService,
        private _snackBar: MatSnackBar) {

        this.connectionService.monitor()
        .subscribe(currentState => {
            this.hasNetworkConnection = currentState.hasNetworkConnection;
            this.hasInternetAccess = currentState.hasInternetAccess;

            if (this.hasNetworkConnection && this.hasInternetAccess) {
              this._snackBar.dismiss();
              this.progress = false;
              _authService.isOffLine.next(false);
            } 
            else {
                this.progress = true;
                if(!this.inicio && !this.swOpen) { this.openSnackBar(); }
                this.inicio = false;
                _authService.isOffLine.next(true);
            }
        });
    }

    openSnackBar() {
        let a = this._snackBar.openFromComponent(TemplateSnackbarComponent, {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          panelClass: 'succesful'
        });     
        
        a.afterOpened().subscribe(() => {
            this.swOpen = true;
        });

        a.afterDismissed().subscribe(() => {
            this.swOpen = false;
        });
    }

}
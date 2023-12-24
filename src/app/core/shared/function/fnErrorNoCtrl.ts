import { inject } from "@angular/core";
import { Title } from "../../models/title.model";
import { ModalMessageComponent } from "../components/modal-message/modal-message.component";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "../services/auth.service";

export function fnErrorNoCtrl(dialog: MatDialog, _authService:AuthService, err: any): void {

    if(parseInt(err.message) == 401){
        console.log('1');                    
        _authService.isLoggedIn.next(false);
    }
    else{ 
        let modal: Title = { 
            Title: 'Sin respuesta...', 
            Subtitle: 'No se pudo realizar la acción solicitada. Verifique su conexión a internet y si el problema persiste, contacte con el administrador del sistema.',
            Icon: 'warning' 
        };
        let win = dialog.open(ModalMessageComponent, {
            width: '500px',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: modal
        });
    }
}
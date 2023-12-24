import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { LocalService } from '../../core/shared/services/local.service';
import { Title } from 'src/app/core/models/title.model';
import { ModalMessageComponent } from 'src/app/core/shared/components/modal-message/modal-message.component';
import { MatDialog } from '@angular/material/dialog';

export const IntranetGuard: CanMatchFn = (guar) => {

  const _localService = inject(LocalService);
  const router = inject(Router);  
  const dialog = inject(MatDialog);  

  let cm = _localService.getData("eylmenu");
  if(cm) {


    let currentMenu = JSON.parse(cm);      
    let url = guar.path;
  
    function searchTree(element: any, matchingTitle: string): any {
      if(String(element.ruta).includes('/' + matchingTitle)){
           return element;
      }else if (element.menu != null){
           let result: any = null;
           for(let i=0; result == null && i < element.menu.length; i++){
                result = searchTree(element.menu[i], matchingTitle);
           }
           return result;
      }
      return null;
    }
  
    let result: any = null;
    if(currentMenu.length > 0){
      currentMenu.forEach(element => {
        if(result == null)
        {
          result = searchTree(element, url);
        }        
      });
    }
    
    // if(currentMenu.length > 0){
    //   var element = currentMenu[0];
    //   result = searchTree(element, url);
    // }
  
    return result == null ? router.navigate(['access-denied']) : true;

  }
  else{
    let modal: Title = { 
      Title: 'Sesión Finalizada', 
      Subtitle: 'Su sesión a finalizado. Inicie nuevamente sesión para continuar utilizando el sistema.',
      Icon: 'error' 
    };
    let win = dialog.open(ModalMessageComponent, {
        width: '500px',
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        disableClose: true,
        data: modal
    });

    router.navigate(['login']);
    return false;
  }

  
};
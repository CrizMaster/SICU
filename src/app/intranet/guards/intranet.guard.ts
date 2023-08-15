import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { LocalService } from '../../core/shared/services/local.service';

export const IntranetGuard: CanMatchFn = (guar) => {

  const _localService = inject(LocalService);
  const router = inject(Router);  

  let cm = _localService.getData("sicume");
  if(cm == '') return router.navigate(['login']);

  let currentMenu = JSON.parse(cm);      
  let url = guar.path;

  function searchTree(element: any, matchingTitle: string): any {
    if(String(element.path).includes('/' + matchingTitle)){
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
    var element = currentMenu[0];
    result = searchTree(element, url);
  }

  return result == null ? router.navigate(['access-denied']) : true;

};
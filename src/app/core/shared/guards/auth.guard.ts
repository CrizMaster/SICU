import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs';
import { LocalService } from '../services/local.service';

export const authGuard: CanMatchFn = () => {

  const authService = inject(AuthService);
  const localService = inject(LocalService);
  const router = inject(Router);

  return authService.isAuthenticated()
    .pipe(
        take(1),
        //tap((isLoggedIn: any) => !isLoggedIn ? router.navigate(['login']) : true
        map((isLoggedIn) => {
            if(!isLoggedIn)
            {
              router.navigate(['login']);
              return false;
            }

            return true;
            // else{
            //   if(localService.getData("Token"))
            //     return true;
            //   else
            //     return false;
            // }      
        })
    )  
};
export { AuthService };


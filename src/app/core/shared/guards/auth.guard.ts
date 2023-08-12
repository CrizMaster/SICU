import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take, tap } from 'rxjs';

export const authGuard: CanMatchFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    take(1),
    tap((isLoggedIn: any) => !isLoggedIn ? router.navigate(['home']) : true
    )
  )
};

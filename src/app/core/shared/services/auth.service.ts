import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public readonly isLoggedIn = new BehaviorSubject<boolean>(true);
  constructor() { }

  isAuthenticated():Observable<boolean>{
    return this.isLoggedIn;
  }

}
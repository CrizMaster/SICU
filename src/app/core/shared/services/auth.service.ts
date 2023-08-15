import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public readonly isLoggedIn = new BehaviorSubject<boolean>(true);
  public readonly isOffLine = new BehaviorSubject<boolean>(false);
  public readonly listMenu = new BehaviorSubject<any>([]);

  constructor() { }

  isAuthenticated():Observable<boolean>{
    return this.isLoggedIn;
  }

  currentMenu():Observable<any>{
    return this.listMenu;
  }

}
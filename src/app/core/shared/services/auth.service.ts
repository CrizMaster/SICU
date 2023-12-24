import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UsuarioSession } from 'src/app/public/models/usuarioSession';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public readonly isLoggedIn = new BehaviorSubject<boolean>(true);  
  public readonly isOffLine = new BehaviorSubject<boolean>(false);
  public readonly listMenu = new BehaviorSubject<any>([]);

  currentUsuario: BehaviorSubject<UsuarioSession> = new BehaviorSubject<UsuarioSession>({});

  constructor() { }

  isAuthenticated():Observable<boolean>{
    return this.isLoggedIn;
  }

  currentMenu():Observable<any>{
    return this.listMenu;
  }

  get getUsuario():Observable<UsuarioSession>{
    return this.currentUsuario.asObservable();
  }

}
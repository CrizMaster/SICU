import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalService } from '../services/local.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _localService:LocalService,) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): 
  Observable<HttpEvent<unknown>> {

    let clonedRequest = request;

    let url = request.url;
  
    
    const isApiSecurity= url.includes(environment.urlWebApiEyL);

    if(isApiSecurity && this._localService.getData("Token")){

      let tk = this._localService.getData("Token");
      let usr = JSON.parse(tk);
      clonedRequest = request.clone({
        setHeaders: { Authorization : 'Bearer ' + usr.token }
      })
    }

    return next.handle(clonedRequest);
  }
}

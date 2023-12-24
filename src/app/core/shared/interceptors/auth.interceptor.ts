import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, of, retry, throwError } from 'rxjs';
import { LocalService } from '../services/local.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _localService:LocalService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): 
  Observable<HttpEvent<unknown>> {

    let clonedRequest = request;

    let url = request.url;
      
    //const isApiSecurity= url.includes(environment.urlWebApiEyL);

    if(this._localService.getData("Token")){

      let tk = this._localService.getData("Token");

      let usr = JSON.parse(tk);
      clonedRequest = request.clone({
        setHeaders: { Authorization : 'Bearer ' + usr.token }
      })
    }

    return next.handle(clonedRequest)
    .pipe(
      //retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
        }
        //console.log(errorMessage);
        return throwError(() => new CustomError("Mensaje", { cause: new Error(error.status.toString()) }).cause);
        //return throwError(() => new Error(errorMessage, { cause: error } ));
      })
    );
  }
}

class CustomError extends Error {
  constructor(message, options) {
    // Need to pass `options` as the second parameter to install the "cause" property.
    super(message, options);
  }
}

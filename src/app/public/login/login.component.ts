import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicService } from '../public.service';
import { LoginRequest } from '../models/loginRequest';
import { LoginResponse } from '../models/loginResponse';
import { Subscription, catchError, fromEvent, map, merge, share, throwError } from 'rxjs';


import { LocalService } from 'src/app/core/shared/services/local.service';
import { AuthService } from 'src/app/core/shared/services/auth.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector : 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

    loginForm = this.fb.group({
        usuario: ['', Validators.required],
        password: ['', Validators.required]
    })
    loginError: string = '';
    msgStatus: string = 'Iniciando sesión...';
    hide: boolean = true;
    viewProgress: boolean = false;  

    constructor(private fb: FormBuilder,
        private route: Router,
        private _publicService: PublicService,
        private _localService: LocalService,
        private _authService: AuthService,
        private recaptchaV3Service: ReCaptchaV3Service
        ){}

    ngOnInit(): void {
        //this._publicService.isComponentLogin(true);
        this._publicService.currentComponentLogin.next(true);
        this._authService.isLoggedIn.next(false);
    }

    login(){
      this.loginError = '';
      this.msgStatus = 'Validando recaptchar...';
      if(this.loginForm.valid)
      {
        this.viewProgress = true;
        this.recaptchaV3Service.execute('')
        .subscribe((token) => {

            const auxiliar = this._publicService.validarRecaptchaV3(token)
            auxiliar.subscribe({
              error: () => {
                this.loginError = "A ocurrido un problema, recarge la página e intente nuevamente o contacte con area de soporte técnico.";
                this.viewProgress = false;
              },
              next: (resultado: any) => {
                if (resultado.success === true) {
                  //console.log('next');
                  this.msgStatus = 'Iniciando sesión...';
                  setTimeout(() => {
                    this.iniciarSesion();
                  }, 1000);
                  
                } else {
                  console.error('Error en el captcha. Eres un robot');
                  this.loginError = 'Protección recaptcha activada. Intente nuevamente por favor.';
                  this.viewProgress = false;
                }
              }
            });

          }
        );
      }
      else{
          this.loginForm.markAllAsTouched();
          this.viewProgress = false;
      }        
    }

    iniciarSesion()
    {      
      this._publicService.login(this.loginForm.value as LoginRequest).subscribe({
          next:(userData) => {
              //console.log(userData);
              this._authService.isLoggedIn.next(true);
              this._localService.removeData("Token");
              this._localService.saveData("Token", JSON.stringify(userData))
          },
          error:(errorData) => {
              // console.info('error');
              // console.log(errorData);
              this.loginError = errorData;
              this.viewProgress = false;
          },
          complete:() => {
              //console.info('completo');
              this.route.navigateByUrl('/intranet');
              this.loginForm.reset();
              this.viewProgress = false;                  
          }
      });
    }


    // networkStatus: boolean;
    // watchNetworkInit() {
    //   this.networkStatus = navigator.onLine;
    //   const connect = fromEvent(window, 'online').pipe(map(() => true)),
    //     disconnect = fromEvent(window, 'offline').pipe(map(() => false));
  
    //   merge(connect, disconnect).pipe(share())
    //   .subscribe(status => {
    //     this.networkStatus = status;
    //     console.log(this.networkStatus);
    //   });
    // }

    get Usuario() { return this.loginForm.controls.usuario; }
    get Password() { return this.loginForm.controls.password; }

    private handlerError(error: HttpErrorResponse) {
      let msn = '';
      if(error.status == 0){
          msn = 'Algo falló. Por favor intente nuevamente.';
          console.error(msn);
      }
      else{
          console.error('Backend retornó el código de estado ', error.status, error.error);
          msn = error.error.message;
      }

      return throwError(() => new Error(msn));
  }
}
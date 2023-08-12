import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicService } from '../../public.service';
import { LoginRequest } from '../../models/loginRequest';
import { LocalService } from 'src/app/core/shared/services/local.service';
import { LoginResponse } from '../../models/loginResponse';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/shared/services/auth.service';

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
    hide: boolean = true;
    viewProgress: boolean = false;

    constructor(private fb: FormBuilder,
        private route: Router,
        private _publicService: PublicService,
        private _localService: LocalService,
        private _authService: AuthService){      
    }

    ngOnInit(): void {
        //this._publicService.isComponentLogin(true);
        this._publicService.currentComponentLogin.next(true);
        this._authService.isLoggedIn.next(false);
    }

    login(){
        this.loginError = '';        
        if(this.loginForm.valid){
            this.viewProgress = true;
            this._publicService.login(this.loginForm.value as LoginRequest).subscribe({
                next:(userData) => {
                    //console.log(userData);
                    // let strJson  =JSON.stringify(userData);
                    // let objJson  =JSON.parse(strJson);
                    // console.log(strJson);
                    // console.log(objJson);
                    //this._authService.getStatusLogin(true);
                    this._authService.isLoggedIn.next(true);
                    this._localService.removeData("Token");
                    this._localService.saveData("Token", JSON.stringify(userData))
                },
                error:(errorData) => {
                    console.info('error');
                    console.log(errorData);
                    this.loginError = errorData;
                    this.viewProgress = false;
                },
                complete:() => {
                    console.info('completo');
                    this.route.navigateByUrl('/intranet');
                    this.loginForm.reset();
                    this.viewProgress = false;                  
                }
            });

        }
        else{
            //alert('Error al ingresar los datos');
            this.loginForm.markAllAsTouched();
            this.viewProgress = false;
        }
    }

    get Usuario() { return this.loginForm.controls.usuario; }
    get Password() { return this.loginForm.controls.password; }

}
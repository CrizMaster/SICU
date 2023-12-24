import { Component, OnInit } from '@angular/core';
import { LocalService } from 'src/app/core/shared/services/local.service';
import { IntranetService } from '../../intranet.service';
import { AuthService } from 'src/app/core/shared/services/auth.service';
import { Router } from '@angular/router';
import { UsuarioSession } from 'src/app/public/models/usuarioSession';

interface SelectValue {
  value: string;
  viewValue: string;
}

export interface Section {
    name: string;
    icon: string;
  }

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

    userName: string = '';
    email: string = '';
    cargo: string = '';
    image: string = '';
    organizacionSeleccionada: number = 0;
    perfilSeleccionado: number = 0;

    organizaciones: any[] = [];

    perfiles: any[] = [{ nombrePerfil: 'Seleccione', idPerfil: 0 }];    

    constructor(private _localService: LocalService,
      private _intranetService: IntranetService,
      private _authService: AuthService,
      private route: Router){}

    ngOnInit(): void {

      let tk = this._localService.getData("Token");
      if(tk.length > 0)
      {
        let user = JSON.parse(tk);
      
        this.image = user.archivoFoto;  
        this.userName = user.nombres + ' ' + user.apePaterno + ' ' + user.apeMaterno;
        this.email = user.correo;
        this.cargo = user.nombreCargo;      
      }  
    }    

    CerrarSesion(){
      this._authService.isLoggedIn.next(false);
      this.route.navigateByUrl('/login');
    }  

}
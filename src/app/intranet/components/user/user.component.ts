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

    // organizaciones: any[] = [
    //   { text: 'Municipalidad Provincial de Piura', value: 1 },
    //   { text: 'Municipalidad Provincial de Lambayeque', value: 2 },
    //   { text: 'Municipalidad Provincial de Lima', value: 3 }
    // ];
    organizaciones: any[] = [];

    perfiles: any[] = [{ nombrePerfil: 'Seleccione', idPerfil: 0 }];    

    constructor(private _localService: LocalService,
      private _intranetService: IntranetService,
      private _authService: AuthService,
      private route: Router){}

    ngOnInit(): void {

      let tk = this._localService.getData("Token");
      let user = JSON.parse(tk);
      
      this.image = user.archivoFoto;

      this.userName = user.nombres + ' ' + user.apePaterno + ' ' + user.apeMaterno;
      this.email = user.correo;
      this.cargo = user.nombreCargo;  
    }
    
    onChangeSelOrgs(newValue: string){
      //this.organizacionSeleccionada = parseInt(newValue);
      this.organizaciones.forEach(org => {
        if(org.idOrganizacion == parseInt(newValue))
        {
          this._localService.removeData("sicuorg");
          this._localService.saveData("sicuorg", JSON.stringify(org));          
        }
      });

      this.getPerfiles(newValue);
    }

    onChangeSelPerf(newValue: string){      
      //this.perfilSeleccionado = parseInt(newValue);
      this.getMenu();
    }

    getPerfiles(id: string){
      // console.log('this.organizacionSeleccionada');
      // console.log(this.organizacionSeleccionada);
      this._intranetService.listaPerfiles(id).subscribe({
        next:(persData) => {
            this.perfiles = persData.data;
            this.perfilSeleccionado = parseInt(persData.data[0].idPerfil);

            this.getMenu();
        },
        error:(errorData) => {
            console.info('error');
            console.log(errorData);
        }
      });
    }

    getMenu(){

      this._intranetService.listaMenu(this.organizacionSeleccionada, this.perfilSeleccionado).subscribe({
        next:(menuData) => {                    
          this._intranetService.currentMenu.next(menuData.data);
          //console.log('cambio de menú');
          //this.route.navigateByUrl('/intranet');
        },
        error:(errorData) => {
            console.info('error');
            console.log(errorData);
        }
      });
    }

    CerrarSesion(){
      this._authService.isLoggedIn.next(false);
      this.route.navigateByUrl('/login');
    }  

}
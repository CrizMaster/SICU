import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalService } from 'src/app/core/shared/services/local.service';
import { IntranetService } from '../../intranet.service';
import { AuthService } from 'src/app/core/shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
export class UserComponent implements OnInit, OnDestroy {

    userName: string = '';
    email: string = '';
    image: string = '';
    organizacionSeleccionada: number = 0;
    perfilSeleccionado: number = 0;

    // organizaciones: any[] = [
    //   { text: 'Municipalidad Provincial de Piura', value: 1 },
    //   { text: 'Municipalidad Provincial de Lambayeque', value: 2 },
    //   { text: 'Municipalidad Provincial de Lima', value: 3 }
    // ];
    public listOrg$: Subscription = new Subscription;
    public listPer$: Subscription = new Subscription;
    public listMenu$: Subscription = new Subscription;

    organizaciones: any[] = [];

    perfiles: any[] = [{ nombrePerfil: 'Seleccione', idPerfil: 0 }];    

    constructor(private _localService: LocalService,
      private _intranetService: IntranetService,
      private _authService: AuthService,
      private route: Router){}

    ngOnInit(): void {

      console.log('user componente');

      let tk = this._localService.getData("Token");
      let user = JSON.parse(tk);
      this.image = user.data.image;

      this.userName = user.data.firstName + ' ' + user.data.lastName;
      this.email = user.data.email;

      this.listOrg$ = this._intranetService.listaOrganizaciones().subscribe({
        next:(orgsData) => {
            this.organizaciones = orgsData.data;
            if(this.organizaciones.length > 0) { 

              //if(this._localService.getData("sicuorg"))
              // console.log('this.organizaciones[0]');
              // console.log(this.organizaciones[0]);

              this._localService.removeData("sicuorg");
              this._localService.saveData("sicuorg", JSON.stringify(this.organizaciones[0]));

              this.organizacionSeleccionada = parseInt(this.organizaciones[0].idOrganizacion);
              this.getPerfiles(this.organizaciones[0].idOrganizacion); 
            }
        },
        error:(errorData) => {
            console.info('error');
            console.log(errorData);
        }
      });      
    }

    ngOnDestroy(): void {
      this.listOrg$.unsubscribe();
      this.listPer$.unsubscribe();
      this.listMenu$.unsubscribe();
    }
    
    onChangeSelOrgs(newValue: string){
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
      this.getMenu();
    }

    getPerfiles(id: string){
      this.listPer$ = this._intranetService.listaPerfiles(id).subscribe({
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

      this.listMenu$ = this._intranetService.listaMenu(this.organizacionSeleccionada, this.perfilSeleccionado)
        .subscribe({
          next:(menuData) => {                    
            this._intranetService.currentComponentMenu.next(menuData.data);
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
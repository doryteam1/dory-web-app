import { PlatformLocation, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnlacesDirectosInicioService } from 'src/app/services/enlaces-directos-inicio.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';

 interface enlace_rapido {
   id_enlace_rapido?: number;
   url_imagen: string;
   url_enlace: string;
   titulo: string;
 }
@Component({
  selector: 'app-enlaces-directos-inicio',
  templateUrl: './enlaces-directos-inicio.component.html',
  styleUrls: ['./enlaces-directos-inicio.component.scss'],
})
export class EnlacesDirectosInicioComponent implements OnInit {
  enlaceRapido: enlace_rapido[] = [];
  showError: boolean = false;
  showNotFound: boolean = false;
  authUserId: number = -1;
  constructor(
    private enlacesDirectosInicioService: EnlacesDirectosInicioService,
    public platformLocation: PlatformLocation,
    private appModalService: AppModalService,
    private router: Router
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.cargaService();
  }
  cargaService() {
    this.enlacesDirectosInicioService.getTodos().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.enlaceRapido = response.data;
          this.showError = false;
          this.showNotFound = false;
        } else {
          this.showNotFound = true;
          this.showError = false;
        }
      },
      (err) => {
        console.log(err);
        this.showNotFound = false;
        this.showError = true;
      }
    );
  }
 /*  deleteData(data: any,i:number) {
    let id = data.id_enlace_rapido;
    let nombre = data.nombre;
    let imagen = data.imagen;
    let idx = i;

    this.appModalService
      .confirm(
        'Eliminar enlace rapido',
        'Está seguro que desea eliminar este enlace rápido',
        'Si',
        'No',
        nombre
      )
      .then((result) => {
        if (result == true) {
          this.enlacesDirectosInicioService.delete(id).subscribe(
            (response) => {
              this.enlaceRapido.splice(idx, 1);
              this.storage.deleteByUrl(imagen);
              if (this.enlaceRapido.length <= 0) {
                this.showNotFound = true;
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      })
      .catch((result) => {});
  } */
  editarData(data: any) {
    let id = data.id_enlace_rapido;
    let object: any = {
      id: id,
      action: 'update',
      authUserId: this.authUserId,
    };
    this.router.navigate([
      '/dashboard/enlaces-directos-inicio-admi/detalle',
      object,
    ]);
  }
  openFormCrear() {
    let object = {
      action: 'create',
      authUserId: this.authUserId,
    };
    this.router.navigate([
      '/dashboard/enlaces-directos-inicio-admi/detalle',
      object,
    ]);
  }
  navigate(ruta: any) {
    let url = ruta;
    window.open(url, '_blank');
  }
}

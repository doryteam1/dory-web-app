import { PlatformLocation, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { NovedadesService } from 'src/app/services/novedades.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-novedades-actualidades',
  templateUrl: './novedades-actualidades.component.html',
  styleUrls: ['./novedades-actualidades.component.scss'],
})
export class NovedadesActualidadesComponent implements OnInit {
  novedades: any[] = [];
  miembro: any;
  showError: boolean = false;
  showNotFound: boolean = false;
  authUserId: number = -1;
  constructor(
    private novedadesService: NovedadesService,
    private storage: FirebaseStorageService,
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
    this.novedadesService.getNovedades().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.novedades = response.data;
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
  deleteNovedad(id: any, nombre: any, imagen:string, idx: any) {
    this.appModalService
      .confirm(
        'Eliminar novedad',
        'Está seguro que desea eliminar esta novedad',
        'Sí',
        'No',
        nombre
      )
      .then((result) => {
        if (result == true) {
          this.novedadesService.deleteNovedad(id).subscribe(
            (response) => {
              this.novedades.splice(idx, 1);
              if (imagen.length > 0) {
                this.storage.deleteByUrl(imagen);
              }
              if (this.novedades.length <= 0) {
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
  }
  editarData(idNovedad: any) {
    let object: any = {
      id: idNovedad,
      action: 'update',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/novedad-actualidad-admi/detalle', object]);
  }
  openFormCrear() {
    let object = {
      action: 'create',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/novedad-actualidad-admi/detalle', object]);
  }
}

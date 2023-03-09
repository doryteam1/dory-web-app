import {
  Component,
  OnInit
} from '@angular/core';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { PlatformLocation, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
const _ = require('lodash');

@Component({
  selector: 'app-mis-asociaciones',
  templateUrl: './mis-asociaciones.component.html',
  styleUrls: ['./mis-asociaciones.component.scss'],
})
export class MisAsociacionesComponent implements OnInit, OnDestroy {
  asociaciones: Array<any> = [];
  showNotFound: boolean = false;
  loading1: boolean = false;
  loading2: boolean = false;
  authUserId: number = -1;
  authUserTipo: string = '';
  selectedTab: string = 'representante';
  asociacionesIsMiembro: any;
  showNotFoundAsocMiemb: boolean = false;
  activeclass1: boolean = true;
  activeclass2: boolean = false;
  activeclass3: boolean = false;
  isUserRep: boolean = false;
  isUserMiemb: boolean = false;
  BotonNotificacion!: Subscription;

  constructor(
    private asociacionesService: AsociacionesService,
    private appModalService: AppModalService,
    private router: Router,
    private asociacionService: AsociacionesService,
    public platformLocation: PlatformLocation,
    private usuarioService: UsuarioService,
    private storage: FirebaseStorageService
  ) {}
  ngOnDestroy(): void {
    this.BotonNotificacion.unsubscribe();
  }

  verifyTypeUser() {
    this.activeclass1 = false;
    this.activeclass2 = false;
    this.activeclass3 = false;
    if (!this.isUserMiemb && !this.isUserRep) {
      this.activeclass1 = true;
      this.activeclass2 = false;
      this.activeclass3 = false;
    } else if (this.isUserMiemb) {
      this.activeclass1 = false;
      this.activeclass2 = true;
      this.activeclass3 = false;
    } else if (this.isUserRep) {
      this.activeclass1 = true;
      this.activeclass2 = false;
      this.activeclass3 = false;
    }
  }
  ngOnInit(): void {
    this.platformLocation.onPopState(() => {
      this.appModalService.closeModal();
    });
    registerLocaleData(es);
    let dataUserAuth = this.usuarioService.getAuthUser();
    this.authUserId = dataUserAuth?.sub;
    this.authUserTipo = dataUserAuth?.rol;
    this.preCarga();
    /* municipios sucre */
    this.BotonNotificacion = this.asociacionService.actionBotton$.subscribe(
      (action: boolean) => {
        if (action) {
          this.showNotFoundAsocMiemb = false;
          this.loading2 = true;
          this.asociacionesService
            .getAsociacionesIsMiembroUser(this.authUserId)
            .subscribe(
              (response) => {
                this.asociacionesIsMiembro = response.data;
                if (this.asociacionesIsMiembro.length < 1) {
                  this.showNotFoundAsocMiemb = true;
                  this.isUserMiemb = false;
                } else {
                  this.isUserMiemb = true;
                  this.verifyTypeUser();
                }
                this.loading2 = false;
              },
              (err) => {
                this.showNotFoundAsocMiemb = true;
                this.loading2 = false;
              }
            );
        }
      }
    );
  }
  preCarga() {
    /*Asociaciones en donde se es representante legal*/
    this.loading1 = true;
    this.isUserRep = false;
    this.isUserMiemb = false;
    this.asociacionesService.getAsociacionesUsuario(this.authUserId).subscribe(
      (response) => {
        this.asociaciones = response.data;
        if (this.asociaciones.length <= 0) {
          this.showNotFound = true;
          this.isUserRep = false;
        } else {
          this.isUserRep = true;
        }
        this.loading1 = false;
        this.verifyTypeUser();
      },
      (err) => {
        this.verifyTypeUser();
        this.showNotFound = true;
        console.log(err);
        this.loading1 = false;
      }
    );

    /*Asociaciones en donde se en miembro*/
    this.loading2 = true;
    this.asociacionesService
      .getAsociacionesIsMiembroUser(this.authUserId)
      .subscribe(
        (response) => {
          this.asociacionesIsMiembro = response.data;
          if (this.asociacionesIsMiembro.length < 1) {
            this.showNotFoundAsocMiemb = true;
            this.isUserMiemb = false;
          } else {
            this.isUserMiemb = true;
          }
          this.loading2 = false;
          this.verifyTypeUser();
        },
        (err) => {
          this.verifyTypeUser();
          this.showNotFoundAsocMiemb = true;
          this.loading2 = false;
        }
      );
  }
  invitarAnular(asociacion: any) {
    if (asociacion.estado_solicitud == 'Aceptada') {
      this.appModalService
        .confirm('Salir de la asociación', 'Está seguro', 'Aceptar', 'Cancelar')
        .then((result) => {
          if (result == true) {
            let estado = asociacion.estado_solicitud;
            let enviadaPor = asociacion.solicitud_enviada_por;
            asociacion.estado_solicitud = null;
            asociacion.solicitud_enviada_por = null;
            this.asociacionService
              .eliminarSolicitud(asociacion.id_solicitud)
              .subscribe(
                (response) => {},
                (err) => {
                  asociacion.estado_solicitud = estado;
                  asociacion.solicitud_enviada_por = enviadaPor;
                  console.log(err);
                }
              );
          }
        })
        .catch((result) => {});
    } else if (asociacion.estado_solicitud == 'Enviada') {
      let estado = asociacion.estado_solicitud;
      let enviadaPor = asociacion.solicitud_enviada_por;
      asociacion.estado_solicitud = null;
      asociacion.solicitud_enviada_por = null;
      this.asociacionService
        .eliminarSolicitud(asociacion.id_solicitud)
        .subscribe(
          (response) => {},
          (err) => {
            asociacion.estado_solicitud = estado;
            asociacion.solicitud_enviada_por = enviadaPor;
            console.log(err);
          }
        );
    } else {
      let data = {
        quienEnvia: 'usuario',
      };
      asociacion.estado_solicitud = 'Enviada';
      asociacion.solicitud_enviada_por = 'usuario';
      this.asociacionService
        .invitarUsuarioAsociacion(data, asociacion.nit)
        .subscribe(
          (response) => {
            asociacion.id_solicitud = response.body.insertId;
          },
          (err) => {
            asociacion.estado_solicitud = null;
            asociacion.solicitud_enviada_por = null;
            console.log(err);
          }
        );
    }
  }

  delete(asociacion: any) {
     let url_rut: string = asociacion.url_rut;
     let foto_camarac: string = asociacion.foto_camarac;
    this.appModalService
      .confirm(
        'Eliminar asociación',
        'Esta seguro que desea eliminar esta asociación',
        'Sí',
        'No',
        asociacion.nombre
      )
      .then((result) => {
        if (result == true) {
          this.asociacionesService.delete(asociacion.nit).subscribe(
            (response: any) => {
              if (url_rut.length > 0) {
                this.storage.deleteByUrl(url_rut);
              }

              if (foto_camarac.length > 0) {
                this.storage.deleteByUrl(foto_camarac);
              }
              this.preCarga();
            },
            (err) => {
              console.log(err);
            }
          );
        }
      })
      .catch((result) => {});
  }

  activeTabClick(selectedTab: string) {
    if (selectedTab == 'representante') {
      this.selectedTab = selectedTab;
      this.activeclass1 = true;
      this.activeclass2 = false;
      this.activeclass3 = false;
    } else if (selectedTab == 'miembro') {
      this.selectedTab = selectedTab;
      this.activeclass1 = false;
      this.activeclass2 = true;
      this.activeclass3 = false;
    } else if (selectedTab == 'Unirme_a_una_asociacion') {
      this.selectedTab = selectedTab;
      this.activeclass1 = false;
      this.activeclass2 = false;
      this.activeclass3 = true;
    }
  }

  navigate(event: any, formState: string, from: string) {
    let object: any = {
      nit: event.nit,
      action: 'update',
      authUserTipo: this.authUserTipo,
      formState: this.selectedTab == 'representante' ? 'enable' : 'disable',
    };

    if (from == 'tabSoyMiemb') {
      this.router.navigateByUrl(`/asociaciones/municipio/detalle/${event.nit}`);
    } else {
      this.router.navigate(['/dashboard/asociacion/detalle', object]);
    }
  }
  create() {
    let object = {
      action: 'create',
      formState: 'enable',
      authUserTipo: this.authUserTipo,
    };
    this.router.navigate(['/dashboard/asociacion/detalle', object]);
  }
  salirAsociacion(asociacion: any, idx: number) {
    this.appModalService
      .confirm(
        'Salir de la asociación',
        'Está seguro que desea salir  de esta asociación',
        'Sí',
        'No'
      )
      .then((result) => {
        if (result == true) {
          this.asociacionService
            .eliminarSolicitud(asociacion.id_solicitud)
            .subscribe(
              (response) => {
                this.preCarga();
              },
              (err) => {
                console.log(err);
              }
            );
        }
      })
      .catch((result) => {});
  }
}

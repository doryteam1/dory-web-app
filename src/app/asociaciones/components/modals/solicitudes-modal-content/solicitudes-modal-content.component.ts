import { PlatformLocation } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';

@Component({
  selector: 'app-solicitudes-modal-content',
  templateUrl: './solicitudes-modal-content.component.html',
  styleUrls: ['./solicitudes-modal-content.component.scss'],
})
export class SolicitudesModalContentComponent implements OnInit {
  @Input() title = 'Agregar miembros';
  @Input() datos: any;
  piscicultores: Array<any> = [];
  pescadores: Array<any> = [];
  piscicultoresFiltered: any[] = [];
  pescadoresFiltered: any[] = [];
  activeclass1: boolean = false;
  activeclass2: boolean = false;
  error: string = '';
  constructor(
    public activeModal: NgbActiveModal,
    private pescadoresService: PescadoresService,
    private piscicultoresService: PiscicultoresService,
    private asociacionService: AsociacionesService,
    private appModalService: AppModalService,
    private router: Router,
    public platformLocation: PlatformLocation
  ) {}

  ngOnInit(): void {
    this.activeTabClick(this.datos.tipo_asociacion);
    this.pescadoresService
      .getPescadoresEstadoSolicitud(this.datos.nit)
      .subscribe((response: any) => {
        this.pescadores = response.data;
        this.pescadoresFiltered = this.pescadores;
      });
    this.piscicultoresService
      .getPiscicultoresEstadoSolicitud(this.datos.nit)
      .subscribe((response) => {
        this.piscicultores = response.data;
        this.piscicultoresFiltered = this.piscicultores;
      });
  }

  invitarAnular(usuario: any) {
    this.platformLocation.onPopState(() => {
      this.appModalService.closeModal();
    });
    if (usuario.estado_solicitud == 'Aceptada') {
      this.appModalService
        .confirm(
          'Eliminar miembro',
          'Está seguro que desea eliminar este miembro de la asociación',
          'Eliminar',
          'Cancelar'
        )
        .then((result) => {
          if (result == true) {
            let estado = usuario.estado_solicitud;
            let enviadaPor = usuario.solicitud_enviada_por;
            usuario.estado_solicitud = null;
            usuario.solicitud_enviada_por = null;
            this.asociacionService
              .eliminarSolicitud(usuario.id_solicitud)
              .subscribe(
                (response) => {
                },
                (err) => {
                  usuario.estado_solicitud = estado;
                  usuario.solicitud_enviada_por = enviadaPor;
                  console.log(err);
                }
              );
          }
        })
        .catch((result) => {});
    } else if (usuario.estado_solicitud == 'Enviada') {
      let estado = usuario.estado_solicitud;
      let enviadaPor = usuario.solicitud_enviada_por;
      usuario.estado_solicitud = null;
      usuario.solicitud_enviada_por = null;
      this.asociacionService.eliminarSolicitud(usuario.id_solicitud).subscribe(
        (response) => {
        },
        (err) => {
          usuario.estado_solicitud = estado;
          usuario.solicitud_enviada_por = enviadaPor;
          console.log(err);
        }
      );
    } else {
      let data = {
        quienEnvia: 'asociacion',
        id_usuario_receptor: usuario.id,
      };
      usuario.estado_solicitud = 'Enviada';
      usuario.solicitud_enviada_por = 'asociacion';
      this.asociacionService
        .invitarUsuarioAsociacion(data, this.datos.nit)
        .subscribe(
          (response) => {
            usuario.id_solicitud = response.body.insertId;
          },
          (err) => {
            usuario.estado_solicitud = null;
            usuario.solicitud_enviada_por = null;
            this.error = err.error.message;
            setTimeout(() => {
              this.error = '';
            }, 3000);
          }
        );
    }
  }

  datosContacto(datos: any, userType: string) {
    this.platformLocation.onPopState(() => {
      this.appModalService.closeModal();
    });
    let object: any = {
      nombreUser: datos.nombres,
      tipoUser: userType,
      foto: datos.foto,
      correoUser: datos.email,
      telefonoUser: datos.telefono,
    };
    if (userType == 'Pescador') {
      object.rutaUserDetalle = `/pescadores/detalle/${datos.id}`;
      object.nombreUser = datos.nombres;
    } else if (userType == 'Piscicultor') {
      object.rutaUserDetalle = `/piscicultores/detalle/${datos.id}`;
    }
    this.appModalService
      .modalContactCardComponent(object)
      .then((result) => {})
      .catch((result) => {});
  }
  onSearch(text: string) {
    if (text == '') {
      this.piscicultoresFiltered = this.piscicultores;
    } else {
      this.piscicultoresFiltered = this.piscicultores.filter((element) => {
        let nombre = element.nombres?.toLocaleLowerCase();
        return nombre?.includes(text.toLocaleLowerCase());
      });
    }

    if (text == '') {
      this.pescadoresFiltered = this.pescadores;
    } else {
      this.pescadoresFiltered = this.pescadores.filter((element) => {
        let nombre = element.nombres?.toLocaleLowerCase();
        return nombre?.includes(text.toLocaleLowerCase());
      });
    }
  }

  navigateDetalle(user: any) {
    let url = '';
    if (this.datos.tipo_asociacion == 1) {
      url = this.router.serializeUrl(
        this.router.createUrlTree([`/piscicultores/detalle/${user.id}`])
      );
      window.open(url, '_blank');
    } else if (this.datos.tipo_asociacion == 2) {
      url = this.router.serializeUrl(
        this.router.createUrlTree([`/pescadores/detalle/${user.id}`])
      );
      window.open(url, '_blank');
    }
  }
  activeTabClick(selectedTab?: any) {
    if (selectedTab == 1) {
      this.activeclass1 = true;
      this.activeclass2 = false;
    } else if (selectedTab == 2) {
      this.activeclass1 = false;
      this.activeclass2 = true;
    } else if (selectedTab == 3) {
      this.activeclass1 = true;
      this.activeclass2 = false;
    }
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
}

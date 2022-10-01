import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/internal/Subscription';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';

@Component({
  selector: 'app-solicitudes-modal-content',
  templateUrl: './solicitudes-modal-content.component.html',
  styleUrls: ['./solicitudes-modal-content.component.scss'],
})
export class SolicitudesModalContentComponent implements OnInit, OnDestroy {
  @Input() title = 'Agregar miembros';
  @Input() datos: any;
  piscicultores: Array<any> = [];
  pescadores: Array<any> = [];
  piscicultoresFiltered: any[] = [];
  pescadoresFiltered: any[] = [];
  shorterNumber: number = 20;
  activeclass1: boolean = false;
  activeclass2: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private pescadoresService: PescadoresService,
    private piscicultoresService: PiscicultoresService,
    private asociacionService: AsociacionesService,
    private appModalService: AppModalService,
    private router: Router,
    public mediaQueryService: MediaQueryService
  ) {}
  mediaQuery1Solicit!: Subscription;
  mediaQuery2Solicit!: Subscription;
  mediaQuery3Solicit!: Subscription;
  ngOnDestroy(): void {
    this.mediaQuery1Solicit.unsubscribe();
    this.mediaQuery2Solicit.unsubscribe();
    this.mediaQuery3Solicit.unsubscribe();
  }
  ngOnInit(): void {
    this.activeTabClick(this.datos.tipo_asociacion);
    this.pescadoresService
      .getPescadoresEstadoSolicitud(this.datos.nit)
      .subscribe((response: any) => {
        console.log(response);
        this.pescadores = response.data;
        this.pescadoresFiltered = this.pescadores;
      });
    this.piscicultoresService
      .getPiscicultoresEstadoSolicitud(this.datos.nit)
      .subscribe((response) => {
        console.log(response);
        this.piscicultores = response.data;
        this.piscicultoresFiltered = this.piscicultores;
      });
    this.mediaQuery1Solicit = this.mediaQueryService
      .mediaQuery('max-width: 400px')
      .subscribe((matches) => {
        if (matches) {
          this.shorterNumber = 15;
        } else {
          this.shorterNumber = 20;
        }
      });
    this.mediaQuery2Solicit = this.mediaQueryService
      .mediaQuery('max-width: 370px')
      .subscribe((matches) => {
        if (matches) {
          this.shorterNumber = 10;
        } else {
          this.shorterNumber = 15;
        }
      });
    this.mediaQuery3Solicit = this.mediaQueryService
      .mediaQuery('max-width: 337px')
      .subscribe((matches) => {
        if (matches) {
          this.shorterNumber = 7;
        } else {
          this.shorterNumber = 10;
        }
      });
  }

  invitarAnular(usuario: any) {
    if (usuario.estado_solicitud == 'Aceptada') {
      this.appModalService
        .confirm(
          'Eliminar de miembro',
          'Esta seguro que desea eliminar este miembro de esta asociación',
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
                  console.log(response);
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
          console.log(response);
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
            console.log(response);
            usuario.id_solicitud = response.body.insertId;
            console.log('usuario.id_solicitud ', usuario.id_solicitud);
          },
          (err) => {
            usuario.estado_solicitud = null;
            usuario.solicitud_enviada_por = null;
            console.log(err);
          }
        );
    }
  }
  datosContactoPescador(pescador: any) {
    let object: any = {
      nombreUser: pescador.nombres,
      tipoUser: 'Pescador',
      foto: pescador.foto,
      correoUser: pescador.email,
      telefonoUser: pescador.telefono,
      rutaUserDetalle: `/pescadores/detalle/${pescador.id}`,
    };
    this.appModalService
      .modalContactCardComponent(object)
      .then((result) => {})
      .catch((result) => {});
  }
  datosContactoPiscicultor(piscicultor: any) {
    let object: any = {
      nombreUser: piscicultor.nombres,
      tipoUser: 'Piscicultor',
      foto: piscicultor.foto,
      correoUser: piscicultor.email,
      telefonoUser: piscicultor.telefono,
      rutaUserDetalle: `/piscicultores/detalle/${piscicultor.id}`,
    };
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
    if (this.datos.tipo_asociacion == 'Piscicultores') {
      url = this.router.serializeUrl(
        this.router.createUrlTree([`/piscicultores/detalle/${user.id}`])
      );
      window.open(url, '_blank');
    } else if (this.datos.tipo_asociacion == 'Pescadores') {
      url = this.router.serializeUrl(
        this.router.createUrlTree([`/pescadores/detalle/${user.id}`])
      );
      window.open(url, '_blank');
    }
  }
  activeTabClick(selectedTab?: string) {
    if (selectedTab == 'Piscicultores') {
      this.activeclass1 = true;
      this.activeclass2 = false;
    } else if (selectedTab == 'Pescadores') {
      this.activeclass1 = false;
      this.activeclass2 = true;
    } else if (selectedTab == 'Mixta') {
      this.activeclass1 = true;
      this.activeclass2 = false;
    }
  }
}

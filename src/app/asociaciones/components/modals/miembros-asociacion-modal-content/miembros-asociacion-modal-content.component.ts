import { PlatformLocation } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';

@Component({
  selector: 'app-miembros-asociacion-modal-content',
  templateUrl: './miembros-asociacion-modal-content.component.html',
  styleUrls: ['./miembros-asociacion-modal-content.component.scss'],
})
export class MiembrosAsociacionModalContentComponent implements OnInit {
  @Input() title = 'Agregar miembros';
  @Input() datos: any;
  piscicultores: Array<any> = [];
  pescadores: Array<any> = [];
  piscicultoresFiltered: any[] = [];
  pescadoresFiltered: any[] = [];
  activeclass1: boolean = false;
  activeclass2: boolean = false;
  showNotFound1: boolean = false;
  showNotFound2: boolean = false;
  showError1: boolean = false;
  showError2: boolean = false;
  errorMessage1 = '';
  errorMessage2 = '';
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
    this.preCarga();
  }
  reseptVariables() {
    this.piscicultores = [];
    this.pescadores = [];
    this.piscicultoresFiltered = [];
    this.pescadoresFiltered = [];
    this.activeclass1 = false;
    this.activeclass2 = false;
    this.showNotFound1 = false;
    this.showNotFound2 = false;
    this.showError1 = false;
    this.showError2 = false;
    this.errorMessage1 = '';
    this.errorMessage2 = '';
  }
  preCarga() {
    this.showError1 = false;
    this.showNotFound1 = false;
    this.showError2 = false;
    this.showNotFound2 = false;
    this.reseptVariables();
    this.pescadoresService.getPescadoresAsociacion(this.datos.nit).subscribe(
      (response: any) => {
        if (response.data.length > 0) {
          this.pescadores = response.data;
          this.pescadoresFiltered = this.pescadores;
        } else {
          this.showNotFound1 = true;
          this.showError1 = false;
        }
      },
      (err) => {
        console.log(err);
        if (err.status == 404) {
          this.showNotFound1 = true;
        } else {
          this.showError1 = true;
          this.errorMessage1 = 'Error inesperado';
        }
      }
    );
    this.piscicultoresService
      .getPiscicultoresAsociacion(this.datos.nit)
      .subscribe(
        (response) => {
          if (response.data.length > 0) {
            this.piscicultores = response.data;
            this.piscicultoresFiltered = this.piscicultores;
          } else {
            this.showNotFound2 = true;
            this.showError2 = false;
          }
        },
        (err) => {
          console.log(err);
          if (err.status == 404) {
            this.showNotFound2 = true;
          } else {
            this.showError2 = true;
            this.errorMessage2 = 'Error inesperado';
          }
        }
      );
       this.activeTabClick(this.datos?.tipo_asociacion);
  }
  anularInvitacion(usuario: any) {
    this.platformLocation.onPopState(() => {
      this.appModalService.closeModal();
    });
    this.appModalService
      .confirm(
        'Eliminar miembro',
        'Desea eliminar este miembro de esta asociación',
        'Sí',
        'No'
      )
      .then((result) => {
        if (result == true) {
          this.asociacionService
            .eliminarSolicitud(usuario.id_solicitud)
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
  datosContacto(datos: any, userType: string) {
    this.platformLocation.onPopState(() => {
      this.appModalService.closeModal();
    });
    let object: any = {
      nombreUser: datos.nombre,
      tipoUser: userType,
      foto: datos.foto,
      correoUser: datos.email,
      telefonoUser: datos.telefono,
    };
    if (userType == 'Pescador') {
      object.rutaUserDetalle = `/pescadores/detalle/${datos.id}`;
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
        let nombre = element.nombre?.toLocaleLowerCase();
        return nombre?.includes(text.toLocaleLowerCase());
      });
    }

    if (text == '') {
      this.pescadoresFiltered = this.pescadores;
    } else {
      this.pescadoresFiltered = this.pescadores.filter((element) => {
        let nombre = element.nombre?.toLocaleLowerCase();
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

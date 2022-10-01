import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/internal/Subscription';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';

@Component({
  selector: 'app-miembros-asociacion-modal-content',
  templateUrl: './miembros-asociacion-modal-content.component.html',
  styleUrls: ['./miembros-asociacion-modal-content.component.scss'],
})
export class MiembrosAsociacionModalContentComponent
  implements OnInit, OnDestroy
{
  @Input() title = 'Agregar miembros';
  @Input() datos: any;
  piscicultores: Array<any> = [];
  pescadores: Array<any> = [];
  piscicultoresFiltered: any[] = [];
  pescadoresFiltered: any[] = [];
  shorterNumber: number = 20;
  activeclass1: boolean = false;
  activeclass2: boolean = false;
  showNotFound1: boolean = false;
  showError1: boolean = false;
  showNotFound2: boolean = false;
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
    public mediaQueryService: MediaQueryService
  ) {}
  mediaQuery1Mienbr!: Subscription;
  ngOnDestroy(): void {
    this.mediaQuery1Mienbr.unsubscribe();
  }

  ngOnInit(): void {
    this.activeTabClick(this.datos.tipo_asociacion);
    this.pescadoresService.getPescadoresAsociacion(this.datos.nit).subscribe(
      (response: any) => {
        console.log('pescadores ', response);
        if (response.data.length > 0) {
          this.pescadores = response.data;
          this.pescadoresFiltered = this.pescadores;
          this.showError1 = false;
          this.showNotFound1 = false;
        } else {
          console.log(this.showNotFound1);
          console.log(this.showError1);
          this.showNotFound1 = true;
          this.showError1 = false;
        }
      },
      (err) => {
         console.log(err);
        this.showNotFound1 = false;
        this.showError1 = false;
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
          console.log('piscicultores', response);
          if (response.data.length > 0) {
            this.piscicultores = response.data;
            this.piscicultoresFiltered = this.piscicultores;
            this.showError2 = false;
            this.showNotFound2 = false;
          } else {
            console.log("sindata pisci")
                     console.log(this.showError1);
            this.showNotFound2 = true;
            this.showError2 = false;
          }
        },
        (err) => {
          console.log(err)
          this.showNotFound2 = false;
          this.showError2 = false;
          if (err.status == 404) {
            this.showNotFound2 = true;
          } else {
            this.showError2 = true;
            this.errorMessage2 = 'Error inesperado';
          }
        }
      );
    this.mediaQuery1Mienbr = this.mediaQueryService
      .mediaQuery('max-width: 300px')
      .subscribe((matches) => {
        if (matches) {
          this.shorterNumber = 15;
        } else {
          this.shorterNumber = 20;
        }
      });
  }

  anularInvitacion(usuario: any) {
    this.appModalService
      .confirm(
        'Eliminar miembro',
        'Desea eliminar este miembro de esta asociación',
        'Eliminar',
        'Cancelar'
      )
      .then((result) => {
        if (result == true) {
          this.asociacionService
            .eliminarSolicitud(usuario.id_solicitud)
            .subscribe(
              (response) => {
                console.log(response);
                if (usuario.tipo_usuario == 'Piscicultor') {
                  let index = this.piscicultores.findIndex((element: any) => {
                    return element.id == usuario.id;
                  });
                  if (index != -1) {
                    this.piscicultores.splice(index, 1);
                  }
                } else if (usuario.tipo_usuario === 'Pescador') {
                  let index = this.pescadores.findIndex((element: any) => {
                    return element.id == usuario.id;
                  });
                  if (index != -1) {
                    this.pescadores.splice(index, 1);
                  }
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
  datosContactoPescador(pescador: any) {
    let object: any = {
      nombreUser: pescador.nombre,
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
      nombreUser: piscicultor.nombre,
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

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
  selector: 'app-miembros-asociacion-modal-content',
  templateUrl: './miembros-asociacion-modal-content.component.html',
  styleUrls: ['./miembros-asociacion-modal-content.component.scss'],
})
export class MiembrosAsociacionModalContentComponent implements OnInit, OnDestroy {
  @Input() title = 'Agregar miembros';
  @Input() nit = -1;
  piscicultores: Array<any> = [];
  pescadores: Array<any> = [];
  selectedTab: string = 'piscicultores';
  piscicultoresFiltered: any[] = [];
  pescadoresFiltered: any[] = [];
  shorterNumber: number=20;
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
    this.pescadoresService
      .getPescadoresAsociacion(this.nit)
      .subscribe((response: any) => {
        console.log('pescadores ', response);
        this.pescadores = response.data;
        this.pescadoresFiltered = this.pescadores;
      });
    this.piscicultoresService
      .getPiscicultoresAsociacion(this.nit)
      .subscribe((response) => {
        console.log('piscicultores', response);
        this.piscicultores = response.data;
        this.piscicultoresFiltered = this.piscicultores;
      });
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

  onSearch(text: string) {
    if (this.selectedTab == 'piscicultores') {
      console.log('piscicultores ', text);
      if (text == '') {
        this.piscicultoresFiltered = this.piscicultores;
      } else {
        this.piscicultoresFiltered = this.piscicultores.filter((element) => {
          return element.nombres
            .toLocaleLowerCase()
            .includes(text.toLocaleLowerCase());
        });
      }
    } else {
      console.log('pescadores ', text);
      if (text == '') {
        this.pescadoresFiltered = this.piscicultores;
      } else {
        this.pescadoresFiltered = this.pescadores.filter((element) => {
          return element.nombres
            .toLowerCase()
            .includes(text.toLocaleLowerCase());
        });
      }
    }
  }

  navigateDetalle(user: any) {
    let url = '';
    if (this.selectedTab == 'piscicultores') {
      // Converts the route into a string that can be used
      // with the window.open() function
      url = this.router.serializeUrl(
        this.router.createUrlTree([`/piscicultores/detalle/${user.id}`])
      );
    } else {
      url = this.router.serializeUrl(
        this.router.createUrlTree([`/pescadores/detalle/${user.id}`])
      );
    }
    window.open(url, '_blank');
  }
}

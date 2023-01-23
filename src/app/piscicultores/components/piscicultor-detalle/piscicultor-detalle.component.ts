import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PiscicultoresService } from '../../services/piscicultores.service';
import { Router } from '@angular/router';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { PlatformLocation,
} from '@angular/common';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
@Component({
  selector: 'app-piscicultor-detalle',
  templateUrl: './piscicultor-detalle.component.html',
  styleUrls: ['./piscicultor-detalle.component.scss'],
})
export class PiscicultorDetalleComponent implements OnInit {
  selectedPiscicultorId: number = -1;
  piscicultor: any;
  piscicultorasociaciones: any;
  piscicultorgranjas: any;
  piscicultorAsociacionNotFound: boolean = false;
  piscicultorGranjasNotFound: boolean = false;
  piscicultorDetalleshowError: boolean = false;
  piscicultorAsociacionError: boolean = false;
  piscicultorGranjasError:boolean = false;
  errorMessage = '';
  activatelistasociacion: boolean = false;
  piscicultorGranjaschangeItem: boolean = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private piscicultoresService: PiscicultoresService,
    private router: Router,
    private granjasService: GranjasService,
    public location2: PlatformLocation
  ) {}

  ngOnInit(): void {
    this.selectedPiscicultorId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.piscicultoresService
      .getPiscicultorDetalle(this.selectedPiscicultorId)
      .subscribe(
        (response: any) => {
          this.piscicultor = response.data[0];
          if (response.data.length > 0) {
            this.piscicultorDetalleshowError = false;
          } else {
            this.piscicultorDetalleshowError = false;
          }
        },
        (err) => {
          this.piscicultorDetalleshowError = false;
          if (err.status == 404) {
          } else {
            this.piscicultorDetalleshowError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );
    this.getAsociaciones();
    this.piscicultorDetalleGranjas();
  }
  piscicultorDetalleGranjas() {
    this.piscicultoresService
      .getPiscicultorDetalleGranjas(this.selectedPiscicultorId)
      .subscribe(
        (response: any) => {
          if (!response.data.length) {
            this.piscicultorGranjasNotFound = true;
            this.piscicultorGranjasError = false;
            this.piscicultorGranjaschangeItem = false;
          } else {
            this.piscicultorgranjas = response.data;
            this.piscicultorGranjasError = false;
            this.piscicultorGranjasNotFound = false;
            this.piscicultorGranjaschangeItem = false;
          }
        },
        (err) => {
          this.piscicultorGranjasNotFound = false;
          this.piscicultorGranjasError = false;
          this.piscicultorGranjaschangeItem = false;
          if (err.status == 404) {
            this.piscicultorGranjasNotFound = true;
          } else {
            this.piscicultorGranjasError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );
  }

  handleResponse(response: any) {
    if (!response.data.length) {
      this.piscicultorAsociacionNotFound = true;
      this.piscicultorAsociacionError = false;
    } else {
      this.piscicultorasociaciones = response.data;
      this.piscicultorAsociacionError = false;
      this.piscicultorAsociacionNotFound = false;
    }
  }

  handleError(err: any) {
    this.piscicultorAsociacionNotFound = false;
    this.piscicultorAsociacionError = false;
    if (err.status == 404) {
      this.piscicultorAsociacionNotFound = true;
    } else {
      this.piscicultorAsociacionError = true;
      this.errorMessage = 'Error inesperado';
    }
  }
  getAsociaciones() {
    this.piscicultoresService
      .getAsociacionesUsuario(this.selectedPiscicultorId)
      .subscribe(
        (response: any) => {
          if (!response.data.length) {
            this.piscicultoresService
              .getAsociacionesIsMiembroUser(this.selectedPiscicultorId)
              .subscribe(
                (response: any) => this.handleResponse(response),
                (err) => this.handleError(err)
              );
          } else {
            this.handleResponse(response);
          }
        },
        (err) => this.handleError(err)
      );
  }
  openAsocia() {
    if (this.activatelistasociacion) {
      this.activatelistasociacion = false;
    } else {
      this.activatelistasociacion = true;
    }
  }
  goAssociationDetail(asociacion: any) {
    this.router.navigateByUrl(
      '/asociaciones/municipio/detalle/' + asociacion.nit
    );
  }
  goDetailFarm(idgranja: any) {
    this.router.navigateByUrl('/granjas/municipio/detalle/' + idgranja);
  }
  goDetalleRepresentante(asociacion: any) {
    if (asociacion.tipo_propietario == 'Pescador') {
      this.router.navigateByUrl(
        '/pescadores/municipio/detalle/' + asociacion.id_propietario
      );
    } else if (asociacion.tipo_propietario == 'Piscicultor') {
      this.router.navigateByUrl(
        '/piscicultores/municipio/detalle/' + asociacion.id_propietario
      );
    }
  }
  changeFavorite(i: number) {
    this.piscicultorgranjas[i].esfavorita =
      this.piscicultorgranjas[i].esfavorita == 1 ? 0 : 1;
    this.granjasService
      .esFavorita(this.piscicultorgranjas[i].id_granja)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (err) => {
          console.log(err);
          this.piscicultorgranjas[i].esfavorita =
            this.piscicultorgranjas[i].esfavorita == 1 ? 0 : 1;
        }
      );
  }
  showResenas(idGranja: number) {
    this.granjasService.showResenasModal('Reseñas', 'Cerrar', idGranja);
  }
}

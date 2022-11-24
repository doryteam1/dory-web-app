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
  piscicultorDetalleAsociacioneshowNotFound: boolean = false;
  piscicultorDetalleGranjasshowNotFound: boolean = false;
  piscicultorDetalleshowError: boolean = false;
  piscicultorDetalleAsociacioneshowError: boolean = false;
  piscicultorDetalleGranjasshowError: boolean = false;
  errorMessage = '';
  activatelistasociacion: boolean = false;
  piscicultorDetalleGranjaschangeItem: boolean = true;
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
    this.piscicultorDetalleAsociaciones();
  }
  async piscicultorDetalleGranjas() {
    try {
      let response = await this.piscicultoresService
        .getPiscicultorDetalleGranjas(this.selectedPiscicultorId)
        .toPromise();
      this.piscicultorgranjas = response.data;
      console.log(this.piscicultorgranjas);
      if (response.data.length >= 0) {
        this.piscicultorDetalleGranjasshowError = false;
        this.piscicultorDetalleGranjasshowNotFound = false;
        this.piscicultorDetalleGranjaschangeItem = false;
      } else {
        this.piscicultorDetalleGranjasshowNotFound = true;
        this.piscicultorDetalleGranjasshowError = false;
        this.piscicultorDetalleGranjaschangeItem = false;
      }
    } catch (err: any) {
      this.piscicultorDetalleGranjasshowNotFound = false;
      this.piscicultorDetalleGranjasshowError = false;
      this.piscicultorDetalleGranjaschangeItem = false;
      if (err.status == 404) {
        this.piscicultorDetalleGranjasshowNotFound = true;
      } else {
        this.piscicultorDetalleGranjasshowError = true;
        this.errorMessage = 'Error inesperado';
      }
    }
  }
  async piscicultorDetalleAsociaciones() {
    try {
      let response = await this.piscicultoresService
        .getPiscicultorDetalleAsociaciones(this.selectedPiscicultorId)
        .toPromise();
      this.piscicultorasociaciones = response.data;
      await this.piscicultorDetalleGranjas();
      if (response.data.length > 0) {
        this.piscicultorDetalleAsociacioneshowError = false;
        this.piscicultorDetalleAsociacioneshowNotFound = false;
      } else {
        this.piscicultorDetalleAsociacioneshowNotFound = true;
        this.piscicultorDetalleAsociacioneshowError = false;
      }
    } catch (err: any) {
      this.piscicultorDetalleAsociacioneshowNotFound = false;
      this.piscicultorDetalleAsociacioneshowError = false;
      if (err.status == 404) {
        this.piscicultorDetalleAsociacioneshowNotFound = true;
      } else {
        this.piscicultorDetalleAsociacioneshowError = true;
        this.errorMessage = 'Error inesperado';
      }
    }
  }



  openAsocia(){
    if(this.activatelistasociacion){
      this.activatelistasociacion = false;
    }else{
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

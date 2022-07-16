import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PiscicultoresService } from '../../services/piscicultores.service';
import { Router } from '@angular/router';

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
  activatelistgranja: boolean = true;
  activatelistasociacion: boolean = false;
  piscicultorDetalleAsociacioneschangeItem: boolean = true;
  piscicultorDetalleGranjaschangeItem: boolean = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private piscicultoresService: PiscicultoresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedPiscicultorId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    console.log(this.selectedPiscicultorId);
    this.piscicultoresService
      .getPiscicultorDetalle(this.selectedPiscicultorId)
      .subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.piscicultor = response.data[0];
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

    this.piscicultoresService
      .getPiscicultorDetalleAsociaciones(this.selectedPiscicultorId)
      .subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.piscicultorasociaciones = response.data;
            console.log(this.piscicultorasociaciones);
            this.piscicultorDetalleAsociacioneshowError = false;
            this.piscicultorDetalleAsociacioneshowNotFound = false;
            this.piscicultorDetalleAsociacioneschangeItem = false;
          } else {
            this.piscicultorDetalleAsociacioneshowNotFound = true;
            this.piscicultorDetalleAsociacioneshowError = false;
            this.piscicultorDetalleAsociacioneschangeItem = false;
          }
        },
        (err) => {
          this.piscicultorDetalleAsociacioneshowNotFound = false;
          this.piscicultorDetalleAsociacioneshowError = false;
          this.piscicultorDetalleAsociacioneschangeItem = false;
          if (err.status == 404) {
            this.piscicultorDetalleAsociacioneshowNotFound = true;
          } else {
            this.piscicultorDetalleAsociacioneshowError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );

    this.piscicultoresService
      .getPiscicultorDetalleGranjas(this.selectedPiscicultorId)
      .subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.piscicultorgranjas = response.data;
            console.log(this.piscicultorgranjas);
            this.piscicultorDetalleGranjasshowError = false;
            this.piscicultorDetalleGranjasshowNotFound = false;
            this.piscicultorDetalleGranjaschangeItem = false;
          } else {
            this.piscicultorDetalleGranjasshowNotFound = true;
            this.piscicultorDetalleGranjasshowError = false;
            this.piscicultorDetalleGranjaschangeItem = false;
          }
        },
        (err) => {
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
      );
  }
  activeTab(i: number) {
    if (i == 1) {
      this.activatelistgranja = true;
      this.activatelistasociacion = false;
    } else if (i == 2) {
      this.activatelistasociacion = true;
      this.activatelistgranja = false;
    }
  }
  goAssociationDetail(asociacion: any) {
    this.router.navigateByUrl(
      '/asociaciones/municipio/detalle/' + asociacion.nit
    );
  }
  goDetailFarm(granja: any) {
    this.router.navigateByUrl('/granjas/municipio/detalle/' + granja.id_granja);
  }
}

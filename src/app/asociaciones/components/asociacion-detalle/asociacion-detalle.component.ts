import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';
import { AsociacionesService } from '../../services/asociaciones.service';
import * as dayjs from 'dayjs';
import 'dayjs/locale/es';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

@Component({
  selector: 'app-asociacion-detalle',
  templateUrl: './asociacion-detalle.component.html',
  styleUrls: ['./asociacion-detalle.component.scss'],
})
export class AsociacionDetalleComponent implements OnInit {
  selectedAsociacionnit: number = -1;
  asociacion: any;
  piscicultorasociaciones: any;
  piscicultorgranjas: any;
  showNotFound: boolean = false;
  showError: boolean = false;
  errorMessage = '';
  activatelistgranja: boolean = true;
  activatelistasociacion: boolean = false;
  changeItem: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private asociacionesService: AsociacionesService,
    private router: Router,
    private piscicultoresService: PiscicultoresService,
    private pescadoresService: PescadoresService
  ) {}

  ngOnInit(): void {
    this.selectedAsociacionnit = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.asociacionesService
      .getAsociacionDetalle(this.selectedAsociacionnit)
      .subscribe(
        (response) => {
          if (response.data.length > 0) {
            this.asociacion = response.data[0];
            console.log(this.asociacion);

            /* 2022-07-09T00:00:00.000Z */
            this.showError = false;
            this.showNotFound = false;
          } else {
            this.showNotFound = true;
            this.showError = false;
          }
        },
        (err) => {
          this.showNotFound = false;
          this.showError = false;
          if (err.status == 404) {
            this.showNotFound = true;
          } else {
            this.showError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );

    this.piscicultoresService
      .getPiscicultorPorAsociacion(this.selectedAsociacionnit)
      .subscribe(
        (response) => {
          if (response.data.length > 0) {
            this.piscicultorasociaciones = response.data;
            console.log(
              `piscicultores por asociacion ${this.piscicultorasociaciones} `
            );
            console.log(this.piscicultorasociaciones);
            this.showError = false;
            this.showNotFound = false;
            this.changeItem = false;
          } else {
            this.showNotFound = true;
            this.showError = false;
            this.changeItem = false;
          }
        },
        (err) => {
          this.showNotFound = false;
          this.showError = false;
          this.changeItem = false;
          if (err.status == 404 || err.status == 500) {
            this.showNotFound = true;
          } else {
            this.showError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );

    this.pescadoresService
      .getPescadoresPorAsociacion(this.selectedAsociacionnit)
      .subscribe(
        (response) => {
          console.log(response);
          /*    if (response.data.length > 0) {
            this.piscicultorgranjas = response.data;
            this.showError = false;
            this.showNotFound = false;
            this.changeItem = false;
          } else {
            this.showNotFound = true;
            this.showError = false;
            this.changeItem = false;
          } */
        },
        (err) => {
          this.showNotFound = false;
          this.showError = false;
          this.changeItem = false;
          if (err.status == 404 || err.status == 500) {
            this.showNotFound = true;
          } else {
            this.showError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );
  }
  dayjsx(data: string, forma: string, local: string) {
    return dayjs(data).locale(local).format(forma);
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
  gopiscicultorDetail(piscicultor: any) {
    console.log(piscicultor);
    this.router.navigateByUrl(
      'piscicultores/municipio/detalle/' + piscicultor.id
    );
  }
  goDetalleRepresentante() {
    console.log('representante legal');

    console.log(this.asociacion.tipo_propietario);
    if (this.asociacion.tipo_propietario == 'Pescador') {
      this.router.navigateByUrl(
        '/pescadores/municipio/detalle/' + this.asociacion.id_propietario
      );
    } else if (this.asociacion.tipo_propietario == 'Piscicultor') {
      this.router.navigateByUrl(
        '/piscicultores/municipio/detalle/' + this.asociacion.id_propietario
      );
    }
  }
  /*   gopescadorDetail(pescador: any) {
    this.router.navigateByUrl('/granjas/municipio/detalle/' + granja.id_granja);
  } */
}

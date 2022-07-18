import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';
import { AsociacionesService } from '../../services/asociaciones.service';


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
  piscicultorshowNotFound: boolean = false;
  pescadorshowNotFound: boolean = false;
  asociacionesshowNotFound: boolean = false;
  asociacionesshowError: boolean = false;
  pescadorshowError: boolean = false;
  piscicultorshowError: boolean = false;
  errorMessage = '';
  activatelistgranja: boolean = true;
  activatelistasociacion: boolean = false;
  pescadorchangeItem: boolean = true;
  piscicultorchangeItem: boolean = true;
  pescadorasociaciones: any;
  datapiscicultorasociaciones: boolean=false;

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
          console.log(this.selectedAsociacionnit)
          console.log(response)
          this.asociacion = response.data[0];
          console.log(this.asociacion)
          if (response.data.length > 0) {
            this.asociacionesshowError = false;
            this.asociacionesshowNotFound = false;
          } else {
            this.asociacionesshowNotFound = true;
            this.asociacionesshowError = false;

          }
        },
        (err) => {
           console.log('hhuelo');
          this.asociacionesshowNotFound = false;
          this.asociacionesshowError = false;
          if (err.status == 404) {
            this.asociacionesshowNotFound = true;
          } else {
            this.asociacionesshowError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );

    this.piscicultoresService
      .getPiscicultorPorAsociacion(this.selectedAsociacionnit)
      .subscribe(
        (response:any) => {
          if (response.data.length > 0) {
            this.piscicultorasociaciones = response.data;
            console.log(
              `piscicultores por asociacion ${this.piscicultorasociaciones} `
            );
            console.log(this.piscicultorasociaciones);
            this.piscicultorshowError = false;
            this.piscicultorshowNotFound = false;
            this.piscicultorchangeItem = false;
          } else {
            this.piscicultorshowNotFound = true;
            this.piscicultorshowError = false;
             this.piscicultorchangeItem = false;
          }
        },
        (err) => {
          console.log("hello")
          this.piscicultorshowNotFound = false;
          this.piscicultorshowError = false;
          this.piscicultorchangeItem = false;
          if (err.status == 404 ) {
            this.piscicultorshowNotFound = true;
          } else {
            this.piscicultorshowError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );

    this.pescadoresService
      .getPescadoresPorAsociacion(this.selectedAsociacionnit)
      .subscribe(
        (response:any) => {
          console.log(response);
             if (response.data.length > 0) {
            this.pescadorasociaciones = response.data;
            this.pescadorshowError = false;
            this.pescadorshowNotFound = false;
            this.pescadorchangeItem = false;
          } else {
            this.pescadorshowNotFound = true;
            this.pescadorshowError = false;
            this.pescadorchangeItem = false;
          }
        },
        (err) => {
          this.pescadorshowNotFound = false;
          this.pescadorshowError = false;
          this.pescadorchangeItem = false;
          if (err.status == 404 ) {
            this.pescadorshowNotFound = true;
          } else {
            this.pescadorshowError = true;
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
  gopiscicultorDetail(piscicultor: any) {
    console.log(piscicultor);
    this.router.navigateByUrl(
      'piscicultores/municipio/detalle/' + piscicultor.id
    );
  }
  gopescadorDetail(pescador: any) {
    console.log(pescador);
    this.router.navigateByUrl(
      'pescadores/municipio/detalle/' + pescador.id
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
}

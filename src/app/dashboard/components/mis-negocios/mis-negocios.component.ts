import { Component, OnInit ,  ElementRef,
  OnDestroy,
 } from '@angular/core';
import { PlacesService } from 'src/app/services/places.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import {  Subscription} from 'rxjs';
import { NegociosService } from 'src/app/services/negocios.service';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
import { ComunicacionEntreComponentesService } from 'src/app/shared/services/comunicacion-entre-componentes.service';
const _ = require('lodash');
import { limiteMapa } from 'src/models/limiteMapaGoogle.model';
@Component({
  selector: 'app-mis-negocios',
  templateUrl: './mis-negocios.component.html',
  styleUrls: ['./mis-negocios.component.scss'],
})
export class MisNegociosComponent implements OnInit,OnDestroy {
  negocios: Array<any> = [];
  showNotFound: boolean = false;
  indicenegocio!: number;
  noexistendatos: boolean = false;
  p!: number;
  authUserId: number = -1;
  negocio: any;
  constructor(
    private negociosService: NegociosService,
    private places: PlacesService,
    private appModalService: AppModalService,
    public platformLocation: PlatformLocation,
    private router: Router,
    private comunicacionEntreComponentesService: ComunicacionEntreComponentesService
  ) {

  }
    public datosGoogleMap!: Subscription;
  ngOnInit(): void {
             this.datosGoogleMap =
               this.comunicacionEntreComponentesService.changeArray.subscribe(
                 (datos) => {
                    this.negociosService
                      .updateParcialNegocio(this.negocios[this.indicenegocio!].id_negocio, {
                         latitud: datos[0].latitud,
                         longitud: datos[0].longitud,
                         id_municipio: datos[0].id_municipio,
                         direccion: datos[0].direccion,
                       })
                     .subscribe(
                       (response) => {
                        this.AutoNgOnInit()
                       },
                       (err) => {
                         console.log(err);
                       }
                     );
                 }
               );
    this.AutoNgOnInit();
  }
  ngOnDestroy(): void {
    this.datosGoogleMap?.unsubscribe();
  }
  AutoNgOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    console.log(this.authUserId);
    this.negociosService.getNegociosByUserId(payload.sub).subscribe(
      (respose) => {
        this.negocios = respose.data;
        if (this.negocios.length < 1 || this.negocios.length == 0) {
          this.showNotFound = true;
        }
      },
      (err) => {
        if (err.status == 404) {
          this.showNotFound = true;
        }
      }
    );
  }

  deleteNegocio(negocio: any) {
    this.appModalService
      .confirm(
        'Eliminar negocio',
        'Esta seguro que desea eliminar este negocio',
        'Eliminar',
        'Cancelar',
        negocio.nombre
      )
      .then((result) => {
        if (result == true) {
          this.negociosService.deleteNegocio(negocio.id_negocio).subscribe(
            (response: any) => {
              let index = this.negocios.findIndex(
                (element) => element.id_negocio == negocio.id_negocio
              );
              this.negocios.splice(index, 1);
              if (this.negocios.length <= 0) {
                this.showNotFound = true;
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
  verMap(idNegocio?: number) {
    let index = this.negocios.findIndex(
      (negocio) => negocio.id_negocio == idNegocio /* negocio.id_negocio */
    );
    this.indicenegocio = index;

   let modalheadergooglemap = false;
   let mapaSeach = true;
   let limiteMapa: limiteMapa = {
     limite: 'Sucre',
     nivDivAdm: 'Departamento',
     id_departamento: 70,
   };
   let atributos = {
     longAndLat: {
       lat: parseFloat(this.negocios[index!].latitud),
       lng: parseFloat(this.negocios[index!].longitud),
     },
   };
   this.platformLocation.onPopState(() => {
     this.appModalService.CloseGoogleMapGeneralModal();
   });
   this.appModalService
     .GoogleMapModalGeneral(
       atributos,
       modalheadergooglemap,
       '',
       mapaSeach,
       limiteMapa
     )
     .then((result) => {})
     .catch((result) => {});
  }
  createNewNegocio() {
    let object = {
      action: 'create',
      formState: 'enable',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/negocio/detalle', object]);
  }
  editarNegocio(negocio: any) {
    let object: any = { ...negocio };
    (object.action = 'update'), (object.authUserId = this.authUserId);
    this.router.navigate(['/dashboard/negocio/detalle', object]);
  }
}

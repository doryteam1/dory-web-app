import { Component, OnDestroy, OnInit } from '@angular/core';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { ComunicacionEntreComponentesService } from 'src/app/shared/services/comunicacion-entre-componentes.service';
import { limiteMapa } from 'src/models/limiteMapaGoogle.model';
const _ = require('lodash');
@Component({
  selector: 'app-mis-granjas',
  templateUrl: './mis-granjas.component.html',
  styleUrls: ['./mis-granjas.component.scss'],
})
export class MisGranjasComponent implements OnInit, OnDestroy {
  granjas: Array<any> = [];
  showNotFound: boolean = false;
  indicegranja!: number;
  noexistendatos: boolean = false;
  p!: number;
  itemUpdateIndex: number = -1;
  infraestructurasData: Array<any> = [];
  especiesData: Array<any> = [];
  authUserId: number = -1;
  timeLapsed1: number = 0;
  constructor(
    private granjaService: GranjasService,
    private appModalService: AppModalService,
    private router: Router,
    public location: PlatformLocation,
    private comunicacionEntreComponentesService: ComunicacionEntreComponentesService
  ) {}
  public datosGoogleMap!: Subscription;
  ngOnInit(): void {
    this.datosGoogleMap =
      this.comunicacionEntreComponentesService.changeArray.subscribe(
        (datos) => {
          this.granjaService
            .updateParcial(this.granjas[this.indicegranja!].id_granja, {
              latitud: datos[0].latitud,
              longitud: datos[0].longitud,
              id_municipio: datos[0].id_municipio,
              direccion: datos[0].direccion,
            })
            .subscribe(
              (response) => {
                this.autorecarga();
              },
              (err) => {
                console.log(err);
              }
            );
        }
      );
    this.autorecarga();
  }
  ngOnDestroy(): void {
    this.datosGoogleMap?.unsubscribe();
  }
  autorecarga(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.granjaService.getGranjaByUserId(payload.sub).subscribe(
      (respose) => {
        this.granjas = respose.data;
        if (this.granjas.length < 1 || this.granjas.length == 0) {
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
  deleteGranja(idGranja: number) {
    let index = this.granjas.findIndex((granja: any) => {
      return granja.id_granja == idGranja;
    });
    this.appModalService
      .confirm(
        'Eliminar granja',
        'Esta seguro que desea eliminar la granja',
        'Eliminar',
        'No estoy seguro',
        this.granjas[index].nombre
      )
      .then((result) => {
        if (result == true) {
          this.granjaService.deleteGranja(idGranja).subscribe(
            (response: any) => {
              this.granjas.splice(index, 1);
              if (this.granjas.length <= 0) {
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
  verMap(idGranja?: number) {
    let index = this.granjas.findIndex((granja: any) => {
      return granja.id_granja == idGranja;
    });
    this.indicegranja = index!;
    let modalheadergooglemap = false;
    let mapaSeach = true;
    let limiteMapa: limiteMapa = {
      limite: 'Sucre',
      nivDivAdm: 'Departamento',
      id_departamento: 70,
    };
    let atributos = {
      longAndLat: {
        lat: parseFloat(this.granjas[index!].latitud),
        lng: parseFloat(this.granjas[index!].longitud),
      },
    };
    this.location.onPopState(() => {
      this.appModalService.CloseGoogleMapGeneralModal();
    });
    this.appModalService
      .GoogleMapModalGeneral(atributos, modalheadergooglemap, '', mapaSeach,limiteMapa)
      .then((result) => {})
      .catch((result) => {});
  }
  createNewGranja() {
    let object = {
      action: 'create',
      formState: 'enable',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/granja/detalle', object]);
  }
  editarGranja(granja: any, formState: string) {
    let object: any = { ...granja };
    (object.action = 'update'),
      (object.formState = formState),
      (object.authUserId = this.authUserId);
    this.router.navigate(['/dashboard/granja/detalle', object]);
  }
}

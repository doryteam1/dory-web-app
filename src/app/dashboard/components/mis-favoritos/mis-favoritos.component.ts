import { Component,  OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { PlatformLocation } from '@angular/common';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
  selector: 'app-mis-favoritos',
  templateUrl: './mis-favoritos.component.html',
  styleUrls: ['./mis-favoritos.component.scss'],
})
export class MisFavoritosComponent implements OnInit, OnDestroy {
  misGranjaFavoritas: any[] = [];
  showNotFound: boolean = false;
  misfavoritoscargados: boolean = false;
  sinfavoritos: boolean = false;
  modalGogleMapOpen: boolean = false;
  constructor(
    private granjasService: GranjasService,
    private router: Router,
    private appModalService: AppModalService,
    public location: PlatformLocation,
    public mediaQueryService: MediaQueryService
  ) {}
  mediaQuery1!: Subscription;
  mediaQuery2!: Subscription;
  ngOnInit(): void {
    registerLocaleData(es);
    this.granjasService.misFavoritas().subscribe(
      (response) => {
        this.misfavoritoscargados = true;
        this.misGranjaFavoritas = response.data;
        if (this.misGranjaFavoritas.length < 1) {
          this.showNotFound = true;
        }
      },
      (err) => {
        this.showNotFound = true;
        console.log(err)
      }
    );
    this.mediaQuery2 = this.mediaQueryService
      .mediaQuery('min-width: 1100px')
      .subscribe((matches) => {
        if (matches && this.modalGogleMapOpen) {
          this.appModalService.CloseGoogleMapGeneralModal();
        } else {
          this.appModalService.CloseGoogleMapModal();
        }
      });
  }

  ngOnDestroy(): void {
    this.mediaQuery2.unsubscribe();
  }
  changeFavorite(i: number) {
    this.appModalService
      .confirm(
        'Eliminar de favoritos',
        'Esta seguro que desea quitar esta granja de mis favoritos',
        'Sí',
        'No'
      )
      .then((result) => {
        if (result == true) {
          this.misGranjaFavoritas[i].esfavorita =
            this.misGranjaFavoritas[i].esfavorita == 1 ? 0 : 1;
          this.granjasService
            .esFavorita(this.misGranjaFavoritas[i].id_granja)
            .subscribe(
              (response) => {
                this.misGranjaFavoritas.splice(i, 1);
                if (this.misGranjaFavoritas.length <= 0) {
                  this.sinfavoritos = true;
                }
                console.log(response);
              },
              (err) => {
                console.log(err);
                this.misGranjaFavoritas[i].esfavorita =
                  this.misGranjaFavoritas[i].esfavorita == 1 ? 0 : 1;
              }
            );
        }
      })
      .catch((result) => {});
  }

  navigate(granja: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/granjas/municipio/detalle/${granja?.id_granja}`,
      ])
    );
    window.open(url, '_blank');
  }
  seeFarmsMap() {
    this.modalGogleMapOpen = true;
    let atributos = this.misGranjaFavoritas;
    let modalheadergooglemap = false;
    let shared = true;
    let iconMarkerGoogleMap = 'assets/icons/Groupfavoritowhite.svg';
    let iconMarkerGoogleMap2 = 'assets/icons/Groupfavoritoblue.svg';
    this.location.onPopState(() => {
      this.appModalService.CloseGoogleMapModal();
    });
    this.appModalService
      .GoogleMapModal(
        atributos,
        modalheadergooglemap,
        shared,
        iconMarkerGoogleMap,
        iconMarkerGoogleMap2
      )
      .then((result) => {
        if (this.misGranjaFavoritas.length <= 0) {
          this.sinfavoritos = true;
        }
        this.modalGogleMapOpen = false;
      })
      .catch((result) => {
        this.modalGogleMapOpen = false;
      });
  }
  /*  */
  showResenas(idGranja: number) {
    this.granjasService.showResenasModal('Reseñas', 'Cerrar', idGranja);
  }
}

import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { PlatformLocation } from '@angular/common';
@Component({
  selector: 'app-mis-favoritos',
  templateUrl: './mis-favoritos.component.html',
  styleUrls: ['./mis-favoritos.component.scss'],
})
export class MisFavoritosComponent implements OnInit {
  misGranjaFavoritas: any[] = [];
  showNotFound: boolean = false;
  misfavoritoscargados: boolean = false;
  sinfavoritos: boolean = false;
  constructor(
    private granjasService: GranjasService,
    private router: Router,
    private appModalService: AppModalService,
    public location: PlatformLocation
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);
    this.granjasService.misFavoritas().subscribe(
      (response) => {
        this.misfavoritoscargados = true;
        this.misGranjaFavoritas = response.data;

        if (this.misGranjaFavoritas.length < 1) {
          this.showNotFound = true;
        }
        console.log(this.misGranjaFavoritas);
      },
      (err) => {}
    );
  }

  changeFavorite(i: number) {
    this.appModalService
      .confirm(
        'Eliminar de favoritos',
        'Esta seguro que desea quitar esta granja de mis favoritos',
        'Eliminar',
        'No estoy seguro'
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

  navigate(i: number) {
    // Converts the route into a string that can be used
    // with the window.open() function
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/granjas/municipio/detalle/${this.misGranjaFavoritas[i].id_granja}`,
      ])
    );
    window.open(url, '_blank');
  }
  seeFarmsMap() {
    let atributos = this.misGranjaFavoritas;
    let modalheadergooglemap = false;
    let mapElementVarios = true;
     let iconMarkerGoogleMap = 'assets/icons/Groupfavoritowhite.svg';
     let iconMarkerGoogleMap2 = 'assets/icons/Groupfavoritoblue.svg';
    this.location.onPopState(() => {
      this.appModalService.CloseGoogleMapModal();
    });
    this.appModalService
      .GoogleMapModal(
        atributos,
        modalheadergooglemap,
        mapElementVarios,
        iconMarkerGoogleMap,
        iconMarkerGoogleMap2
      )
      .then((result) => {
        if (this.misGranjaFavoritas.length <= 0) {
          this.sinfavoritos = true;
        }
      })
      .catch((result) => {});
  }
  seeFarmsMaptwo(i:number){
        let atributos = this.misGranjaFavoritas[i];
        let modalheadergooglemap = false;
        let mapElementVarios = false;
        let iconMarkerGoogleMap = 'assets/icons/Groupfavoritoblue.svg';
       /*  let iconMarkerGoogleMap =
           "i == indexSelected ? 'assets/icons/fish-marker-red.svg' : 'assets/icons/fish-marker.svg' "; */
        this.location.onPopState(() => {
          this.appModalService.CloseGoogleMapModal();
        });
        this.appModalService
          .GoogleMapModal(
            atributos,
            modalheadergooglemap,
            mapElementVarios,
            iconMarkerGoogleMap,
            '',
          )
          .then((result) => {
            if (this.misGranjaFavoritas.length <= 0) {
              this.sinfavoritos = true;
            }
          })
          .catch((result) => {});

  }
  showResenas(idGranja: number) {
    this.granjasService.showResenasModal('Reseñas', 'Cerrar', idGranja);
  }
}

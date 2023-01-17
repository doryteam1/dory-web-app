
import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppModalService } from '../../services/app-modal.service';
@Component({
  selector: 'app-card-granjas',
  templateUrl: './card-granjas.component.html',
  styleUrls: ['./card-granjas.component.scss'],
})
export class CardGranjasComponent implements OnInit {
  @Input() granja: any;
  @Input() index: any;
  @Input() favorita: any;
  @Input() granjaMunici: boolean = true;
  @Input() resena: any;
  @Input() botonMapaFijo: boolean = true;
  @Input() botonFavorito: boolean = true;
  @Input() myclass: boolean = false;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onEliminInfoWindow: EventEmitter<any> = new EventEmitter();
  @Output() onMouseCard: EventEmitter<any> = new EventEmitter();
  @Output() onShowResenas: EventEmitter<any> = new EventEmitter();
  @Output() onChangeFavorite: EventEmitter<any> = new EventEmitter();
  constructor(
    public location2: PlatformLocation,
    private appModalService: AppModalService
  ) {}
  ngOnInit(): void {}
  detalle() {
    this.onDetalle.emit();
  }
  mouseCard() {
    this.onMouseCard.emit();
  }
  eliminInfoWindow() {
    this.onEliminInfoWindow.emit();
  }
  showResenas() {
    this.onShowResenas.emit();
  }
  changeFavorite() {
    this.onChangeFavorite.emit();
  }
  seeFarmsMaptwo() {
    let modalheadergooglemap = false;
    let shared = false;
    let atributos = {
      longAndLat: {
        lat: this.granja.latitud,
        lng: this.granja.longitud,
      },
      mapInfoWindowData: [
        {
          icon: 'assets/icons/person_black.svg',
          dataNombre: this.granja.nombre,
          sinDataNombre: 'Nombre indefinido',
        },
        {
          icon: 'assets/icons/person_pin_circle_black_24dp.svg',
          dataNombre: this.granja.direccion,
          sinDataNombre: 'Dirección indefinida',
        },
      ],
      nombreAtributo: {
        dato1: 'Compartir ubicación de la granja',
      },
    };
    let iconMarkerGoogleMap = 'assets/icons/fish-marker.svg';
    this.location2.onPopState(() => {
      this.appModalService.CloseGoogleMapGeneralModal();
    });
    this.appModalService
      .GoogleMapModalGeneral(
        atributos,
        modalheadergooglemap,
        iconMarkerGoogleMap,
        false,
        '',
        shared
      )
      .then((result) => {})
      .catch((result) => {});
  }
}

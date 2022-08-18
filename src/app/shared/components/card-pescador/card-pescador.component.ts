import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppModalService } from '../../services/app-modal.service';

@Component({
  selector: 'app-card-pescador',
  templateUrl: './card-pescador.component.html',
  styleUrls: ['./card-pescador.component.scss'],
})
export class CardPescadorComponent implements OnInit {
  @Input() pescador: any;
  @Input() mapa: boolean = false;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onMouseOutCard: EventEmitter<any> = new EventEmitter();
  @Output() onMouseInsideCard: EventEmitter<any> = new EventEmitter();
  constructor(
    private appModalService: AppModalService,
    public location2: PlatformLocation
  ) {}

  ngOnInit(): void {}
  seeFarmsMaptwo() {
    let modalheadergooglemap = false;
    let atributos = {
      longAndLat: {
        lat: this.pescador.latitud,
        lng: this.pescador.longitud,
      },
      mapInfoWindowData: [
        {
          icon: 'assets/icons/person_black.svg',
          dataNombre: this.pescador.nombre,
          sinDataNombre: 'Nombre indefinido',
        },
        {
          icon: 'assets/icons/person_pin_circle_black_24dp.svg',
          dataNombre: this.pescador.direccion,
          sinDataNombre: 'Dirección indefinida',
        },
      ],
    };
    let iconMarkerGoogleMap = 'assets/icons/person_pin_circle_red_24dp.svg';
    this.location2.onPopState(() => {
      this.appModalService.CloseGoogleMapGeneralModal();
    });
    this.appModalService
      .GoogleMapModalGeneral(
        atributos,
        modalheadergooglemap,
        iconMarkerGoogleMap
      )
      .then((result) => {})
      .catch((result) => {});
  }
  detalle(pescador: any) {
    return this.onDetalle.emit(pescador);
  }
  mouseOutCard() {
    return this.onMouseOutCard.emit('Fuera de la targeta');
  }
  mouseInsideCard(pescador: any) {
    return this.onMouseInsideCard.emit(pescador);
  }
}

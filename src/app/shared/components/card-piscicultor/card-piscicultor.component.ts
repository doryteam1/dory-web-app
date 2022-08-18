import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppModalService } from '../../services/app-modal.service';

@Component({
  selector: 'app-card-piscicultor',
  templateUrl: './card-piscicultor.component.html',
  styleUrls: ['./card-piscicultor.component.scss'],
})
export class CardPiscicultorComponent implements OnInit {
  @Input() piscicultor: any;
  @Input() mapa: boolean=false;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onMouseOutCard: EventEmitter<any> = new EventEmitter();
  @Output() onMouseInsideCard: EventEmitter<any> = new EventEmitter();
  constructor(
    private appModalService: AppModalService,
    public location2: PlatformLocation
  ) {}

  ngOnInit(): void {}

  detalle(piscicultor: any) {
    return this.onDetalle.emit(piscicultor);
  }
  seeFarmsMaptwo() {
    let modalheadergooglemap = false;
    let atributos = {
      longAndLat: {
        lat: this.piscicultor.latitud,
        lng: this.piscicultor.longitud,
      },
      mapInfoWindowData: [
        {
          icon: 'assets/icons/person_black.svg',
          dataNombre: this.piscicultor.nombre,
          sinDataNombre: 'Nombre indefinido',
        },
        {
          icon: 'assets/icons/person_pin_circle_black_24dp.svg',
          dataNombre: this.piscicultor.direccion,
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
        iconMarkerGoogleMap,
      )
      .then((result) => {})
      .catch((result) => {});
  }
  mouseOutCard() {
    return this.onMouseOutCard.emit('Fuera de la targeta');
  }
  mouseInsideCard(piscicultor: any) {
    return this.onMouseInsideCard.emit(piscicultor);
  }
}

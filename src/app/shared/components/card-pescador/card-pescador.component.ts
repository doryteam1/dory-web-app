import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
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
  modalGogleMapOpen: boolean = false;
  shorterNumber: number = 12;
  shorterNumber2: number = 17;
  constructor(
    private appModalService: AppModalService,
    public location2: PlatformLocation
  ) {}

  ngOnInit(): void {}
  @HostListener('window:resize', ['$event']) mediaScreen(event: any) {
    if (event.target.innerWidth >= 1100) {
      if (this.modalGogleMapOpen) {
        this.appModalService.CloseGoogleMapModal();
      }
    }
    if (event.target.innerWidth <= 300) {
      this.shorterNumber = 8;
      this.shorterNumber2=12
    } else {
      this.shorterNumber = 12;
      this.shorterNumber2 = 17;
    }
  }
  seeFarmsMaptwo() {
    this.modalGogleMapOpen = true;
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
      .then((result) => {
        this.modalGogleMapOpen = false;
      })
      .catch((result) => {
        this.modalGogleMapOpen = false;
      });
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

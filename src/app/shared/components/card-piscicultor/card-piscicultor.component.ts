import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AppModalService } from '../../services/app-modal.service';

@Component({
  selector: 'app-card-piscicultor',
  templateUrl: './card-piscicultor.component.html',
  styleUrls: ['./card-piscicultor.component.scss'],
})
export class CardPiscicultorComponent implements OnInit {
  @Input() piscicultor: any;
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

  detalle(piscicultor: any) {
    return this.onDetalle.emit(piscicultor);
  }
  @HostListener('window:resize', ['$event']) mediaScreen(event: any) {
    if (event.target.innerWidth >= 1100) {
      if (this.modalGogleMapOpen) {
        this.appModalService.CloseGoogleMapModal();
      }
    }
    if (event.target.innerWidth <= 300) {
      this.shorterNumber = 8;
       this.shorterNumber2 = 12;
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
        iconMarkerGoogleMap
      )
      .then((result) => {
        this.modalGogleMapOpen = false;
      })
      .catch((result) => {
        this.modalGogleMapOpen = false;
      });
  }
  mouseOutCard() {
    return this.onMouseOutCard.emit('Fuera de la targeta');
  }
  mouseInsideCard(piscicultor: any) {
    return this.onMouseInsideCard.emit(piscicultor);
  }
}

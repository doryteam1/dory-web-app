import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { AppModalService } from '../../services/app-modal.service';

@Component({
  selector: 'app-card-pescador',
  templateUrl: './card-pescador.component.html',
  styleUrls: ['./card-pescador.component.scss'],
})
export class CardPescadorComponent implements OnInit, OnDestroy {
  @Input() pescador: any;
  @Input() mapa: boolean = false;
  @Input() myclass: boolean = false;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onMouseOutCard: EventEmitter<any> = new EventEmitter();
  @Output() onMouseInsideCard: EventEmitter<any> = new EventEmitter();
  modalGogleMapOpen: boolean = false;
  constructor(
    private appModalService: AppModalService,
    public location2: PlatformLocation,
    public mediaQueryService: MediaQueryService
  ) {}
  cardPescadmediaQuery1!: Subscription;
  ngOnDestroy(): void {
    this.cardPescadmediaQuery1.unsubscribe();
  }
  ngOnInit(): void {
    this.cardPescadmediaQuery1 = this.mediaQueryService
      .mediaQuery('min-width: 1100px')
      .subscribe((matches) => {
        if (matches && this.modalGogleMapOpen) {
          this.appModalService.CloseGoogleMapModal();
        }
      });
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
        iconMarkerGoogleMap,
        false,
        ''
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

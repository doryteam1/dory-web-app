import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { AppModalService } from '../../services/app-modal.service';

@Component({
  selector: 'app-card-piscicultor',
  templateUrl: './card-piscicultor.component.html',
  styleUrls: ['./card-piscicultor.component.scss'],
})
export class CardPiscicultorComponent implements OnInit, OnDestroy {
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
    public location2: PlatformLocation,
    public mediaQueryService: MediaQueryService
  ) {}
  cardPiscicuMediaQuery1!: Subscription;
  ngOnDestroy(): void {
    this.cardPiscicuMediaQuery1.unsubscribe();
  }

  ngOnInit(): void {
        this.cardPiscicuMediaQuery1 = this.mediaQueryService
          .mediaQuery('min-width: 1100px')
          .subscribe((matches) => {
            if (matches && this.modalGogleMapOpen) {
              this.appModalService.CloseGoogleMapModal();
            }
          });
  }

  detalle(piscicultor: any) {
    return this.onDetalle.emit(piscicultor);
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
  mouseOutCard() {
    return this.onMouseOutCard.emit('Fuera de la targeta');
  }
  mouseInsideCard(piscicultor: any) {
    return this.onMouseInsideCard.emit(piscicultor);
  }
}

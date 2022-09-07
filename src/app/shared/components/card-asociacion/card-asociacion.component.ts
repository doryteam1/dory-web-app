import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {  Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { MediaQueryService } from 'src/app/services/media-query.service';

@Component({
  selector: 'app-card-asociacion',
  templateUrl: './card-asociacion.component.html',
  styleUrls: ['./card-asociacion.component.scss'],
})
export class CardAsociacionComponent implements OnInit, OnDestroy {
  @Input() asociacion: any;
  @Input() delatecard!: boolean;
  @Input() showRepLegal: boolean = true;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onDetalleRepresentante: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  showNotFound: boolean = false;
  changeItem: boolean = true;
  piscicultorasociaciones: any;
  showError: boolean = false;
  errorMessage = '';
  ngOnlnitPiscicultorDetalle: boolean = false;
  foto_camaracpdf!: string;
  shorterNumber: number = 15;
  constructor(public mediaQueryService: MediaQueryService) {}
  cardAsociaMediaQuery1!: Subscription;

  ngOnInit(): void {
    this.cardAsociaMediaQuery1 = this.mediaQueryService
      .mediaQuery('max-width: 382px')
      .subscribe((matches) => {
        if (matches) {
          this.shorterNumber = 10;
        } else {
          this.shorterNumber = 15;
        }
      });
  }
  ngOnDestroy(): void {
    this.cardAsociaMediaQuery1.unsubscribe();
  }
  detalle(asociacion: any) {
    console.log(asociacion);
    return this.onDetalle.emit(asociacion);
  }

  eliminar(asociacion: any) {
    return this.onDelete.emit(asociacion);
  }
  goDetalleRepresentante(asociacion: any) {
    console.log(asociacion);
    return this.onDetalleRepresentante.emit(asociacion);
  }
}

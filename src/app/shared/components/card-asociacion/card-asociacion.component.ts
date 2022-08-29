import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-card-asociacion',
  templateUrl: './card-asociacion.component.html',
  styleUrls: ['./card-asociacion.component.scss'],
})
export class CardAsociacionComponent implements OnInit {
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
  ngOnInit(): void {}

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
  @HostListener('window:resize', ['$event']) mediaScreen(event: any) {
    if (event.target.innerWidth <= 382) {
      this.shorterNumber = 10;
    } else {
      this.shorterNumber = 15;
    }
  }
}

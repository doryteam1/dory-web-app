import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-vehiculo',
  templateUrl: './card-vehiculo.component.html',
  styleUrls: ['./card-vehiculo.component.scss'],
})
export class CardVehiculoComponent implements OnInit {
  @Input() datos: any;
  @Input() indiceDatos: any;
  @Input() editaAndEliminar: boolean = false;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onUpdateDatos: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteDatos: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    registerLocaleData(es);
  }
  goDetail() {
    this.onDetalle.emit(true);
  }
  updateProducto() {
    this.onUpdateDatos.emit();
  }
  deleteProducto() {
    this.onDeleteDatos.emit();
  }
}

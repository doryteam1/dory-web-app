import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-granja-simple',
  templateUrl: './card-granja-simple.component.html',
  styleUrls: ['./card-granja-simple.component.scss'],
})
export class CardGranjaSimpleComponent implements OnInit {
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

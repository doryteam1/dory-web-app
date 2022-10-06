import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-producto',
  templateUrl: './card-producto.component.html',
  styleUrls: ['./card-producto.component.scss'],
})
export class CardProductoComponent implements OnInit {
  @Input() producto: any;
  @Input() indiceProducto: any;
  @Input() editaAndEliminar: boolean = false;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onUpdateProducto: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteProducto: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
registerLocaleData(es);
  }
  goDetail() {
    this.onDetalle.emit(true);
  }
  updateProducto() {
    this.onUpdateProducto.emit()
  }
  deleteProducto(){
    this.onDeleteProducto.emit()
  }
}

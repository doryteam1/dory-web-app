
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-proveedor-simple',
  templateUrl: './card-proveedor-simple.component.html',
  styleUrls: ['./card-proveedor-simple.component.scss'],
})
export class CardProveedorSimpleComponent implements OnInit {
  @Input() dato: any;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
  }
  goDetail() {
    this.onDetalle.emit(true);
  }
}

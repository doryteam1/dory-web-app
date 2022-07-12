import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-pescador',
  templateUrl: './card-pescador.component.html',
  styleUrls: ['./card-pescador.component.scss'],
})
export class CardPescadorComponent implements OnInit {
  @Input() pescador: any;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onMouseOutCard: EventEmitter<any> = new EventEmitter();
  @Output() onMouseInsideCard: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

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

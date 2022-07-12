import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-piscicultor',
  templateUrl: './card-piscicultor.component.html',
  styleUrls: ['./card-piscicultor.component.scss'],
})
export class CardPiscicultorComponent implements OnInit {
  @Input() piscicultor: any;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onMouseOutCard: EventEmitter<any> = new EventEmitter();
  @Output() onMouseInsideCard: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  detalle(piscicultor: any) {
    return this.onDetalle.emit(piscicultor);
  }
  mouseOutCard() {
    return this.onMouseOutCard.emit('Fuera de la targeta');
  }
  mouseInsideCard(piscicultor: any) {
    return this.onMouseInsideCard.emit(piscicultor);
  }
}

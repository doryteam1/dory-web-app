
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-card-granjas',
  templateUrl: './card-granjas.component.html',
  styleUrls: ['./card-granjas.component.scss'],
})
export class CardGranjasComponent implements OnInit {
  @Input() granja: any;
  @Input() index: any;
  @Input() favorita: any;
  @Input() resena: any;
  @Input() botonMapaFijo:boolean=true;

  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onEliminInfoWindow: EventEmitter<any> = new EventEmitter();
  @Output() onMouseCard: EventEmitter<any> = new EventEmitter();
  @Output() onSeeFarmsMaptwo: EventEmitter<any> = new EventEmitter();
  @Output() onShowResenas: EventEmitter<any> = new EventEmitter();
  @Output() onChangeFavorite: EventEmitter<any> = new EventEmitter();
  constructor(
  ) {}
  ngOnInit(): void {
    console.log(this.granja)
  }
  detalle() {
    this.onDetalle.emit();
  }
  mouseCard() {
    this.onMouseCard.emit();
  }
  eliminInfoWindow() {
    this.onEliminInfoWindow.emit();
  }
  showResenas() {
    this.onShowResenas.emit();
  }
  seeFarmsMaptwo() {
    this.onSeeFarmsMaptwo.emit();
  }
  changeFavorite() {
    this.onChangeFavorite.emit()

  }
}

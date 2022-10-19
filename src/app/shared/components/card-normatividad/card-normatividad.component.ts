import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
interface norma {
  tipo?: any;
  nombre?: any;
  contenido?: any;
  url_descarga?: any;
  fecha?: any;
}

@Component({
  selector: 'app-card-normatividad',
  templateUrl: './card-normatividad.component.html',
  styleUrls: ['./card-normatividad.component.scss'],
})
export class CardNormatividadComponent implements OnInit {
  @Input() data: norma = {};
  @Input() editaAndEliminar: boolean = false;
  @Input() index: number = -1;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onUpdateCard: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteCard: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  openDetalle() {
    /*  this.onDetalle.emit() */
  }
  deleteCard() {
    this.onDeleteCard.emit();
  }
  editCard() {
    this.onUpdateCard.emit();
  }
  clisCard(url: any) {
    window.open(url, '_blank');
  }
}

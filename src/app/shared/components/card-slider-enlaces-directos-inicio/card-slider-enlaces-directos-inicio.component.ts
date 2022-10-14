import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
interface data {
  titulo?: string;
  subTitle?: data2[];
  subTitleNormal?: any;
  descripcion?: string;
  imagen?: string;
  urlEnlace?: any;
}
interface data2 {
  titulo?: any;
  detail?: any;
}

@Component({
  selector: 'app-card-slider-enlaces-directos-inicio',
  templateUrl: './card-slider-enlaces-directos-inicio.component.html',
  styleUrls: ['./card-slider-enlaces-directos-inicio.component.scss'],
})
export class CardSliderEnlacesDirectosInicioComponent implements OnInit {
  @Input() dato: data = {};
  @Input() editaAndEliminar: boolean = false;
  @Input() index: number = -1;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onUpdateCard: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteCard: EventEmitter<any> = new EventEmitter();
  constructor() {}
  ngOnInit(): void {}
  deleteCard() {
    this.onDeleteCard.emit();
  }
  editCard() {
    this.onUpdateCard.emit();
  }
  clisFotoSlide() {
    let url = this.dato?.urlEnlace;
    window.open(url, '_blank');
  }
}

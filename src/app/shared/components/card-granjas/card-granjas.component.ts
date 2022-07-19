
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PiscicultoresService } from '../../../piscicultores/services/piscicultores.service';

@Component({
  selector: 'app-card-granjas',
  templateUrl: './card-granjas.component.html',
  styleUrls: ['./card-granjas.component.scss'],
})
export class CardGranjasComponent implements OnInit {
  @Input() granja: any;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  showNotFound: boolean = false;
  changeItem: boolean = true;
  piscicultorgranjas: any;
  showError: boolean = false;
  errorMessage = '';
  ngOnlnitPiscicultorDetalle: boolean = false;
  ran!:number;
  constructor(private piscicultoresService: PiscicultoresService) {}
  ngOnInit(): void {
    this.ran = Math.floor(this.granja.fotos.length * Math.random());
  }
  detalle(granja: any) {
    return this.onDetalle.emit(granja);
  }
  changeFavorite(granja: any) {
    granja.esfavorita = granja.esfavorita == 1 ? 0 : 1;
    this.piscicultoresService.esFavorita(granja.id_granja).subscribe(
      (response) => {},
      (err) => {
        granja.esfavorita = granja.esfavorita == 1 ? 0 : 1;
      }
    );
  }
}

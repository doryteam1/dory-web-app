
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { PiscicultoresService } from '../../../piscicultores/services/piscicultores.service';

@Component({
  selector: 'app-card-granjas',
  templateUrl: './card-granjas.component.html',
  styleUrls: ['./card-granjas.component.scss'],
})
export class CardGranjasComponent implements OnInit, OnDestroy {
  @Input() granja: any;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  showNotFound: boolean = false;
  changeItem: boolean = true;
  piscicultorgranjas: any;
  showError: boolean = false;
  errorMessage = '';
  ngOnlnitPiscicultorDetalle: boolean = false;
  ran!: number;
  shorterNumber: number = 12;
  constructor(
    private piscicultoresService: PiscicultoresService,
    public mediaQueryService: MediaQueryService
  ) {}
  cardGranjaMediaQuery1!: Subscription;
  ngOnInit(): void {
    this.ran = Math.floor(this.granja.fotos.length * Math.random());
       this.cardGranjaMediaQuery1 = this.mediaQueryService
         .mediaQuery('max-width: 316px')
         .subscribe((matches) => {
           if (matches) {
             this.shorterNumber = 8;
           } else {
             this.shorterNumber = 12;
           }
         });
  }
  ngOnDestroy(): void {
    console.log("granja")
    this.cardGranjaMediaQuery1.unsubscribe();
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

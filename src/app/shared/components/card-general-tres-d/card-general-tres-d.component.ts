
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
interface data {
  titulo?: string;
  subTitle1?: string;
  subTitle2?: string;
  descripcion?: string;
  imagen?: string;
  arrayEnlaces?: [];
}
@Component({
  selector: 'app-card-general-tres-d',
  templateUrl: './card-general-tres-d.component.html',
  styleUrls: ['./card-general-tres-d.component.scss'],
})
export class CardGeneralTresDComponent implements OnInit {
  @Input() dato: data = {
    titulo: 'nombre',
    subTitle1: 'SubTitulo1',
    subTitle2: 'SubTitulo2',
    descripcion:
      '  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet nisi sequi soluta ex molestias, ea mollitia minima non atque deleniti maiores perspiciatis est ab quas voluptates expedita autem provident reprehenderit hic. Doloribus corrupti deleniti consequatur dolor possimus rerum, id suscipit esse obcaecati repudiandae deserunt pariatur ratione voluptatum, quidem voluptates atque culpa. Repellat beatae aliquid dignissimos doloribus ea maiores debitis nam, iure quo adipisci atque repudiandae dolore, dolor vero quae sequi sit provident optio at magni. Quibusdam reiciendis sapiente laborum reprehenderit facilis molestiae laudantium nostrum dolore aspernatur nulla omnis aut ut culpa rem, sint aliquam iste dolorum delectus earum eos pariatur?',
    imagen: 'assets/images/no-image-photography.svg',
    arrayEnlaces: [],
  };

  @Input() editaAndEliminar: boolean = false;
  @Input() index: number = -1;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onUpdateCard: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteCard: EventEmitter<any> = new EventEmitter();
  @ViewChild('Mycard') Mycard!: ElementRef;
  urlLinkedin: string = '';
  urlcvlac: string = '';
  constructor(private renderer: Renderer2) {}
  ngOnInit(): void {
    this.dato?.arrayEnlaces!.forEach((enlace: any) => {
      if (enlace?.includes('linkedin')) {
        this.urlLinkedin = enlace;
      }
      if (enlace?.includes('cvlac')) {
        this.urlcvlac = enlace;
      }
    });
  }
  openDetalle() {
    let card = this.Mycard?.nativeElement;
    if (card.className.includes('active')) {
      this.renderer.removeClass(card, 'active');
    } else {
      this.renderer.addClass(card, 'active');
    }
  }
  deleteCard() {
    this.onDeleteCard.emit();
  }
  editCard() {
    this.onUpdateCard.emit();
  }
}

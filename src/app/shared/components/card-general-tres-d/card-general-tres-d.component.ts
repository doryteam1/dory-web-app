
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
interface data {
  titulo?: string;
  subTitle?:data2 [];
  subTitleNormal?: any;
  descripcion?: string;
  imagen?: string;
  arrayEnlaces?: any [];
}
interface data2{
  titulo?:any,
  detail?:any
}
@Component({
  selector: 'app-card-general-tres-d',
  templateUrl: './card-general-tres-d.component.html',
  styleUrls: ['./card-general-tres-d.component.scss'],
})
export class CardGeneralTresDComponent implements OnInit {
  @Input() dato: data = {
  };
  @Input() editaAndEliminar: boolean = false;
  @Input() index: number = -1;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onUpdateCard: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteCard: EventEmitter<any> = new EventEmitter();
  @ViewChild('Mycard') Mycard!: ElementRef;
  urlLinkedin: string = '';
  urlcvlac: string = '';
  urlDefecto:string=''
  constructor(private renderer: Renderer2) {}
  ngOnInit(): void {
    this.dato.arrayEnlaces?.forEach((enlace: any) => {
      if (enlace?.includes('linkedin') || enlace?.includes('cvlac')) {
        if (enlace?.includes('linkedin')) {
          this.urlLinkedin = enlace;
        }
        if (enlace?.includes('cvlac')) {
          this.urlcvlac = enlace;
        }
      }else{
        this.urlDefecto=enlace
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

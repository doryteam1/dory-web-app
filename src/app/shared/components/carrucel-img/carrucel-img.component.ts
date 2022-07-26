import { SafeUrl } from '@angular/platform-browser';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-carrucel-img',
  templateUrl: './carrucel-img.component.html',
  styleUrls: ['./carrucel-img.component.scss'],
})
export class CarrucelImgComponent implements OnInit {
  @Input() imagenes:any | SafeUrl[]= [];
  @Input() imgselecmodal!: number;
  @Input() indicatorsphoto!: boolean;
  @Input() valorrows!: number;
  @Input() valorcolumns!: number;
  @Input() idtarge!: number;
  id!: string;
  idnumeral!: string;
  divrows!: string;
  divcolumns!: string;
  widthExp: number = 0;
  valorlengthfotos!: number;
  valorindiceactual!: number;
  posicionsliderleft!: string;
  posicionsliderleftindicatorssinfotos: string = 'relative';
  justyfycentercontent: string = 'none';
  fotooverslider:boolean=false
  @Output() valueResponseIndiceActualSlider: EventEmitter<number> =
    new EventEmitter();
  @Output() eventValueResponseClickFotoMiniSlider: EventEmitter<number> =
    new EventEmitter();
  @Output() eventValueResponseClickDivIndicadorSlider: EventEmitter<any> =
    new EventEmitter();
  @Output() eventValueResponseclickImagenItemSlider: EventEmitter<any> =
    new EventEmitter();
  @Output() eventClickOnPreviousOrNew: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.divrows = `repeat(12, ${this.valorrows}px)`;
    this.divcolumns = `repeat(12, ${this.valorcolumns}px)`;
    if (this.indicatorsphoto) {
      this.id = `carouselExampleCaptions${this.idtarge}`;
      this.idnumeral = `#carouselExampleCaptions${this.idtarge}`;
      if (this.imagenes.length > 4) {
        this.widthExp = 0;
      } else {
        this.justyfycentercontent = 'center';
      }
    } else if (!this.indicatorsphoto) {
      let idx = this.imgselecmodal + 1;
      /* con fotos mini */
      if (this.imagenes.length > 9) {
        this.posicionsliderleft = 'absolute';
        if (idx > 4 && idx <= 5) {
          this.widthExp = -1.3;
        } else if (idx > 5 && idx <= this.imagenes.length - 5) {
          let valores = idx - 4;
          this.widthExp = -(99 * valores + 1.3);
        } else if (idx >= 1 && this.imgselecmodal <= 4) {
          this.widthExp = 0;
        } else {
          let valores = this.imagenes.length - 8;
          this.widthExp = -(99 * valores + 1.3);
        }
      } else {
        this.posicionsliderleft = 'none';
      }
    }
  }

  @HostListener('slide.bs.carousel', ['$event'])
  eventoSlideIndices(event: any) {
    if (this.indicatorsphoto) {
      this.valorindiceactual = event.to;
      this.valueResponseIndiceActualSlider.emit(event.to);
    } else if (!this.indicatorsphoto) {
      this.valorindiceactual = event.to;
      this.valueResponseIndiceActualSlider.emit(event.to);
    }
  }
  desaptvarclaseactive!: Boolean;
  clickImgIndiceIndicadorSlide(index: number) {
    /* let idx = index + 1;
    console.log(`ìdx ${idx}`) */
    if (this.indicatorsphoto) {
      this.desaptvarclaseactive = false;
      this.eventValueResponseClickFotoMiniSlider.emit(index);
      if (this.imagenes.length > 9) {
        let idx = this.valorindiceactual + 1;
        if (idx > 1 && idx <= this.imagenes.length - 6) {
          let valores = idx - 1;
          console.log(valores);
          // valor del ancho=10 gad=10)
          this.widthExp = -(20 * valores);
          console.log(this.widthExp);
        } else if (idx >= 1 && idx <= 4) {
          this.widthExp = 0;
        }
      }
    } else if (!this.indicatorsphoto) {
      this.eventValueResponseClickFotoMiniSlider.emit(index);
      if (this.imagenes.length > 9) {
        let idx = index + 1;
        if (idx > 4 && idx <= 5) {
          this.widthExp = -1.3;
        } else if (idx > 5 && idx <= this.imagenes.length - 5) {
          let valores = idx - 4;
          this.widthExp = -(99 * valores + 1.3);
        } else if (idx >= 1 && index <= 4) {
          this.widthExp = 0;
        }
      }
    }
  }
  clickDivIndicadorSlider() {
    this.eventValueResponseClickDivIndicadorSlider.emit();
  }
  clickImagenItemSlider() {
    this.eventValueResponseclickImagenItemSlider.emit()
  }
  clickButtonNext() {
    if (this.indicatorsphoto) {
      let idx = this.valorindiceactual + 1;
      this.eventClickOnPreviousOrNew.emit();
      if (this.imagenes.length > 4) {
        if (idx > 3 && idx <= this.imagenes.length - 2) {
          console.log(idx);
          let valores = idx - 3;
          this.widthExp = -(20 * valores);
        } else if (idx >= 1 && idx <= 4) {
          this.widthExp = 0;
        }
        /*  if (this.valorindiceactual+1 >4 && this.valorindiceactual+1<=5) {
           this.widthExp=-1.3
       console.log(this.widthExp)
         }else if(this.valorindiceactual+1>5 && this.valorindiceactual+1<=this.imagenes.length-5){
           let valores=(this.valorindiceactual+1)-4
           this.widthExp= -((99*valores)+1.3)
         }else if(this.valorindiceactual+1>=this.imagenes.length-4==null ){
           console.log(`valor andres indice ${this.valorindiceactual+1}`)
           console.log(`valor andres imagenes ${this.imagenes.length-4}`)

           console.log("aqui")
           // let valores=(this.valorindiceactual+1)-5
           // this.widthExp= -((99*valores)+1.3)
           // console.log(`valor indice actual${this.valorindiceactual}`)
           // console.log(`valor item-4 actual${this.imagenes.length-4}`)
         }else if(this.valorindiceactual+1>=1 && this.valorindiceactual<=4 ){
           this.widthExp=0
         }else{
       //   let valores=this.imagenes.length-8
       //  this.widthExp= -((99*valores)+1.3)

         } */
      }
    } else if (!this.indicatorsphoto) {
      this.eventClickOnPreviousOrNew.emit();
      if (this.imagenes.length > 9) {
        if (this.valorindiceactual + 1 > 4 && this.valorindiceactual + 1 <= 5) {
          this.widthExp = -1.3;
          console.log(this.widthExp);
        } else if (
          this.valorindiceactual + 1 > 5 &&
          this.valorindiceactual + 1 <= this.imagenes.length - 5
        ) {
          let valores = this.valorindiceactual + 1 - 4;
          this.widthExp = -(99 * valores + 1.3);
        } else if (
          this.valorindiceactual + 1 >= 1 &&
          this.valorindiceactual <= 4
        ) {
          this.widthExp = 0;
        }
      }
    }
  }
  clickButtonPrevious() {
    if (this.indicatorsphoto) {
      let idx = this.valorindiceactual + 1;
      this.eventClickOnPreviousOrNew.emit();
      if (this.imagenes.length > 4) {
        if (idx > 3 && idx <= this.imagenes.length - 2) {
          let valores = idx - 3;
          this.widthExp = -(20 * valores);
        } else if (idx == this.imagenes.length) {
          let valores = this.imagenes.length - 5;
          this.widthExp = -(20 * valores);
        } else if (idx >= 1 && idx <= 4) {
          this.widthExp = 0;
        }
      }
    } else if (!this.indicatorsphoto) {
      this.eventClickOnPreviousOrNew.emit();
      if (this.imagenes.length > 9) {
        let idx = this.valorindiceactual + 1;
        if (idx > 4 && idx <= 5) {
          this.widthExp = -1.3;
          console.log(this.widthExp);
        } else if (idx > 5 && idx <= this.imagenes.length - 4) {
          let valores = idx - 5;
          this.widthExp = -(99 * valores + 1.3);
          console.log(this.widthExp);
        } else if (idx < 4) {
          this.widthExp = 0;
        } else if (
          idx == this.imagenes.length &&
          this.imagenes.length - 4 <= idx
        ) {
          console.log('del otro lado ');
          console.log(this.valorindiceactual + 1);
          console.log(`valor item len${this.imagenes.length}`);
          /*   console.log(this.valorindiceactual)
           let valores=(this.valorindiceactual+1)-8
          console.log(valores)
          this.widthExp= -((99*valores)+(1.3)) */
          console.log(`itemok${this.imagenes.length}`);
          let valores = this.imagenes.length - 9;
          console.log(`valores${valores}`);
          this.widthExp = -(99 * valores + 1.3);
          console.log(`width${this.widthExp}`);
        }
      }
    }
  }
}

import { Component} from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-floatin-btns-alante-atras',
  templateUrl: './floatin-btns-alante-atras.component.html',
  styleUrls: ['./floatin-btns-alante-atras.component.scss'],
})
export class FloatinBtnsAlanteAtrasComponent  {
  constructor(
    private location: Location,
  ) {}
  goBack(): void {
    this.location.back();
  }

  getForward(): void {
    this.location.forward();
  }

}

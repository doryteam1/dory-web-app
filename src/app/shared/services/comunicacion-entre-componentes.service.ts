import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComunicacionEntreComponentesService {
  /* http://developinginspanish.com/2018/05/19/3-formas-de-comunicarse-entre-componentes-angular/ */
  /* https://angular.io/guide/observables */
  @Output() changeArray: EventEmitter<any[]> = new EventEmitter();
  @Output() changeArray2: EventEmitter<any[]> = new EventEmitter();
  @Output() ArrayDelate: EventEmitter<any[]> = new EventEmitter();

  changeMyArray(Array: any[]) {
    console.log('changeArray');
    this.changeArray.emit(Array);
  }
  changeMyArray2(Array: any[]) {
    console.log('changeArray2');
    this.changeArray2.emit(Array);
  }
  arrayDelate(Array: any[]) {
    console.log('ArrayDelate');
    this.ArrayDelate.emit(Array);
  }
}

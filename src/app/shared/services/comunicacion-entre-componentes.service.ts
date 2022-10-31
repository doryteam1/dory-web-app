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
  @Output() Action: EventEmitter<boolean> = new EventEmitter();

  changeMyArray(Array: any[]) {
    this.changeArray.emit(Array);
  }
  changeMyArray2(Array: any[]) {
    this.changeArray2.emit(Array);
  }
  arrayDelate(Array: any[]) {
    this.ArrayDelate.emit(Array);
  }
  activateOrDeactivate(action:boolean){
    this.Action.emit(action)

  }
}

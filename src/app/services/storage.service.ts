import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public store$: Observable<any>;
  private _observer: any;
  private _store: any | null = '';

  constructor() {
    this.store$ = new Observable(observer => {
      this._observer = observer;
    });
  }
  
  add(key:string, value: any) {
    localStorage.setItem(key,value);
    this._store = {};
    for(let i=0; i<localStorage.length; i++){
      let key = localStorage.key(i)!;
      this._store[key]=localStorage.getItem(key);
    }
    this._observer.next(this._store);
  }
}

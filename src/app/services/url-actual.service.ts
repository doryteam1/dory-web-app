import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class UrlActualService {
  private currentUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public currentUrl$: Observable<string> = this.currentUrl.asObservable();

  setCurrentUrl(url: string) {
    this.currentUrl.next(url);
  }
}

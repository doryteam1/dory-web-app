import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalcHeightNavbarService {
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject({} as any);
  public readonly currentUser: Observable<any> = this.currentUserSubject.asObservable();

  updateData(data: any[]) {
    this.currentUserSubject.next(data);
  }
}

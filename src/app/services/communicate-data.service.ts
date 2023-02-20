import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicateDataService {
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject(false as any);
  public readonly currentUser: Observable<any> = this.currentUserSubject.asObservable();

  updateData(data:any) {
    this.currentUserSubject.next(data);
  }
}
/*
Este código es un servicio de Angular que se usa
 para comunicar datos entre componentes. Utiliza
  el patrón de diseño "Subject" para compartir información
   entre los componentes. El método updateData() actualiza
   el valor del Subject con los datos proporcionados como
   parámetro, y el método currentUser devuelve un
    Observable que puede ser suscrito por los componentes
    para recibir notificaciones cuando el valor del Subject cambia.
 */

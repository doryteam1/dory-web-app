import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
/* https://notiz-dev.translate.goog/blog/media-observable?_x_tr_sl=auto&_x_tr_tl=es&_x_tr_hl=es */
@Injectable({
  providedIn: 'root',
})
export class MediaQueryService   {
  mediaQuery(breakpoint: string): Observable<boolean> {
    const mediaQuery = window.matchMedia(`(${breakpoint})`);
    return fromEvent<MediaQueryList>(mediaQuery, 'change').pipe(
      startWith(mediaQuery),
      map((list: MediaQueryList) => list.matches)
    );
  }
}

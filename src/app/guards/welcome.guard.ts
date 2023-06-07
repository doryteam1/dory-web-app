import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WelcomeGuard implements CanActivate {
  constructor(private router: Router ) {}

    canActivate():boolean {
    if (
      localStorage.getItem('dataUserComplete') == 'false' &&
      localStorage.getItem('email')
    ) {
      return true;
    } else {
      this.router.navigateByUrl('/home');
      return false;
    }
  }

}

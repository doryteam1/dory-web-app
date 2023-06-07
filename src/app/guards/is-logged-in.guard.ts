import { Injectable } from '@angular/core';
import { CanActivate, CanLoad,Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedInGuard implements CanLoad, CanActivate {
  
  constructor(private userService: UsuarioService, private router: Router) {}


  canActivate(): boolean {
    return this.isAuthenticate();
  }

  canLoad(): boolean {
    return this.isAuthenticate();
  }

  private isAuthenticate() {
    if (this.userService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}

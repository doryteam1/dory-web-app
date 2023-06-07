import { Injectable } from '@angular/core';
import {CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class IsAuthenticatedGuard implements CanActivate {
  constructor(
    private userService: UsuarioService,
    private router: Router,
  ) {}

  canActivate():boolean {
    if (this.userService.isAuthenticated()) {
      this.router.navigateByUrl('/dashboard/perfil');
      return false;
    } else {
      return true;
    }
  }
}

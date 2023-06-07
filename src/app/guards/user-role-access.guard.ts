import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class UserRoleAccessGuard implements CanActivateChild {
  constructor(private userService: UsuarioService, private router: Router) {}
  canActivateChild(childRoute: ActivatedRouteSnapshot):boolean {
      const userRole: string = this.userService.getAuthUserRol(); // Obtener el rol del usuario actual
      const rolRuta: string[] = childRoute.data?.['rol']; // Obtener el rol asignado a la ruta actual
      const deniedRol: string = childRoute.data?.['denied'];
      if (
        (childRoute.data && rolRuta && rolRuta?.includes(userRole)) || rolRuta?.includes('all')
      ) {
         if (deniedRol && userRole === deniedRol) {
           this.router.navigateByUrl('/dashboard/perfil');
           return false;
         }
          return true;
      }
      this.router.navigateByUrl('/dashboard/perfil');
      return false;
    }
}

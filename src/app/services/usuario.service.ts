import { Injectable } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(
    private httpsService: HttpsService,
    private storageService: StorageService,
    private socialAuthService: SocialAuthService
  ) {}

  registrarUsuario(usuario: any): Observable<any> {
    let body = {
      nombres: usuario.nombres || '',
      apellidos: usuario.apellidos || '',
      id_tipo_usuario: usuario.tipoUsuario || '',
      email: usuario.email || '',
      password: usuario.password || '',
      foto: usuario.foto || '',
      latitud: usuario.latitud || 0,
      longitud: usuario.longitud || 0,
      creadoCon: usuario.creadoCon || '',
    };
    return this.httpsService.post(
      environment.doryApiRestBaseUrl+'/usuario/create',
      body
    );
  }

  getTiposUsuario() {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl+'/tipos-usuarios'
    );
  }

  getUsuarioByEmail(email: string | null) {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl+'/buscar/usuario/email/' + email
    );
  }

  getDetail(id: number) {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl+'/usuario/id/' + id
    );
  }

  actualizarUsuario(id: number, dataUser: any) {
    return this.httpsService.put(
      environment.doryApiRestBaseUrl+'/usuario/parcial/' + id,
      dataUser
    );
  }

  login(userData: { email: string; password: string }) {
    return this.httpsService.post(
      environment.doryApiRestBaseUrl+'/login',
      userData
    );
  }

  loginWithGoogle(token: string) {
    return this.httpsService.post(
      environment.doryApiRestBaseUrl+'/login/google',
      { token: token }
    );
  }

  logout() {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('photoUser');
    localStorage.removeItem('nomApell');
    console.log('logout google');
    this.socialAuthService.signOut();
  }

  logoutElectron() {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('photoUser');
    localStorage.removeItem('nomApell');
    this.socialAuthService.signOut();
  }
  recoveryPassword(email: string) {
    return this.httpsService.post(
      environment.doryApiRestBaseUrl+'/usuario/recover/password',
      { email: email }
    );
  }

  resetPassword(body: { newPassword: string; token: string }) {
    return this.httpsService.put(
      environment.doryApiRestBaseUrl+'/usuario/update/password',
      body
    );
  }

  changePassword(body: { antiguoPassword: string; newPassword: string }) {
    return this.httpsService.put(
      environment.doryApiRestBaseUrl+'/usuario/change/password',
      body
    );
  }

  isAuthenticated() {
    let email = localStorage.getItem('email');
    let token = localStorage.getItem('token');

    if (email && token && email != '' && token != '') {
      return true;
    } else {
      return false;
    }
  }

  authenticatedWith() {
    let authWith = localStorage.getItem('authWith');

    return authWith;
  }

  setAuthUserPhoto(photoUrl: string) {
    localStorage.setItem('photoUser', photoUrl);
  }

  setAuthUserNomApell(nomApell: string) {
    localStorage.setItem('nomApell', nomApell);
  }

  getAuthUserNomApell() {
    return localStorage.getItem('nomApell');
  }

  getAuthUserPhoto() {
    return localStorage.getItem('photoUser');
  }
  getAuthUserTipo_usuario() {
    return localStorage.getItem('tipoUser');
  }
  setAuthWith(method: string) {
    localStorage.setItem('authWith', method);
  }

  verifyAccount(token: string) {
    return this.httpsService.put(
      environment.doryApiRestBaseUrl+'/usuario/verify/account',
      { token: token }
    );
  }

  solicitudesDeAsociaciones() {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl+'/usuario/solicitudes/noaceptadas/porusuario'
    );
  }

  solicitudesParaAsociacionesRepresentante() {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl+'/usuario/solicitudes/noaceptadas/representante'
    );
  }

  eliminarSolicitud(idSolicitud: number) {
    return this.httpsService.delete(
      environment.doryApiRestBaseUrl+'/asociaciones/solicitud/eliminar/' +
        idSolicitud
    );
  }

  aceptarInvitacion(idSolicitud: number) {
    return this.httpsService.put(
      environment.doryApiRestBaseUrl+'/asociaciones/aceptarSolicitudAsociacion/' +
        idSolicitud,
      null
    );
  }

  getSexos(){
    return this.httpsService.get(
      environment.doryApiRestBaseUrl+'/sexos/obtener'
    );
  }

  getEtnias(){
    return this.httpsService.get(
      environment.doryApiRestBaseUrl+'/etnias/obtener'
    );
  }
}

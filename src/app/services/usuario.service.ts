import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Utilities } from '../utilities/utilities';
import { HttpsService } from './https.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  isAuthSubject = new Subject<boolean>();
  constructor(private httpsService: HttpsService) {}

  registrarUsuario(usuario: any): Observable<any> {
    let body = {
      nombres: usuario.nombres || '',
      apellidos: usuario.apellidos || '',
      id_tipo_usuario: usuario.tipoUsuario || null,
      id_departamento: usuario.id_departamento || null,
      id_municipio: usuario.id_municipio || null,
      email: usuario.email || '',
      password: usuario.password || '',
      foto: usuario.foto || '',
      latitud: usuario.latitud || 0,
      longitud: usuario.longitud || 0,
      creadoCon: usuario.creadoCon || '',
      id_sexo: null,
      id_etnia: null,
    };
    return this.httpsService.post(
      environment.doryApiRestBaseUrl + '/usuario/create',
      body
    );
  }

  getTiposUsuario() {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl + '/tipos-usuarios'
    );
  }
  getTodosUsuarioAll() {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl + '/usuario/all'
    );
  }

  getUsuarioByEmail(email: string | null) {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl + '/buscar/usuario/email/' + email
    );
  }

  getDetail(id: number) {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl + '/usuario/id/' + id
    );
  }

  actualizarUsuario(id: number, dataUser: any) {
    return this.httpsService.put(
      environment.doryApiRestBaseUrl + '/usuario/parcial/' + id,
      dataUser
    );
  }

  login(userData: { email: string; password: string }) {
    return this.httpsService.post(
      environment.doryApiRestBaseUrl + '/login',
      userData
    );
  }

  loginWithGoogle(token: string) {
    return this.httpsService.post(
      environment.doryApiRestBaseUrl + '/login/google',
      { token: token }
    );
  }

  setLoginData(token: string, authWith: string, idToken?: string) {
    localStorage.setItem('token', token);
    if (idToken) {
      let payload = Utilities.parseJwt(idToken);
      let nomApell = Utilities.getNomApell(
        payload.given_name,
        payload.family_name
      );
      localStorage.setItem('nomApell', nomApell);
      localStorage.setItem('photoUser', payload.picture);
    }
    this.setAuthWith(authWith);
    this.isAuthSubject.next(true);
  }


  removeLocalStorage(parte: boolean) {
    if (parte) {
      localStorage.removeItem('email');
      localStorage.removeItem('dataUserComplete');
    }
    localStorage.removeItem('nombres');
    localStorage.removeItem('apellidos');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('idTokenGoogle');
    localStorage.removeItem('urlPrevious');
    localStorage.removeItem('urlPrevious-abort');
  }

  logout() {
    localStorage.clear();
    this.isAuthSubject.next(false);
  }

  logoutElectron() {
    this.logout();
    window.open('https://accounts.google.com/logout', '_blank');
  }
  recoveryPassword(email: string) {
    return this.httpsService.post(
      environment.doryApiRestBaseUrl + '/usuario/recover/password',
      { email: email }
    );
  }

  resetPassword(body: { newPassword: string; token: string }) {
    return this.httpsService.put(
      environment.doryApiRestBaseUrl + '/usuario/update/password',
      body
    );
  }

  changePassword(body: { antiguoPassword: string; newPassword: string }) {
    return this.httpsService.put(
      environment.doryApiRestBaseUrl + '/usuario/change/password',
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
      environment.doryApiRestBaseUrl + '/usuario/verify/account',
      { token: token }
    );
  }

  solicitudesDeAsociaciones() {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl +
        '/usuario/solicitudes/noaceptadas/porusuario'
    );
  }

  solicitudesParaAsociacionesRepresentante() {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl +
        '/usuario/solicitudes/noaceptadas/representante'
    );
  }

  eliminarSolicitud(idSolicitud: number) {
    return this.httpsService.delete(
      environment.doryApiRestBaseUrl +
        '/asociaciones/solicitud/eliminar/' +
        idSolicitud
    );
  }

  aceptarInvitacion(idSolicitud: number) {
    return this.httpsService.put(
      environment.doryApiRestBaseUrl +
        '/asociaciones/aceptarSolicitudAsociacion/' +
        idSolicitud,
      null
    );
  }

  getSexos() {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl + '/sexos/obtener'
    );
  }

  getEtnias() {
    return this.httpsService.get(
      environment.doryApiRestBaseUrl + '/etnias/obtener'
    );
  }

  getAuthUser() {
    let token = localStorage.getItem('token');
    let payload = null;
    if (token) {
      payload = Utilities.parseJwt(token!);
    }
    return payload;
  }

  getAuthUserId() {
    return this.getAuthUser()?.sub;
  }
  getAuthUserRol() {
    return this.getAuthUser()?.rol;
  }

  getAuthUserToken() {
    let token = localStorage.getItem('token');
    return token;
  }

  getAuthObservable() {
    return this.isAuthSubject.asObservable();
  }
}

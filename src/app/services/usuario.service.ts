import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpsService } from './https.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpsService:HttpsService, private storageService:StorageService) { }

  registrarUsuario(usuario:any):Observable<any>{
    let body = {
        cedula : usuario.cedula || '',
        nombres : usuario.nombres || '', 
        apellidos : usuario.apellidos || '',
        celular: usuario.celular || '',
        direccion: usuario.direccion || '', 
        id_tipo_usuario : usuario.tipoUsuario || '',
        email: usuario.email || '',
        password: usuario.password || '', 
        id_area_experticia:usuario.id_area_experticia || '',
        nombre_negocio:usuario.nombre_negocio || '',
        foto:usuario.foto || '', 
        fecha_registro:usuario.fecha_registro || '',
        fecha_nacimiento:usuario.fechaNac || '',
        id_departamento: usuario.departamento || '',
        id_municipio:usuario.municipio || '',
        id_corregimiento:usuario.corregimiento || '',
        id_vereda:usuario.vereda || '',
        latitud:usuario.latitud || 0,
        longitud:usuario.longitud || 0
    }
    console.log("usuario service registrar ", body)
    return this.httpsService.post('https://dory-api-rest.herokuapp.com/api/usuarios',body);
  }

  getTiposUsuario(){
    return this.httpsService.get('https://dory-api-rest.herokuapp.com/api/tipos-usuarios');
  }

  getUsuarioByEmail(email:string | null){
    return this.httpsService.get('https://dory-api-rest.herokuapp.com/api/buscar/usuario/email/'+email); 
  }

  actualizarUsuario(id:number, dataUser:any){
    return this.httpsService.put('https://dory-api-rest.herokuapp.com/api/usuarios/parcial/'+id,dataUser);
  }

  login(userData: {email:string, password:string}){
    return this.httpsService.post('https://dory-api-rest.herokuapp.com/api/login',userData)
  }

  logout(){
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('photoUser');
    localStorage.removeItem('nomApell');
  }

  recoveryPassword(email:string){
    return this.httpsService.post('https://dory-api-rest.herokuapp.com/api/usuario/recover/password',{email:email});
  }

  resetPassword(body:{newPassword:string, token:string}){
    return this.httpsService.put('https://dory-api-rest.herokuapp.com/api/usuario/update/password',body)
  }

  changePassword(body:{antiguoPassword:string, newPassword:string}){
    return this.httpsService.put('https://dory-api-rest.herokuapp.com/api/usuario/change/password',body);
    
  }
  
  isAuthenticated(){
    let email = localStorage.getItem('email');
    let token = localStorage.getItem('token');

    if(email && token && email != '' && token != ''){
      return true;
    }else{
      return false;
    }
  }

  getProductosById(userId:number){
    return this.httpsService.get('https://dory-api-rest.herokuapp.com/api/proveedores/productos/userId/'+userId)
  }

  verifyAccount(token:string){
    return this.httpsService.put('dory-api-rest.herokuapp.com/api/usuario/verify/account',{token:token})
  }
}

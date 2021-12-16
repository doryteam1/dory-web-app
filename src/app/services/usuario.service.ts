import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpsService:HttpsService) { }

  registrarUsuario(usuario:any):Observable<any>{
    let body = {
        cedula : usuario.cedula,
        nombres : usuario.nombreCompleto, 
        apellidos : usuario.nombreCompleto,
        celular: usuario.celular,
        direccion: '', 
        id_tipo_usuario : 7,
        email: usuario.email,
        password: usuario.password, 
        id_area_experticia:1,
        nombre_negocio:'',
        foto:'', 
        fecha_registro:'',
        fecha_nacimiento:usuario.fechaNac,
        id_departamento: usuario.departamento,
        id_municipio:usuario.municipio,
        id_corregimiento:usuario.corregimiento,
        id_vereda:usuario.vereda,
        latitud:0,
        longitud:0
    }
    return this.httpsService.post('https://dory-api-rest.herokuapp.com/api/usuarios',body);
  }
}

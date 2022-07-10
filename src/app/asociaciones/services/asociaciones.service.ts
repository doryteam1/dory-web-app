import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpsService } from 'src/app/services/https.service';
import { SolicitudesModalContentComponent } from '../components/modals/solicitudes-modal-content/solicitudes-modal-content.component';

@Injectable({
  providedIn: 'root'
})
export class AsociacionesService {

  constructor(private https:HttpsService, private modalService:NgbModal) {

  }

  getAsociaciones(){
    //return this.https.get("https://dory-api-rest.herokuapp.com/granjas");
    return this.https.get("https://dory-api-rest.herokuapp.com/api/asociaciones");
  }

  getAsociacionesMunicipio(idMunicipio:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/asociaciones/municipio/"+idMunicipio);
  }

  getAsociacionesDpto(dptoId:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/asociaciones/departamento/'+dptoId);
  }

  getAsociacionesUsuario(idUsuario:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/asociaciones/usuario/'+idUsuario)
  }

  add(asociacion:any){
    return this.https.post('https://dory-api-rest.herokuapp.com/api/asociaciones',asociacion)
  }

  delete(nit:number){
    return this.https.delete('https://dory-api-rest.herokuapp.com/api/asociaciones/'+nit)
  }

  update(nit:number,newDataAsociacion:any){
    return this.https.put('https://dory-api-rest.herokuapp.com/api/asociaciones/'+nit,newDataAsociacion)
  }

  detail(nit:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/asociaciones/'+nit)
  }

  tiposAsociacion(){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/tipos-asociaciones');
  }

  public showSolicitudesModal(
    nit:number,
    title?: string): Promise<boolean> {
    const modalRef = this.modalService.open(SolicitudesModalContentComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.nit = nit;
    return modalRef.result;
  }

  invitarUsuario(solicitud:any, nit:number){
    return this.https.post('https://dory-api-rest.herokuapp.com/api/asociaciones/solicitud/adicion/'+nit,solicitud)
  }

  eliminarSolicitud(idSolicitud:number){
    console.log("service asociaciones idSolicitud ",idSolicitud)
    return this.https.delete('https://dory-api-rest.herokuapp.com/api/asociaciones/solicitud/eliminar/'+idSolicitud)
  }
}



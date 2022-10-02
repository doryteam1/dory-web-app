import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpsService } from 'src/app/services/https.service';
import { environment } from 'src/environments/environment';
import { MiembrosAsociacionModalContentComponent } from '../components/modals/miembros-asociacion-modal-content/miembros-asociacion-modal-content.component';
import { SolicitudesModalContentComponent } from '../components/modals/solicitudes-modal-content/solicitudes-modal-content.component';


@Injectable({
  providedIn: 'root',
})
export class AsociacionesService {
  constructor(private https: HttpsService, private modalService: NgbModal) {}

  getAsociaciones() {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/asociaciones'
    );
  }
  getAsociacionesTodas() {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/asociaciones/todas'
    );
  }

  getAsociacionesMunicipio(idMunicipio: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/asociaciones/municipio/' +
        idMunicipio
    );
  }

  getAsociacionesDpto(dptoId: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/asociaciones/departamento/' +
        dptoId
    );
  }

  getAsociacionesUsuario(idUsuario: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/asociaciones/usuario/' +
        idUsuario
    );
  }
  getAsociacionDetalle(nit: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/asociaciones/detail/' + nit
    );
  }
  add(asociacion: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl+'/asociaciones',
      asociacion
    );
  }

  delete(nit: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl+'/asociaciones/' + nit
    );
  }

  update(nit: number, newDataAsociacion: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl+'/asociaciones/' + nit,
      newDataAsociacion
    );
  }

  updateParcial(nit:number, newDataAsociacion: any){
    return this.https.put(
      environment.doryApiRestBaseUrl+'/asociaciones/parcial/' + nit,
      newDataAsociacion
    );
  }

  detail(nit: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/asociaciones/' + nit
    );
  }
  tiposAsociacion() {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/tipos-asociaciones'
    );
  }

  public showSolicitudesModal(datos:any, title?: string): Promise<boolean> {
    const modalRef = this.modalService.open(SolicitudesModalContentComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.datos = datos;
    return modalRef.result;
  }

  public showAscociacionMiembrosModal(datos:any, title?: string): Promise<boolean> {
    const modalRef = this.modalService.open(MiembrosAsociacionModalContentComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.datos = datos;
    return modalRef.result;
  }

  invitarUsuarioAsociacion(solicitud: any, nit: number) {
    return this.https.post(
      environment.doryApiRestBaseUrl+'/asociaciones/solicitud/adicion/' +
        nit,
      solicitud
    );
  }

  eliminarSolicitud(idSolicitud:number){
    return this.https.delete(environment.doryApiRestBaseUrl+'/asociaciones/solicitud/eliminar/'+idSolicitud)
  }

  getAsociacionesIsMiembroUser(id:number){
    return this.https.get(environment.doryApiRestBaseUrl+'/asociaciones/miembros/'+id);
  }

  getMiembrosPrivado(nit:string){
    return this.https.get(environment.doryApiRestBaseUrl+'/asociaciones/miembros/privado/nit/'+nit)
  }

}



import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
/* import { Subject,Observable, pipe } from 'rxjs'; */
import { HttpsService } from 'src/app/services/https.service';
import { environment } from 'src/environments/environment';
import { ResenasModalContentComponent } from '../components/modals/resenas-modal-content/resenas-modal-content.component';
/* import {tap  } from "rxjs/operators"; */
@Injectable({
  providedIn: 'root',
})
export class GranjasService {
  constructor(private https: HttpsService, private modalService: NgbModal) {}
  getGranjas() {
    return this.https.get(environment.doryApiRestBaseUrl+'/granjas/todas');
  }

  getGranjasMunicipio(idMunicipio: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/granjas/municipio/' + idMunicipio
    );
  }

  getGranja(id: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/granja/' + id
    );
  }
  getGranjaSearch(cadena: string, idMunicipio: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/buscar/granja/municipio?idMunicipio=' +
        idMunicipio +
        '&cadena=' +
        cadena
    );
  }

  getInformeGranjasPorDepartamento() {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/granjas/departamento'
    );
  }

  addGranja(newGranja: any) {
    return this.https.post(
      '//dory-api-rest.herokuapp.com/api/granjas/',
      newGranja
    );
  }

  getGranjaByUserId(userId: string) {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/granjas/user/' + userId
    );
  }

  deleteGranja(idGranja: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl+'/granjas/eliminar/' + idGranja
    );
  }

  updateGranja(id: number, updatedGranja: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl+'/granjas/general/' + id,
      updatedGranja
    );
  }

  getInfraestructuras() {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/infraestructuras'
    );
  }

  getEspecies() {
    return this.https.get(environment.doryApiRestBaseUrl+'/especies');
  }

  getGranjaDetalle(id: number) {
    return this.https
      .get(environment.doryApiRestBaseUrl+'/granjas/detailed/' + id)
  }
  updateParcial(id: number, datos: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl+'/granjas/parcial/' + id,
      datos
    );
  }
  esFavorita(id: number) {
    return this.https.put(
      environment.doryApiRestBaseUrl+'/granjas/esfavorita/' + id,
      null
    );
  }

  updatePhotos(idGranja: number, photos: any) {
    return this.https.put(
      environment.doryApiRestBaseUrl+'/granjas/update/photos/' +
        idGranja,
      photos
    );
  }

  misFavoritas() {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/granjas/misfavoritas'
    );
  }

  resenasById(id: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/resenas/granja/' + id
    );
  }

  addResena(resena: any) {
    return this.https.post(
      environment.doryApiRestBaseUrl+'/resenas',
      resena
    );
  }

  updateResena(resenaEdited: any, idResena: number) {
    return this.https.put(
      environment.doryApiRestBaseUrl+'/resenas/' + idResena,
      resenaEdited
    );
  }

  public showResenasModal(
    title: string,
    btnCancelText: string = 'Cerrar',
    granjaId: number
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ResenasModalContentComponent, {
   /*    modalDialogClass: 'modal-full-scree2',
      windowClass: 'modal-full-scree', */
      centered: true,
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.granjaId = granjaId;
    return modalRef.result;
  }

  calificarGranja(idGranja: number, calificacion: number) {
    return this.https.put(
      environment.doryApiRestBaseUrl+'/granjas/calificar/' + idGranja,
      { calificacion: calificacion }
    );
  }

  resenasUserByIdGranja(idGranja: number) {
    return this.https.get(
      environment.doryApiRestBaseUrl+'/resenas/usuario/granja/' +
        idGranja
    );
  }

  deleteResena(idResena: number) {
    return this.https.delete(
      environment.doryApiRestBaseUrl+'/resenas/' + idResena
    );
  }

  getGranjasByNitAsociacion(nit:number){
    return this.https.get(environment.doryApiRestBaseUrl+'/asociaciones/granjas/asociadas/'+nit)
  }
}

import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpsService } from 'src/app/services/https.service';
import { ResenasModalContentComponent } from '../components/modals/resenas-modal-content/resenas-modal-content.component';

@Injectable({
  providedIn: 'root'
})
export class GranjasService {

  constructor(private https:HttpsService, private modalService:NgbModal) {

  }

  getGranjas(){
    return this.https.get("https://dory-api-rest.herokuapp.com/granjas");
  }

  getGranjasMunicipio(idMunicipio:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/granjas/municipio/"+idMunicipio);
  }

  getGranja(id:number){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/granja/"+id);
  }

  getInformeGranjasPorDepartamento(){
    return this.https.get("https://dory-api-rest.herokuapp.com/api/granjas/departamento");
  }

  addGranja(newGranja:any){
    return this.https.post('//dory-api-rest.herokuapp.com/api/granjas/',newGranja)
  }

  getGranjaByUserId(userId:string){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/granjas/user/'+userId)
  }

  deleteGranja(idGranja:number){
    return this.https.delete('https://dory-api-rest.herokuapp.com/api/granjas/eliminar/'+idGranja)
  }

  updateGranja(id:number,updatedGranja:any){
    return this.https.put("https://dory-api-rest.herokuapp.com/api/granjas/general/"+id,updatedGranja);
  }

  getInfraestructuras(){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/infraestructuras')
  }

  getEspecies(){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/especies')
  }

  getGranjaDetalle(id:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/granjas/detailed/'+id)
  }
  updateParcial(id:number,datos:any){
     return this.https.put("https://dory-api-rest.herokuapp.com/api/granjas/parcial/"+id,datos);
  }
  esFavorita(id:number){
     return this.https.put("https://dory-api-rest.herokuapp.com/api/granjas/esfavorita/"+id,null);
  }

  updatePhotos(idGranja:number, photos:any){
    return this.https.put('https://dory-api-rest.herokuapp.com/api/granjas/update/photos/'+idGranja, photos)
  }

  misFavoritas(){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/granjas/misfavoritas')
  }

  resenasById(id:number){
    return this.https.get('https://dory-api-rest.herokuapp.com/api/resenas/granja/'+id)
  }

  addResena(resena:any){
    return this.https.post('https://dory-api-rest.herokuapp.com/api/resenas',resena)
  }

  public showResenasModal(
    title: string,
    btnCancelText: string = 'Cerrar',
    granjaId: number): Promise<boolean> {
    const modalRef = this.modalService.open(ResenasModalContentComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.granjaId = granjaId;
    return modalRef.result;
  }

  calificarGranja(idGranja:number, calificacion:number){
    return this.https.put('https://dory-api-rest.herokuapp.com/api/granjas/calificar/'+idGranja, {calificacion:calificacion})
  }
}

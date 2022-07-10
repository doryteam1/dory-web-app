import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';

@Component({
  selector: 'app-solicitudes-modal-content',
  templateUrl: './solicitudes-modal-content.component.html',
  styleUrls: ['./solicitudes-modal-content.component.scss']
})
export class SolicitudesModalContentComponent implements OnInit {
  @Input() title = 'Agregar miembros'
  @Input() nit = -1;
  piscicultores:Array<any> = [];
  pescadores:Array<any> = [];
  constructor(public activeModal:NgbActiveModal, private pescadoresService:PescadoresService, private piscicultoresService:PiscicultoresService, private asociacionService:AsociacionesService) { }

  ngOnInit(): void {
    this.pescadoresService.getPescadoresEstadoSolicitud(1234).subscribe(
      (response:any)=>{
        console.log(response)
        this.pescadores = response.data;
      }
    );
    this.piscicultoresService.getPiscicultoresEstadoSolicitud(1234).subscribe(
      (response)=>{
        console.log(response)
        this.piscicultores = response.data;
      }
    )
  }

  invitarAnular(usuario:any){
    if(usuario.estado_solicitud == 'Enviada' || usuario.estado_solicitud == 'Aceptada'){
      let estado = usuario.estado_solicitud;
      usuario.estado_solicitud = null;
      this.asociacionService.eliminarSolicitud(usuario.id_solicitud).subscribe(
        (response)=>{
          console.log(response)
        },err=>{
          usuario.estado_solicitud = estado;
          console.log(err)
        }
      )
    }else{
      let data = {
        quienEnvia : 'asociacion',
        id_usuario_receptor : usuario.id
      }
      usuario.estado_solicitud = 'Enviada';
      this.asociacionService.invitarUsuario(data,this.nit).subscribe(
        (response)=>{
          console.log(response)
          usuario.id_solicitud = response.body.insertId;
          console.log("usuario.id_solicitud ",usuario.id_solicitud)
        },err=>{
          usuario.estado_solicitud = null;   
          console.log(err)     
        }
      )
    }
  }


}

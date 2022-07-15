import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';

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
  selectedTab:string = 'piscicultores';
  piscicultoresFiltered:any[] = [];
  pescadoresFiltered: any[] = [];
  constructor(
    public activeModal:NgbActiveModal, 
    private pescadoresService:PescadoresService, 
    private piscicultoresService:PiscicultoresService, 
    private asociacionService:AsociacionesService,
    private appModalService: AppModalService) { }

  ngOnInit(): void {
    this.pescadoresService.getPescadoresEstadoSolicitud(this.nit).subscribe(
      (response:any)=>{
        console.log(response)
        this.pescadores = response.data;
        this.pescadoresFiltered = this.pescadores;
      }
    );
    this.piscicultoresService.getPiscicultoresEstadoSolicitud(this.nit).subscribe(
      (response)=>{
        console.log(response)
        this.piscicultores = response.data;
        this.piscicultoresFiltered = this.piscicultores;
      }
    )
  }

  invitarAnular(usuario:any){
    if(usuario.estado_solicitud == 'Aceptada'){
      this.appModalService
      .confirm(
        'Eliminar de miembro',
        'Esta seguro que desea eliminar este miembro de esta asociación',
        'Eliminar',
        'No estoy seguro'
      )
      .then((result) => {
        if (result == true) {
          let estado = usuario.estado_solicitud;
          let enviadaPor = usuario.solicitud_enviada_por;
          usuario.estado_solicitud = null;
          usuario.solicitud_enviada_por = null;
          this.asociacionService.eliminarSolicitud(usuario.id_solicitud).subscribe(
            (response)=>{
              console.log(response)
            },err=>{
          usuario.estado_solicitud = estado;
          usuario.solicitud_enviada_por = enviadaPor;
          console.log(err)
          }
        )
        }
      }).catch((result) => {});
    }
    else if(usuario.estado_solicitud == 'Enviada'){
      let estado = usuario.estado_solicitud;
      let enviadaPor = usuario.solicitud_enviada_por;
      usuario.estado_solicitud = null;
      usuario.solicitud_enviada_por = null;
      this.asociacionService.eliminarSolicitud(usuario.id_solicitud).subscribe(
        (response)=>{
          console.log(response)
        },err=>{
          usuario.estado_solicitud = estado;
          usuario.solicitud_enviada_por = enviadaPor;
          console.log(err)
        }
      )
    }else{
      let data = {
        quienEnvia : 'asociacion',
        id_usuario_receptor : usuario.id
      }
      usuario.estado_solicitud = 'Enviada';
      usuario.solicitud_enviada_por = 'asociacion'
      this.asociacionService.invitarUsuario(data,this.nit).subscribe(
        (response)=>{
          console.log(response)
          usuario.id_solicitud = response.body.insertId;
          console.log("usuario.id_solicitud ",usuario.id_solicitud)
        },err=>{
          usuario.estado_solicitud = null;
          usuario.solicitud_enviada_por = null
          console.log(err)     
        }
      )
    }
  }

  onSearch(text:string){
    if(this.selectedTab == 'piscicultores'){
      console.log("piscicultores ",text)
      if(text == ''){
        this.piscicultoresFiltered = this.piscicultores;
      }else{
        this.piscicultoresFiltered = this.piscicultores.filter((element)=>{
          return element.nombres.toLocaleLowerCase().includes(text.toLocaleLowerCase());
        })
      }
    }else{
      console.log("pescadores ",text)
      if(text == ''){
        this.pescadoresFiltered = this.piscicultores;
      }else{
        this.pescadoresFiltered = this.pescadores.filter((element)=>{
          return element.nombres.toLowerCase().includes(text.toLocaleLowerCase());
        })
      }
    }
  }

}

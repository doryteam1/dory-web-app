import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { AsociacionesService } from '../../services/asociaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-asociacion-detalle',
  templateUrl: './asociacion-detalle.component.html',
  styleUrls: ['./asociacion-detalle.component.scss'],
})
export class AsociacionDetalleComponent implements OnInit {
  selectedAsociacionnit: number = -1;
  asociacion: any;
  piscicultorasociaciones: any;
  piscicultorgranjas: any;
  piscicultorshowNotFound: boolean = false;
  pescadorshowNotFound: boolean = false;
  asociacionesshowNotFound: boolean = false;
  asociacionesshowError: boolean = false;
  pescadorshowError: boolean = false;
  piscicultorshowError: boolean = false;
  errorMessage = '';
  activatelistpiscicultores: boolean = false;
  activatelistpescadores: boolean = false;
  pescadorchangeItem: boolean = true;
  piscicultorchangeItem: boolean = true;
  pescadorasociaciones: any;
  datapiscicultorasociaciones: boolean = false;
  tipoUsuario: any;
  numeroMujeres:number = 0;
  numeroHombres:number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private asociacionesService: AsociacionesService,
    private router: Router,
    private piscicultoresService: PiscicultoresService,
    private pescadoresService: PescadoresService,
    private asociacionService: AsociacionesService,
    private appModalService:AppModalService,
    public userService:UsuarioService
  ) {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if(token && token!='undefined'){
      this.tipoUsuario = Utilities.parseJwt(token!).rol;
    }

    this.selectedAsociacionnit = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.asociacionesService
      .getAsociacionDetalle(this.selectedAsociacionnit)
      .subscribe(
        (response) => {
          console.log(response.data[0])
          this.asociacion = response.data[0];
          if (response.data.length > 0) {
            this.asociacionesshowError = false;
            this.asociacionesshowNotFound = false;
          } else {
            this.asociacionesshowNotFound = true;
            this.asociacionesshowError = false;
          }
        },
        (err) => {
          this.asociacionesshowNotFound = false;
          this.asociacionesshowError = false;
          if (err.status == 404) {
            this.asociacionesshowNotFound = true;
          } else {
            this.asociacionesshowError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );
    this.pescadoresPorAsociacions();
  }
  async pescadoresPorAsociacions() {
    try {
      let response: any = await this.pescadoresService
        .getPescadoresPorAsociacion(this.selectedAsociacionnit)
        .toPromise();
      this.pescadorasociaciones = response.data;
      console.log(this.pescadorasociaciones)
      await this.piscicultorPorAsociacion();
      this.activeTabVerifi();
      if (response.data.length > 0) {
        this.pescadorshowError = false;
        this.pescadorshowNotFound = false;
        this.pescadorchangeItem = false;
      } else {
        this.pescadorshowNotFound = true;
        this.pescadorshowError = false;
        this.pescadorchangeItem = false;
      }

    } catch (err: any) {
      this.pescadorshowNotFound = false;
      this.pescadorshowError = false;
      this.pescadorchangeItem = false;
      if (err.status == 404) {
        this.pescadorshowNotFound = true;
      } else {
        this.pescadorshowError = true;
        this.errorMessage = 'Error inesperado';
      }
    }
  }
  async piscicultorPorAsociacion() {
    try {
      let response: any = await this.piscicultoresService
        .getPiscicultorPorAsociacion(this.selectedAsociacionnit)
        .toPromise();
      this.piscicultorasociaciones = response.data;
      console.log(this.piscicultorasociaciones);
      if (response.data.length > 0) {
        this.piscicultorshowError = false;
        this.piscicultorshowNotFound = false;
        this.piscicultorchangeItem = false;
      } else {
        this.piscicultorshowNotFound = true;
        this.piscicultorshowError = false;
        this.piscicultorchangeItem = false;
      }
    } catch (err: any) {
      this.piscicultorshowNotFound = false;
      this.piscicultorshowError = false;
      this.piscicultorchangeItem = false;
      if (err.status == 404) {
        this.piscicultorshowNotFound = true;
      } else {
        this.piscicultorshowError = true;
        this.errorMessage = 'Error inesperado';
      }
    }
    this.calcNumberoHombresMujeres();
  }

  activeTabVerifi() {
    if (
      this.piscicultorasociaciones.length > 0 &&
      this.pescadorasociaciones.length > 0
    ) {
      this.activatelistpiscicultores = true;
      this.activatelistpescadores = false;
    } else if (
      this.piscicultorasociaciones.length > 0 &&
      this.pescadorasociaciones.length <= 0
    ) {
      this.activatelistpiscicultores = true;
      this.activatelistpescadores = false;
    } else if (
      this.piscicultorasociaciones.length <= 0 &&
      this.pescadorasociaciones.length  > 0
    ) {
      console.log('hello3');
      this.activatelistpiscicultores = false;
      this.activatelistpescadores = true;
    }
  }

  activeTabClick(i: number) {
    if (i == 1) {
      this.activatelistpiscicultores = true;
      this.activatelistpescadores = false;
    } else if (i == 2) {
      this.activatelistpescadores = true;
      this.activatelistpiscicultores = false;
    }
  }
  gopiscicultorDetail(piscicultor: any) {
    console.log(piscicultor);
    this.router.navigateByUrl(
      'piscicultores/municipio/detalle/' + piscicultor.id
    );
  }
  gopescadorDetail(pescador: any) {
    console.log(pescador);
    this.router.navigateByUrl('pescadores/municipio/detalle/' + pescador.id);
  }
  goDetalleRepresentante() {
    console.log('representante legal');

    console.log(this.asociacion.tipo_propietario);
    if (this.asociacion.tipo_propietario == 'Pescador') {
      this.router.navigateByUrl(
        '/pescadores/municipio/detalle/' + this.asociacion.id_propietario
      );
    } else if (this.asociacion.tipo_propietario == 'Piscicultor') {
      this.router.navigateByUrl(
        '/piscicultores/municipio/detalle/' + this.asociacion.id_propietario
      );
    }
  }

  invitarAnular(asociacion:any){
    if(asociacion.estado_solicitud == 'Aceptada'){
      this.appModalService
      .confirm(
        'Salir de la asociación',
        'Usted ya no es miembro de esta asociación',
        'No soy miembro',
        'Cancelar'
      )
      .then((result) => {
        if (result == true) {
          let estado = asociacion.estado_solicitud;
          let enviadaPor = asociacion.solicitud_enviada_por;
          asociacion.estado_solicitud = null;
          asociacion.solicitud_enviada_por = null;
          this.asociacionService.eliminarSolicitud(asociacion.id_solicitud).subscribe(
            (response)=>{
              console.log(response)
            },err=>{
          asociacion.estado_solicitud = estado;
          asociacion.solicitud_enviada_por = enviadaPor;
          console.log(err)
          }
        )
        }
      }).catch((result) => {});
    }
    else if(asociacion.estado_solicitud == 'Enviada'){
      let estado = asociacion.estado_solicitud;
      let enviadaPor = asociacion.solicitud_enviada_por;
      asociacion.estado_solicitud = null;
      asociacion.solicitud_enviada_por = null;
      this.asociacionService.eliminarSolicitud(asociacion.id_solicitud).subscribe(
        (response)=>{
          console.log(response)
        },err=>{
          asociacion.estado_solicitud = estado;
          asociacion.solicitud_enviada_por = enviadaPor;
          console.log(err)
        }
      )
    }else{
      let data = {
        quienEnvia : 'usuario'
      }
      asociacion.estado_solicitud = 'Enviada';
      asociacion.solicitud_enviada_por = 'usuario'
      this.asociacionService.invitarUsuarioAsociacion(data,asociacion.nit).subscribe(
        (response)=>{
          console.log(response)
          asociacion.id_solicitud = response.body.insertId;
        },err=>{
          asociacion.estado_solicitud = null;
          asociacion.solicitud_enviada_por = null
          console.log(err)
        }
      )
    }
  }

  calcNumberoHombresMujeres(){
    this.numeroHombres = 0;
    this.numeroMujeres = 0;

    console.log("pescadores: ",this.pescadorasociaciones)
    console.log("piscicultores: ",this.piscicultorasociaciones)
    this.pescadorasociaciones.forEach((pescador:any) => {
      if(pescador.sexo == 'Femenino'){
        this.numeroMujeres++;
      }else if(pescador.sexo == 'Masculino'){
        this.numeroHombres++;
      }
    });

    this.piscicultorasociaciones.forEach((piscicultor:any) => {
      if(piscicultor.sexo == 'Femenino'){
        this.numeroMujeres++;
      }else if(piscicultor.sexo == 'Masculino'){
        this.numeroHombres++;
      }
    });
  }
  
}

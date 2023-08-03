import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { AsociacionesService } from '../../services/asociaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlatformLocation } from '@angular/common';
import { EvaluateRegisteredUserService } from 'src/app/services/evaluate-registered-user.service';

@Component({
  selector: 'app-asociacion-detalle',
  templateUrl: './asociacion-detalle.component.html',
  styleUrls: ['./asociacion-detalle.component.scss'],
})
export class AsociacionDetalleComponent implements OnInit {
  selectedAsociacionnit: any = -1;
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
  pescadorchangeItem: boolean = true;
  piscicultorchangeItem: boolean = true;
  pescadorasociaciones: any;
  datapiscicultorasociaciones: boolean = false;
  tipoUsuario: any;
  numeroMujeres: number = 0;
  numeroHombres: number = 0;
  activatelistgranjas: boolean = false;
  activatelistpiscicultores: boolean = false;
  activatelistpescadores: boolean = false;
  granjasAsociacion: any[] = [];
  granjaShowError: boolean = false;
  granjaShowNotFound: boolean = false;
  granjaChangeItem: boolean = false;
  urls: any[] = [];
  idEmailUser!: number;
  hasDocument: boolean = false;
  authUserId: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private asociacionesService: AsociacionesService,
    private router: Router,
    private piscicultoresService: PiscicultoresService,
    private pescadoresService: PescadoresService,
    private asociacionService: AsociacionesService,
    private appModalService: AppModalService,
    public userService: UsuarioService,
    private granjasService: GranjasService,
    private utilitiesService: UtilitiesService,
    private firebaseStorageService: FirebaseStorageService,
    public location2: PlatformLocation,
    public evaluateRegisteredUserService: EvaluateRegisteredUserService
  ) {}

  ngOnInit(): void {
    this.selectedAsociacionnit = Number(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    let token = localStorage.getItem('token');
    if (token && token != 'undefined') {
      this.tipoUsuario = Utilities.parseJwt(token!).rol;
    }
    let email = localStorage.getItem('email');
    if (email) {
      this.userService.getUsuarioByEmail(email).subscribe((response) => {
        this.idEmailUser = response.data[0].id;
      });
    }

    this.asociacionesService
      .getAsociacionDetalle(this.selectedAsociacionnit)
      .subscribe(
        (response) => {
          this.asociacion = response.data[0];
          this.authUserId = this.evaluateRegisteredUserService.evaluateUser(
            this.asociacion.id_propietario
          );
          if (response.data.length > 0) {
            this.asociacionesshowError = false;
            this.asociacionesshowNotFound = false;
          } else {
            this.asociacionesshowNotFound = true;
            this.asociacionesshowError = false;
          }
        },
        (err) => {
          console.log(err);
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
    this.asociacionesService
      .getMiembrosPrivado(this.selectedAsociacionnit)
      .subscribe((response) => {
        let representante = response.data.representante;
        let miembros = response.data.miembros;
        if (representante.url_imagen_cedula || representante.url_sisben) {
          this.hasDocument = true;
        } else {
          let index = miembros.findIndex((miembro: any) => {
            if (miembro.url_imagen_cedula || miembro.url_sisben) {
              return true;
            } else {
              return false;
            }
          });
          if (index > -1) {
            this.hasDocument = true;
          } else {
            this.hasDocument = false;
          }
        }
      });
    this.pescadoresPorAsociacions();
    this.granjasPorAsociacion();
  }
  sendMessage() {
    this.evaluateRegisteredUserService.sendMessageOpenChat(
      this.asociacion.id_propietario,
      ', para enviarle un mensaje a este usuario'
    );
  }
  granjasPorAsociacion() {
    this.granjasService
      .getGranjasByNitAsociacion(this.selectedAsociacionnit)
      .subscribe(
        (response) => {
          this.granjasAsociacion = response.data;
          if (response.data.length > 0) {
            this.granjaShowError = false;
            this.granjaShowNotFound = false;
            this.granjaChangeItem = false;
          } else {
            this.granjaShowNotFound = true;
            this.granjaShowError = false;
            this.granjaChangeItem = false;
          }
        },
        (err) => {
          this.granjaShowNotFound = false;
          this.granjaShowError = false;
          this.granjaChangeItem = false;
          if (err.status == 404) {
            this.granjaShowNotFound = true;
          } else {
            this.granjaShowError = true;
            this.errorMessage = 'Error inesperado';
          }
        }
      );
  }
  async pescadoresPorAsociacions() {
    try {
      let response: any = await this.pescadoresService
        .getPescadoresPorAsociacion(this.selectedAsociacionnit)
        .toPromise();
      this.pescadorasociaciones = response.data;
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
      this.pescadorasociaciones.length > 0
    ) {
      this.activatelistpiscicultores = false;
      this.activatelistpescadores = true;
    }
  }

  activeTabClick(i: number) {
    if (i == 1) {
      this.activatelistpiscicultores = true;
      this.activatelistpescadores = false;
      this.activatelistgranjas = false;
    } else if (i == 2) {
      this.activatelistpescadores = true;
      this.activatelistpiscicultores = false;
      this.activatelistgranjas = false;
    } else if (i == 3) {
      this.activatelistpescadores = false;
      this.activatelistpiscicultores = false;
      this.activatelistgranjas = true;
    }
  }
  gopiscicultorDetail(piscicultor: any) {
    this.router.navigateByUrl(
      'piscicultores/municipio/detalle/' + piscicultor.id
    );
  }
  gopescadorDetail(pescador: any) {
    this.router.navigateByUrl('pescadores/municipio/detalle/' + pescador.id);
  }
  goDetalleRepresentante() {
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

  invitarAnular(asociacion: any) {
    if (asociacion.estado_solicitud == 'Aceptada') {
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
            this.asociacionService
              .eliminarSolicitud(asociacion.id_solicitud)
              .subscribe(
                (response) => {
                  console.log(response);
                },
                (err) => {
                  asociacion.estado_solicitud = estado;
                  asociacion.solicitud_enviada_por = enviadaPor;
                  console.log(err);
                }
              );
          }
        })
        .catch((result) => {});
    } else if (asociacion.estado_solicitud == 'Enviada') {
      let estado = asociacion.estado_solicitud;
      let enviadaPor = asociacion.solicitud_enviada_por;
      asociacion.estado_solicitud = null;
      asociacion.solicitud_enviada_por = null;
      this.asociacionService
        .eliminarSolicitud(asociacion.id_solicitud)
        .subscribe(
          (response) => {
            console.log(response);
          },
          (err) => {
            asociacion.estado_solicitud = estado;
            asociacion.solicitud_enviada_por = enviadaPor;
            console.log(err);
          }
        );
    } else {
      let data = {
        quienEnvia: 'usuario',
      };
      asociacion.estado_solicitud = 'Enviada';
      asociacion.solicitud_enviada_por = 'usuario';
      this.asociacionService
        .invitarUsuarioAsociacion(data, asociacion.nit)
        .subscribe(
          (response) => {
            console.log(response);
            asociacion.id_solicitud = response.body.insertId;
          },
          (err) => {
            asociacion.estado_solicitud = null;
            asociacion.solicitud_enviada_por = null;
            console.log(err);
          }
        );
    }
  }

  calcNumberoHombresMujeres() {
    const countHombresMujeres = (contador: any, persona: any) => {
      console.log(persona);
      console.log(contador);
      if (persona.sexo === 'Femenino') {
        console.log('Mujer');
        contador.mujeres++;
      } else if (persona.sexo === 'Masculino') {
        console.log('Hombre');
        contador.hombres++;
      }
      console.log(contador);
      return contador;
    };

    const contadorInicial = { hombres: 0, mujeres: 0 };
    const resultado = [
      ...this.pescadorasociaciones,
      ...this.piscicultorasociaciones,
    ].reduce(countHombresMujeres, contadorInicial);
    console.log(resultado);
    this.numeroHombres = resultado.hombres;
    this.numeroMujeres = resultado.mujeres;

    console.log(this.numeroMujeres);
    console.log(this.numeroHombres);
  }

  /*  calcNumberoHombresMujeres() {
    this.numeroHombres = this.pescadorasociaciones
      .concat(this.piscicultorasociaciones)
      .reduce((totalHombres: number, persona: any) => {
        console.log(persona)
        if (persona.sexo === 'Masculino') {
          totalHombres++;
        }
        return totalHombres;
      }, 0);

    this.numeroMujeres = this.pescadorasociaciones
      .concat(this.piscicultorasociaciones)
      .reduce((totalMujeres: number, persona: any) => {
         console.log(persona);
        if (persona.sexo === 'Femenino') {
          totalMujeres++;
        }
        return totalMujeres;
      }, 0);

    console.log(this.numeroMujeres);
    console.log(this.numeroHombres);
  }
 */
  download() {
    try {
      this.asociacionesService
        .getMiembrosPrivado(this.asociacion.nit)
        .subscribe(async (response) => {
          let representante = response.data.representante;
          let miembros = response.data.miembros;
          if (representante) {
            if (representante.url_imagen_cedula) {
              let cedulaBase64 = await this.utilitiesService.urlToBase64(
                representante.url_imagen_cedula
              );
              let metaCedula = await this.firebaseStorageService
                .refFromUrl(representante.url_imagen_cedula)
                .getMetadata()
                .toPromise();
              this.urls.push({
                data:
                  'cedulas/cedula-rep-' +
                  representante.nombres.replace(/\s+/g, '') +
                  '.' +
                  metaCedula.name.split('.')[1],
                url: representante.url_imagen_cedula,
                image: cedulaBase64,
              });
            }

            if (representante.url_sisben) {
              let sisbenBase64 = await this.utilitiesService.urlToBase64(
                representante.url_sisben
              );
              let metaSisben = await this.firebaseStorageService
                .refFromUrl(representante.url_sisben)
                .getMetadata()
                .toPromise();
              this.urls.push({
                data:
                  'sisben/sisben-rep-' +
                  representante.nombres.replace(/\s+/g, '') +
                  '.' +
                  metaSisben.name.split('.')[1],
                url: representante.url_sisben,
                image: sisbenBase64,
              });
            }
          }
          if (miembros) {
            for (let i = 0; i < miembros.length; i++) {
              if (miembros[i].url_imagen_cedula) {
                let cedulaBase64 = await this.utilitiesService.urlToBase64(
                  miembros[i].url_imagen_cedula
                );
                let metaCedula = await this.firebaseStorageService
                  .refFromUrl(miembros[i].url_imagen_cedula)
                  .getMetadata()
                  .toPromise();
                this.urls.push({
                  data:
                    'cedulas/cedula-' +
                    miembros[i].nombres.replace(/\s+/g, '') +
                    '.' +
                    metaCedula.name.split('.')[1],
                  url: miembros[i].url_imagen_cedula,
                  image: cedulaBase64,
                });
              }
              if (miembros[i].url_sisben) {
                let sisbenBase64 = await this.utilitiesService.urlToBase64(
                  miembros[i].url_sisben
                );
                let metaSisben = await this.firebaseStorageService
                  .refFromUrl(miembros[i].url_sisben)
                  .getMetadata()
                  .toPromise();
                this.urls.push({
                  data:
                    'sisben/sisben-' +
                    miembros[i].nombres.replace(/\s+/g, '') +
                    '.' +
                    metaSisben.name.split('.')[1],
                  url: miembros[i].url_sisben,
                  image: sisbenBase64,
                });
              }
            }
          }
          this.utilitiesService.compressFileToZip(this.urls);
        });
    } catch (err) {
      console.log(err);
    }
  }

  goDetailFarm(idgranja: any) {
    this.router.navigateByUrl('/granjas/municipio/detalle/' + idgranja);
  }
  changeFavorite(i: number) {
    this.granjasAsociacion[i].favorita =
      this.granjasAsociacion[i].favorita == 1 ? 0 : 1;
    this.granjasService
      .esFavorita(this.granjasAsociacion[i].id_granja)
      .subscribe(
        (response) => {},
        (err) => {
          console.log(err);
          this.granjasAsociacion[i].favorita =
            this.granjasAsociacion[i].favorita == 1 ? 0 : 1;
        }
      );
  }
  showResenas(idGranja: number) {
    this.granjasService.showResenasModal('Reseñas', 'Cerrar', idGranja);
  }
  getImgClasses(
    changeItem: boolean,
    ShowNotFound: boolean,
    dataLength: boolean
  ): string {
    let classes = 'container-card';
    if (changeItem) {
      classes += ' mychangeitemheight';
    }
    if (ShowNotFound) {
      classes += ' search-container--flex';
    }
    if (dataLength) {
      classes += ' container--flex-center';
    }
    return classes;
  }
}

import { Component,OnDestroy,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GranjasService } from '../../services/granjas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utilities } from 'src/app/utilities/utilities';
import { PlatformLocation } from '@angular/common'
import { AppModalService } from '../../../shared/services/app-modal.service';
import * as dayjs from 'dayjs'
import { Subscription } from 'rxjs';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EvaluateRegisteredUserService } from 'src/app/services/evaluate-registered-user.service';

@Component({
  selector: 'app-granja-detalle',
  templateUrl: './granja-detalle.component.html',
  styleUrls: ['./granja-detalle.component.scss'],
})
export class GranjaDetalleComponent implements OnInit, OnDestroy {
  granja: any;
  fotosgranja: any = [];
  showNotFound: boolean = false;
  showError: boolean = false;
  selectedGranjaId: number = -1;
  errorMessage = '';
  showGallery: boolean = false;
  imgsele: boolean = false;
  indice!: number;
  imgmauseover: boolean = false;
  showconte: boolean = false;
  imgselecmodal!: number;
  resenas: Array<any> = [];
  showErrorFound: boolean = false;
  puntuacion: any;
  rating: number = -1;
  descResena: string = '';
  loading: boolean = false;
  success: boolean = false;
  shadoweffectindice!: number;
  showconteslaider: boolean = false;
  valorindicecarrucel!: number;
  sinfotos: boolean = false;
  userToken: string | null = '';
  authUserId:boolean =false;
  miresena: any;
  editedDescResena: string = '';
  editingMiResena: boolean = false;
  currentRate: any;
  showResenasNotFound: boolean = false;
  arrayFotosGranja: any[] = [];
  modalGogleMapOpen: boolean = false;
  isAuthUser: boolean = false;
  fotosgranjaLength: number = 0;
  showLightbox: boolean = false;
  userId: boolean = false;
  constructor(
    private granjasService: GranjasService,
    private activatedRoute: ActivatedRoute,
    public location: PlatformLocation,
    private modalService: NgbModal,
    private appModalService: AppModalService,
    public mediaQueryService: MediaQueryService,
    public userService: UsuarioService,
    private router: Router,
    public evaluateRegisteredUserService: EvaluateRegisteredUserService
  ) {}
  mediaQuery1!: Subscription;
  ngOnInit(): void {
    this.isAuthUser = this.userService.isAuthenticated();
    this.rating = -1;
    this.selectedGranjaId = Number(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.userToken = localStorage.getItem('token');
    if (this.userToken) {
      this.granjasService
      .resenasUserByIdGranja(this.selectedGranjaId)
      .subscribe(
        (response) => {
          this.miresena = response.data.resena;
          this.editedDescResena = this.miresena?.descripcion;
        },
        (err) => {}
        );
      }


    this.granjasService.getGranjaDetalle(this.selectedGranjaId).subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.granja = response.data[0];
          this.currentRate = this.granja?.puntuacion;
          this.fotosgranja = response.data[0].fotos;
            this.userId = this.evaluateRegisteredUserService.evaluateUser(
              this.granja.propietarios[0].id_propietario
            );
          this.fotosgranjaLength = this.fotosgranja.length;
          if (this.fotosgranja.length == 0) {
            this.sinfotos = true;
          }
          this.showError = false;
          this.showNotFound = false;
        } else {
          this.showNotFound = true;
          this.showError = false;
        }
      },
      (err) => {
        this.showNotFound = false;
        this.showError = false;
        if (err.status == 404) {
          this.showNotFound = true;
        } else {
          this.showError = true;
          this.errorMessage = 'Error inesperado';
        }
      }
    );

    this.granjasService.resenasById(this.selectedGranjaId).subscribe(
      (response) => {
        this.resenas = response.data.resenas;
        this.puntuacion = response.data.puntaje;
        if (this.resenas.length < 1) {
          this.showResenasNotFound = true;
        } else {
          this.showResenasNotFound = false;
        }
      },
      (err) => {
        this.showResenasNotFound = false;
        this.showErrorFound = true;
        console.log(err);
      }
    );
    this.mediaQuery1 = this.mediaQueryService
      .mediaQuery('max-width: 1009px')
      .subscribe((matches) => {
        if (matches) {
          this.appModalService.CloseModalGalleryVerAdiconarEliminarFotos();
        } else {
          this.appModalService.CloseGoogleMapGeneralModal();
        }
      });
  }
  sendMessage() {
    this.evaluateRegisteredUserService.sendMessageOpenChat(
      this.granja.propietarios[0].id_propietario,
      ', para enviarle un mensaje a este usuario'
    );
  }
  goDetallePropietario(){
     this.router.navigateByUrl(
       '/piscicultores/municipio/detalle/' +
         this.granja.propietarios[0].id_propietario
     );
  }
  ngOnDestroy(): void {
    this.mediaQuery1.unsubscribe();
  }
  fotoSele(i: number) {
    if (this.fotosgranja?.length != 1) {
      this.shadoweffectindice = i;
      this.imgselecmodal = -1;
      this.valorindicecarrucel = -1;
      this.OpenGalleryModalOptionOne();
    } else {
      this.fotoSeleLightbox();
    }
  }
  fotoSeleLightbox() {
    this.shadoweffectindice = -1;
    this.imgselecmodal = -1;
    this.valorindicecarrucel = -1;
    this.showLightbox = !this.showLightbox;
  }

  imgSelecionadaModal(i: number) {
    this.imgselecmodal = i;
    this.indice = -1;
    this.showconte = true;
  }
  imgMause() {
    this.imgmauseover = true;
    this.indice = -1;
  }

  openQualifyModal(content: any, editingMiResena?: number) {
    if (this.isAuthUser) {
      if (editingMiResena && editingMiResena == 1) {
        this.rating = -1;
        this.descResena = this.miresena.descripcion;
        this.editingMiResena = true;
      } else {
        this.editingMiResena = false;
      }
      this.modalService
        .open(content, {
          ariaLabelledBy: 'modal-basic-title',
          windowClass: 'qualify-modal',
          scrollable: true,
          centered: true,
        })
        .result.then(
          (result) => {
            this.success = false;
            this.descResena = '';
            this.editingMiResena = false;
            this.ngOnInit();
          },
          (reason) => {
            this.success = false;
            this.descResena = '';
            this.editingMiResena = false;
            this.ngOnInit();
          }
        );
    } else if (!this.isAuthUser) {
      this.modalRegistrate();
    }
  }
  modalRegistrate() {
    this.location.onPopState(() => {
      this.appModalService.closeModalAlertSignu();
    });
    this.appModalService
      .modalAlertSignu()
      .then((result: any) => {
        if (result == 'registrate') {
          this.router.navigate(['/registro']);
        } else if (result == 'ingresar') {
          this.router.navigate(['/login']);
        }
      })
      .catch((result) => {});
  }
  changeFavorite() {
    if (this.isAuthUser) {
      this.granja.favorita = this.granja.favorita == 1 ? 0 : 1;
      this.granjasService.esFavorita(this.granja.id_granja).subscribe(
        (response) => {},
        (err) => {
          console.log(err);
          this.granja.favorita = this.granja.favorita == 1 ? 0 : 1;
        }
      );
    } else if (!this.isAuthUser) {
      this.modalRegistrate();
    }
  }

  showResenas(granja: any) {
    this.granjasService.showResenasModal(
      `Reseñas (${granja?.count_resenas})`,
      'Cerrar',
      granja.id_granja
    );
  }

  onRating(event: number) {
    if (this.isAuthUser) {
      this.rating = event;
    }
  }

  publicarResena() {
    if (this.rating < 1) {
      return;
    }
    let resena = {
      id_granja: this.granja.id_granja,
      descripcion: this.descResena,
      fecha: Utilities.dateNow(),
      calificacion: this.rating,
    };
    this.loading = true;
    if (this.editingMiResena) {
      this.granjasService.updateResena(resena, this.miresena.id).subscribe(
        (respose) => {
          this.loading = false;
          this.success = true;
        },
        (err) => {
          this.loading = false;
        }
      );
    } else {
      this.granjasService.addResena(resena).subscribe(
        (respose) => {
          this.loading = false;
          this.success = true;
        },
        (err) => {
          this.loading = false;
        }
      );
    }
  }

  acumCalif() {
    let calif = 0;
    this.granja.resenas.forEach((resena: any) => {
      calif += resena.calificacion;
    });
    return calif;
  }
  OpenGalleryModalOptionTwo() {
    this.shadoweffectindice = -1;
    this.valorindicecarrucel = -1;
    this.imgselecmodal = -1;
    this.OpenGalleryModalOptionOne();
  }
  OpenGalleryModalOptionOne() {
    this.location.onPopState(() => {
      this.appModalService.CloseModalGalleryVerAdiconarEliminarFotos();
      //  detecta  cuando se da click atras detecta y cierra la cualquiera modal activa
    });
    //  console.log( this.location.pushState(null, '', location.pathname))

    let showconteslaider = false;
    let veryadicionar = false;
    let arrayFotos = this.fotosgranja;
    let action = 'create';
    this.appModalService
      .modalGalleryVerAdiconarEliminarFoto(
        this.shadoweffectindice,
        this.imgselecmodal,
        this.valorindicecarrucel,
        showconteslaider,
        veryadicionar,
        arrayFotos,
        '',
        action
      )
      .then((result: any) => {})
      .catch((result) => {});
  }
  myFunction(id: string) {
    document.getElementById(id)!.classList.toggle('show');
  }

  deleteResena(id: number) {
    this.granjasService.deleteResena(id).subscribe(
      (response) => {
        let index = this.resenas.findIndex((resena) => {
          return resena.id == id;
        });
        this.resenas.splice(index, 1);
        this.miresena = null;
        this.ngOnInit();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateMiResena() {
    this.loading = true;
  }

  shareFuntion() {
    this.location.onPopState(() => {
      this.appModalService.closeModalShare();
    });
    this.appModalService
      .shared(
        'Compartir detalles de la granja',
        false,
        '',
        `Echa un vistazo a la granja piscícola: ${this.granja.nombre}`
      )
      .then((result) => {})
      .catch((result) => {});
  }

  dateToString(date: string) {
    return (
      dayjs(date).date() +
      '/' +
      (dayjs(date).month() < 10
        ? 0 + dayjs(date).month().toString()
        : dayjs(date).month()) +
      '/' +
      dayjs(date).year()
    );
  }
  ModalGoogleMap() {
    this.modalGogleMapOpen = true;
    let modalheadergooglemap = false;
    let shared = false;
    let atributos = {
      longAndLat: {
        lat: this.granja.latitud,
        lng: this.granja.longitud,
      },
      mapInfoWindowData: [
        {
          icon: 'assets/icons/person_black.svg',
          dataNombre: this.granja.nombre,
          sinDataNombre: 'Nombre indefinido',
        },
        {
          icon: 'assets/icons/person_pin_circle_black_24dp.svg',
          dataNombre: this.granja.direccion,
          sinDataNombre: 'Dirección indefinida',
        },
      ],
      nombreAtributo: {
        dato1: 'Compartir ubicación de la granja',
      },
    };
    let iconMarkerGoogleMap = 'assets/icons/fish-marker.svg';
    this.location.onPopState(() => {
      this.appModalService.CloseGoogleMapGeneralModal();
    });
    this.appModalService
      .GoogleMapModalGeneral(
        atributos,
        modalheadergooglemap,
        iconMarkerGoogleMap,
        false,
        '',
        shared
      )
      .then((result) => {
        this.modalGogleMapOpen = false;
      })
      .catch((result) => {
        this.modalGogleMapOpen = false;
      });
  }

  getPhotoContainerClass() {
    let className = 'photo-container-padre';
    if (this.fotosgranjaLength <= 1) {
      className += ' photo-container1-div';
    } else if (this.fotosgranjaLength == 2) {
      className += ' photo-container2-div';
    } else if (this.fotosgranjaLength == 3) {
      className += ' photo-container3-div';
    } else if (this.fotosgranjaLength == 4) {
      className += ' photo-container4-div';
    } else if (this.fotosgranjaLength == 5) {
      className += ' photo-container5-div';
    } else if (this.fotosgranjaLength == 6) {
      className += ' photo-container6-div';
    } else if (this.fotosgranjaLength >= 7) {
      className += ' photo-container7-div';
    }
    return className;
  }
}








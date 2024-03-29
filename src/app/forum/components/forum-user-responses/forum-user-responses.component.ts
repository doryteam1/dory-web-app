import { PlatformLocation } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommunicateDataService } from 'src/app/services/communicate-data.service';
import { EvaluateRegisteredUserService } from 'src/app/services/evaluate-registered-user.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { ForumService } from 'src/app/services/forum.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';

@Component({
  selector: 'app-forum-user-responses',
  templateUrl: './forum-user-responses.component.html',
  styleUrls: ['./forum-user-responses.component.scss'],
})
export class ForumUserResponsesComponent implements OnInit, OnDestroy {
  showErrorAnswers = false;
  showNotFoundAnswers = false;
  loadingAnswers = false;
  showErrorQuestion = false;
  showNotFoundQuestion = false;
  loadingQuestion = true;
  showForm: boolean = false;
  isAuthUser: boolean = false;
  filtroseleccionado: boolean = false;
  selectedPreguntaId!: number;
  respuestas: any[] = [];
  respuestasCopia: any[] = [];
  preguntaUser: any;
  tipoFiltro: number = 0;
  nombreFiltro: string = '';
  messageError: string = 'No encontramos resultados para esta búsqueda';

  filtros: any[] = [
    /*   {
      nombre: 'Más recientes',
      tipo: 0,
    }, */
    {
      nombre: 'Más antiguos',
      tipo: 1,
    },
  ];

  /* Paginación */
  page: number = 1;
  pageSize: number = 10;
  collectionSize: number = 0;
  maxSize: number = 2;
  showPagination: boolean = false;
  SubsCommunicateData!: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private forumService: ForumService,
    public userService: UsuarioService,
    public evaluateRegisteredUserService: EvaluateRegisteredUserService,
    public location: PlatformLocation,
    private appModalService: AppModalService,
    private router: Router,
    private storage: FirebaseStorageService,
    private communicateDataService: CommunicateDataService
  ) {
    this.SubsCommunicateData =
      this.communicateDataService.currentUser.subscribe((active: any) => {
        if (active) {
          this.reloadAnswers(this.selectedPreguntaId);
          this.page = 1;
        }
      });
  }

  ngOnInit(): void {
    this.selectedPreguntaId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
    this.isAuthUser = this.userService?.isAuthenticated();
    this.reloadQuestion(this.selectedPreguntaId);
  }
  ngOnDestroy(): void {
    this.SubsCommunicateData.unsubscribe();
  }
  reloadQuestion(idPregunta: number) {
    this.showErrorQuestion = false;
    this.showNotFoundQuestion = false;
    this.forumService.getPreguntaDetalles(idPregunta).subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.preguntaUser = response.data[0];
          this.loadingQuestion = false;
          this.loadingAnswers = true;
          this.reloadAnswers(this.selectedPreguntaId);
        } else {
          this.loadingQuestion = false;
          this.showNotFoundQuestion = true;
        }
      },
      (err) => {
        console.log(err);
        if (err.status == 404) {
          this.messageError = err.error.message;
        }
        this.loadingQuestion = false;
        this.showErrorQuestion = true;
      }
    );
  }

  reloadAnswers(idPregunta: number) {
    this.showErrorAnswers = false;
    this.showNotFoundAnswers = false;
    this.tipoFiltro = 0;
    this.filtroseleccionado = false;
    this.forumService.getRespuestasPregunta(idPregunta).subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.respuestas = response.data;
          this.loadingAnswers = false;
          this.resetOfSearch();
        } else {
          this.loadingAnswers = false;
          this.showNotFoundAnswers = true;
        }
      },
      (err) => {
        console.log(err);
        this.loadingAnswers = false;
        this.showErrorAnswers = true;
      }
    );
  }

  /*  */
  deleteRespuesta(idRespuesta: number, imagen: any[]) {
    this.messageError = '';
    this.location.onPopState(() => {
      this.appModalService.closeModalAlertSignu();
    });
    this.appModalService
      .confirm(
        'Eliminar respuesta',
        'Está seguro que desea eliminar esta respuesta',
        'Sí',
        'No',
        ''
      )
      .then((result) => {
        if (result) {
          let idx = this.respuestas.findIndex(
            (element) => element.id === idRespuesta
          );
          if (idx != -1) {
            this.forumService.deleteRespuesta(idRespuesta).subscribe(
              (response) => {
                this.respuestas.splice(idx, 1);
                if (imagen.length > 0) {
                  this.storage.deleteMultipleByUrls(imagen);
                }
                this.resetOfSearch();
              },
              (err) => {
                console.log(err);
                if (err.status == 404) {
                  this.messageError = err.error.message;
                  this.modalError(
                    '¡Uff, esta pregunta ya no existe en el sistema 😟!'
                  );
                }
              }
            );
          }
        }
      })
      .catch((result) => {});
  }
  modalError(error: string) {
    this.location.onPopState(() => {
      this.appModalService.closeModalAlertError();
    });
    this.appModalService
      .modalAlertError(error)
      .then((result: any) => {
        this.router.navigate(['/foro']);
      })
      .catch((result) => {
        this.router.navigate(['/foro']);
      });
  }
  deleteFilter() {
    this.filtroseleccionado = false;
    this.tipoFiltro = 0;
    this.resetOfSearch();
  }

  onFiltroEvents(data: any) {
    this.tipoFiltro = data.tipo;
    this.nombreFiltro = data.nombre;
    this.filtroseleccionado = true;
    this.resetOfSearch();
  }

  filtradoData(tipo: number, datoAfiltrar: any[]) {
    const sortFunction = (a: any, b: any) => {
      let dateA, dateB;
      switch (tipo) {
        case 0:
          dateA = new Date(a.fecha);
          dateB = new Date(b.fecha);
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        case 1:
          dateA = new Date(a.fecha);
          dateB = new Date(b.fecha);
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        default:
          return 0;
      }
    };
    return datoAfiltrar.sort(sortFunction);
  }

  resetOfSearch() {
    this.respuestasCopia = this.filtradoData(this.tipoFiltro, this.respuestas);
    this.showNotFoundAnswers = this.respuestasCopia.length < 1;
    this.showPagination = !this.showNotFoundAnswers;

    if (this.showPagination && this.respuestas.length > this.pageSize) {
      this.collectionSize = this.respuestasCopia.length;
      this.respuestasCopia = this.paginate(
        this.respuestasCopia,
        this.page,
        this.pageSize
      );
    }
  }
  paginate(data: any[], page: number, pageSize: number) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const totalPages = Math.ceil(data.length / pageSize);

    if (page < 1 || page > totalPages) {
      throw new Error('Número de página inválido');
    }

    if (startIndex >= data.length) {
      return [];
    }

    return data.slice(startIndex, endIndex);
  }

  openForm() {
    if (this.isAuthUser) {
      this.showForm = !this.showForm;
    } else {
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
  goDetail(usertype: any ,idUser:any) {
    const map: any = {
      Pescador: '/pescadores/municipio/detalle/',
      Piscicultor: '/piscicultores/municipio/detalle/',
      Proveedor: '/proveedores/detalle/',
      'Investigador Experto': '/investigadores/detalle/',
      Transportador: '/transportadores/detalle/',
      Comerciante: '/comerciantes/detalle/',
      Consumidor: '/consumidores/detalle/',
    };
     if (usertype != 'Administrador') {
       const baseUrl: string = map[usertype] ?? '';
       this.router.navigateByUrl(baseUrl + `${idUser}`);
     }
  }
}

import { PlatformLocation } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommunicateDataService } from 'src/app/services/communicate-data.service';
import { EvaluateRegisteredUserService } from 'src/app/services/evaluate-registered-user.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { ForumService } from 'src/app/services/forum.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';

interface pregunta {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  usuarioId: number;
  foto: string;
  nombreUsuario: string;
  fotoUsuario: string;
  countRespuestas: number;
  fotos: string[];
}

@Component({
  selector: 'app-forum-home',
  templateUrl: './forum-home.component.html',
  styleUrls: ['./forum-home.component.scss'],
})
export class ForumHomeComponent implements OnInit, OnDestroy {
  showForm: boolean = false;
  preguntas: pregunta[] = [];
  preguntasCopia: any[] = [];
  showError: boolean = false;
  showNotFound: boolean = false;
  authUserId: any;
  isAuthUser: boolean = false;
  communicateDataSubss!: Subscription;
  filtroseleccionado: boolean = false;
  searchTerm: string = '';
  tipoFiltro: number = 1;
  nombreFiltro: string = '';
  loading: boolean = true;
  showPreguntas: boolean = false;
  valorInput: boolean = false;
  filtros: any[] = [
    {
      nombre: 'Más antiguos',
      tipo: 1,
    },
    {
      nombre: 'Más respuestas',
      tipo: 2,
    },
    {
      nombre: 'Mis preguntas',
      tipo: 3,
    },
  ];
  SubsCommunicateData!: Subscription;
  /* Paginación */
  page = 1;
  pageSize = 2;
  collectionSize = 0;
  resetPage:number=1
  showPagination: boolean = false;
  constructor(
    private forumService: ForumService,
    public evaluateRegisteredUserService: EvaluateRegisteredUserService,
    public location: PlatformLocation,
    private appModalService: AppModalService,
    private router: Router,
    public userService: UsuarioService,
    private searchBuscadorService: SearchBuscadorService,
    private storage: FirebaseStorageService,
    private communicateDataService: CommunicateDataService
  ) {
    this.SubsCommunicateData =
      this.communicateDataService.currentUser.subscribe((active: any) => {
        if (active) {
          this.reloadQuestions();
          this.page=1
        }
      });
  }

  ngOnInit(): void {
    this.isAuthUser = this.userService?.isAuthenticated();
    this.authUserId = this.userService?.getAuthUserId();
    this.reloadQuestions();
  }
  ngOnDestroy(): void {
    this.SubsCommunicateData.unsubscribe();
  }
  reloadQuestions() {
    this.showError = false;
    this.showNotFound = false;
    this.tipoFiltro = 0;
    this.searchTerm = '';
    this.filtroseleccionado = false;
    this.valorInput = !this.valorInput;
    this.forumService.getPreguntasTodas().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.preguntas = response.data;
          this.loading = false;
          this.showPreguntas = true;
          this.resetOfSearch();
        } else {
          this.loading = false;
          this.showNotFound = true;
        }
      },
      (err) => {
        console.log(err);
        this.loading = false;
        this.showError = true;
      }
    );
  }

  deletePregunta(idpregunta: number, imagen: any) {
    this.location.onPopState(() => {
      this.appModalService.closeModalAlertSignu();
    });
    this.appModalService
      .confirm(
        'Eliminar pregunta',
        'Está seguro que desea eliminar esta pregunta',
        'Si',
        'No',
        ''
      )
      .then((result) => {
        if (result) {
          let idx = this.preguntas.findIndex(
            (element) => element.id === idpregunta
          );
          if (idx != -1) {
            this.forumService.deletePregunta(idpregunta).subscribe(
              (response) => {
                this.preguntas.splice(idx, 1);
                if (imagen.length > 0) {
                  this.storage.deleteMultipleByUrls(imagen);
                }
                this.resetOfSearch();
              },
              (err) => {
                console.log(err);
              }
            );
          }
        }
      })
      .catch((result) => {});
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

  onBuscarPalabraEvents(searchTerm: string) {
    this.searchTerm = searchTerm;
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
        case 2:
          dateA = a.countRespuestas;
          dateB = b.countRespuestas;
          return dateB - dateA;
        default:
          return 0;
      }
    };
    if (tipo == 3) {
      return datoAfiltrar.filter((obj) => {
        return obj.usuarioId === this.authUserId;
      });
    }
    return datoAfiltrar.sort(sortFunction);
  }

  buscarData(texto: string): any {
    if (texto.trim().length === 0) {
      return this.preguntas;
    }

    return this.searchBuscadorService.buscarDataDos(this.preguntas, texto, [
      'titulo',
      'descripcion',
    ]);
  }

  resetOfSearch() {
    this.preguntasCopia = this.filtradoData(
      this.tipoFiltro,
      this.buscarData(this.searchTerm)
    );

    this.showNotFound = this.preguntasCopia.length < 1;
    this.showPagination = !this.showNotFound;

    if (this.showPagination && this.preguntas.length>2) {
      this.collectionSize = this.preguntasCopia.length;
      this.preguntasCopia = this.paginate(
        this.preguntasCopia,
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

  goDetail(idPregunta: number) {
    this.router.navigate(['/foro/respuesta/pregunta', idPregunta]);
    /* const url = `/foro/respuesta/pregunta/${idPregunta}`;
    this.router.navigate([url]); */
  }
}

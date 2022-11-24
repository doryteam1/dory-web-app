import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { MODO_FILTRO_DATOS_VARIOS, vertices } from '../../../global/constants';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Router } from '@angular/router';
import { PlacesService } from 'src/app/services/places.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { Filtro, MetaFiltro } from '../../../../models/filtro.model';
import { Checkbox } from 'src/models/checkbox.model';
import { BuscarPor } from '../../../../models/buscarPor.model';
import { StorageService } from 'src/app/services/storage.service';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
const _ = require('lodash');

@Component({
  selector: 'app-mis-asociaciones',
  templateUrl: './mis-asociaciones.component.html',
  styleUrls: ['./mis-asociaciones.component.scss'],
})
export class MisAsociacionesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('myselecmunicipio') myselecmunicipio!: ElementRef;
  @ViewChild('tabSoyRep', { static: false }) tabSoyRep!: ElementRef;
  @ViewChild('tabSoyMiemb', { static: false }) tabSoyMiemb!: ElementRef;
  @ViewChild('tabUnir', { static: false }) tabUnir!: ElementRef;

  asociaciones: Array<any> = [];
  showNotFound: boolean = false;
  indicenegocio!: number;
  guarlatlog: boolean = false;
  noexistendatos: boolean = false;
  buscarx: string = '';
  fueraDirecion: boolean = false;
  loadingseart: boolean = false;
  borrarseart: boolean = false;
  valorbuscarx: string = '';
  p!: number;
  tempDir: string = '';
  tempMunicId: number = -1;
  firstTimeOpenModal = true;

  productImagePath: string = '';
  itemUpdateIndex: number = -1;
  modalMode: string = 'create';
  municipios: Array<any> = [];
  departamentos: Array<any> = [];
  loading1: boolean = false;
  loading2: boolean = false;
  loading3: boolean = false;
  infraestructurasData: Array<any> = [];
  especiesData: Array<any> = [];
  authUserId: number = -1;
  photosNegocioArray: Array<string> = [];
  photosNegocioArrayCopy: Array<string> = [];
  photosNegocioUrlToDel: Array<string> = [];
  isPhotoSelectingToDel: boolean = false;
  indexSelectedToDel: Array<number> = [];
  showNotFoundPhotos: boolean = false;
  timeLapsed1: number = 0;
  tiposAsociaciones: Array<any> = [];

  showDetalleAsociacion: boolean = false;
  selectedTab: string = 'representante';
  asociacionesIsMiembro: any;
  showNotFoundAsocMiemb: boolean = false;
  activeclass1: boolean = true;
  activeclass2: boolean = false;
  activeclass3: boolean = false;
  asociacionesexistentes!: any[];
  showNotFoundAsocexistente: boolean = false;
  isUserRep: boolean = false;
  isUserMiemb: boolean = false;
  /* varibles de buscqueda y filtros */
  filtro: Filtro[] = [
    {
      nameButton: 'Tipo de asociación',
      data: [
        {
          id: 0,
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Piscicultores',
          datoafiltrar: 'Piscicultores',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
        {
          id: 1,
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Pescadores',
          datoafiltrar: 'Pescadores',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
        {
          id: 2,
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Mixta',
          datoafiltrar: 'Mixta',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
      ],
      /*  modoFiltro: ['number_ordenarmayoramenor', 'string_filtrodatosvarios'], */
    },
  ];
  checkbox: Checkbox[] = [
    {
      nameButton: 'Municipios',
      nombrecampoDB: 'municipio',
      modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      titulomodal: 'Municipios de sucre',
    },
    /* modoFiltro: 'number_ordenarmayoramenor', */
  ];
  asociasionesexistentesarray!: any[];
  arrayFilter: any[] = [];
  palabra: string = '';
  filtroseleccionado!: MetaFiltro | any;
  filtroseleccionadoCheckbox: string[] = [];
  shorterNumber: number = 20;
  resultFiltroPorMunicipio: any[] = [];
  resultFiltroSeleccionado: any[] = [];
  BotonNotificacion!: Subscription;
  constructor(
    private asociacionesService: AsociacionesService,
    private appModalService: AppModalService,
    private router: Router,
    private places: PlacesService,
    private searchBuscadorService: SearchBuscadorService,
    private asociacionService: AsociacionesService,
    private storageService: StorageService
  ) {}
  ngOnDestroy(): void {
    this.BotonNotificacion.unsubscribe();
  }
  ngAfterViewInit(): void {
    let selectedTab = this.storageService.get('misAsocSelecTab');
    //TODO:la referencia de tabSoyMiemb no esta disponible y deberia estarlo
    setTimeout(() => {
      if (this.isUserMiemb) {
        this.htmlElementClick(this.tabSoyMiemb);
      } else {
        if (selectedTab && selectedTab == 'tabSoyRep') {
          console.log('soy miembro');
          this.htmlElementClick(this.tabSoyRep);
        } else if (selectedTab && selectedTab == 'tabSoyMiemb') {
          this.htmlElementClick(this.tabSoyMiemb);
        } else if (selectedTab && selectedTab == 'tabUnir') {
          this.htmlElementClick(this.tabUnir);
        }
      }
      /*Se abre el tab que estuvo seleccionado antes de ir a ver el detalle de una asociación*/
    }, 1000);
  }

  ngOnInit(): void {
    registerLocaleData(es);
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.preCarga();
    /* municipios sucre */
    this.BotonNotificacion = this.asociacionService.actionBotton$.subscribe(
      (action: boolean) => {
        if (action) {
          this.showNotFoundAsocMiemb = false;
          /* window.location.reload(); */
          /*Asociaciones en donde se en miembro*/
          this.loading2 = true;
          this.asociacionesService
            .getAsociacionesIsMiembroUser(this.authUserId)
            .subscribe(
              (response) => {
                this.asociacionesIsMiembro = response.data;
                if (this.asociacionesIsMiembro.length < 1) {
                  this.showNotFoundAsocMiemb = true;
                  this.isUserMiemb = false;
                } else {
                  this.isUserMiemb = true;
                  setTimeout(() => {
                    this.htmlElementClick(this.tabSoyMiemb);
                  }, 1000);
                }
                this.loading2 = false;
              },
              (err) => {
                this.showNotFoundAsocMiemb = true;
                this.loading2 = false;
              }
            );
        }
      }
    );
  }
  preCarga() {
    /*Asociaciones en donde se es representante legal*/
    this.loading1 = true;
    this.asociacionesService.getAsociacionesUsuario(this.authUserId).subscribe(
      (response) => {
        this.asociaciones = response.data;
        if (this.asociaciones.length <= 0) {
          this.showNotFound = true;
          this.isUserRep = false;
        } else {
          this.isUserRep = true;
        }
        this.loading1 = false;
      },
      (err) => {
        this.showNotFound = true;
        console.log(err);
        this.loading1 = false;
      }
    );

    /*Asociaciones en donde se en miembro*/
    this.loading2 = true;
    this.asociacionesService
      .getAsociacionesIsMiembroUser(this.authUserId)
      .subscribe(
        (response) => {
          this.asociacionesIsMiembro = response.data;
          if (this.asociacionesIsMiembro.length < 1) {
            this.showNotFoundAsocMiemb = true;
            this.isUserMiemb = false;
          } else {
            this.isUserMiemb = true;
          }
          this.loading2 = false;
        },
        (err) => {
          this.showNotFoundAsocMiemb = true;
          this.loading2 = false;
        }
      );
    /*Todas las asociaones que existen*/
    this.asociacionesService.getAsociacionesTodas().subscribe((response) => {
      this.asociasionesexistentesarray = response.data;
      this.asociasionesexistentesarray =
        this.asociasionesexistentesarray.filter((asociacion) => {
          return asociacion.id_propietario !== this.authUserId;
        });
      this.asociacionesexistentes = this.asociasionesexistentesarray.slice();
      if (this.asociacionesexistentes.length < 1) {
        this.showNotFoundAsocexistente = true;
      } else {
        this.showNotFoundAsocexistente = false;
      }
    });
    this.loadMunic();
  }
  invitarAnular(asociacion: any) {
    if (asociacion.estado_solicitud == 'Aceptada') {
      this.appModalService
        .confirm('Salir de la asociación', 'Está seguro', 'Aceptar', 'Cancelar')
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

  delete(asociacion: any) {
    this.appModalService
      .confirm(
        'Eliminar asociación',
        'Esta seguro que desea eliminar esta asociación',
        'Eliminar',
        'No estoy seguro',
        asociacion.nombre
      )
      .then((result) => {
        if (result == true) {
          this.asociacionesService.delete(asociacion.nit).subscribe(
            (response: any) => {
              let index = this.asociaciones.findIndex(
                (element) => element.nit == asociacion.nit
              );
              this.asociaciones.splice(index, 1);
              this.isUserRep = false;
              this.htmlElementClick(this.tabSoyRep);
              if (this.asociaciones.length == 0) {
                this.showNotFound = true;
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      })
      .catch((result) => {});
  }

  create() {
    let object = {
      action: 'create',
      formState: 'enable',
    };
    this.router.navigate(['/dashboard/asociacion/detalle', object]);
  }
  activeTabClick(selectedTab: string) {
    if (selectedTab == 'representante') {
      this.selectedTab = selectedTab;
      this.activeclass1 = true;
      this.activeclass2 = false;
      this.activeclass3 = false;
    } else if (selectedTab == 'miembro') {
      this.selectedTab = selectedTab;
      this.activeclass1 = false;
      this.activeclass2 = true;
      this.activeclass3 = false;
    } else if (selectedTab == 'Unirme_a_una_asociacion') {
      this.selectedTab = selectedTab;
      this.activeclass1 = false;
      this.activeclass2 = false;
      this.activeclass3 = true;
    }
  }
  navigate(event: any, formState: string, from: string) {
    let object: any = { ...event };
    (object.action = 'update'),
      (object.formState =
        this.selectedTab == 'representante' ? 'enable' : 'disable'),
      this.storageService.add('misAsocSelecTab', from);
    this.router.navigate(['/dashboard/asociacion/detalle', object]);
  }
  goAssociationDetail(asociacion: any) {
    let url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/asociaciones/municipio/detalle/${asociacion.nit}`,
      ])
    );
    window.open(url, '_blank');
  }

  loadMunic(): any[] {
    this.places.getMunicipiosDepartamentos(70).subscribe(
      (response) => {
        this.municipios = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
    return this.municipios;
  }
  /* funciones de busqueda granjas */

  buscarData(texto: string): any {
    let asociacionesresult: any[];
    if (texto.trim().length === 0) {
      asociacionesresult = this.asociasionesexistentesarray;
    } else {
      let buscardatospor: BuscarPor[] = [{ data1: 'nombre' }, { data3: 'nit' }];
      asociacionesresult = this.searchBuscadorService.buscarData(
        this.asociasionesexistentesarray,
        texto,
        buscardatospor
      );
    }

    return asociacionesresult;
  }
  onBuscarPalabra(palabra: string) {
    this.palabra = palabra;
    this.reseteoDeBusqueda();
  }

  filtradoData(filtroSelecOptionData: MetaFiltro, arrayafiltar: any[]) {
    let filtroresult: any[] = [];
    filtroresult = this.searchBuscadorService.filterSeleccionadoList(
      arrayafiltar,
      filtroSelecOptionData
    );
    return filtroresult;
  }
  onFiltroChange(filtro: MetaFiltro) {
    this.filtroseleccionado = filtro;
    this.reseteoDeBusqueda();
  }
  delateFilter() {
    this.filtroseleccionado = null;
    this.reseteoDeBusqueda();
  }

  filtradoDataCheckbox(arrayCheckboxSelec: any[], arrayafiltrar: any[]) {
    let filtroresult: any[] = [];
    let filtroSelecOptionData: Checkbox[] = this.checkbox;
    filtroresult = this.searchBuscadorService.filterCheckbox(
      arrayafiltrar,
      arrayCheckboxSelec,
      filtroSelecOptionData
    );
    return filtroresult;
  }
  onFiltroChangeCheckbox(checkboxs: string[]) {
    if (checkboxs.length == 0) {
      this.filtroseleccionadoCheckbox = [];
      this.resultFiltroPorMunicipio = [];
    } else {
      this.filtroseleccionadoCheckbox = checkboxs;
    }
    this.reseteoDeBusqueda();
  }
  delateFilterCheckbox(index: number) {
    this.filtroseleccionadoCheckbox.splice(index, 1);
    this.reseteoDeBusqueda();
  }
  reseteoDeBusqueda() {
    let resultados: any[] = this.buscarData(this.palabra);
    if (this.filtroseleccionado) {
      resultados = this.filtradoData(this.filtroseleccionado, resultados);
    }
    if (
      this.filtroseleccionadoCheckbox &&
      this.filtroseleccionadoCheckbox.length > 0
    ) {
      resultados = this.filtradoDataCheckbox(
        this.filtroseleccionadoCheckbox,
        resultados
      );
      this.resultFiltroPorMunicipio = this.searchBuscadorService.filterEspecial(
        resultados,
        this.filtroseleccionadoCheckbox,
        'municipio'
      );
    }
    this.asociacionesexistentes = resultados;
  }

  htmlElementClick(eRef: ElementRef) {
    const element: HTMLElement = eRef?.nativeElement;
    element?.click();
    console.log('clicked!');
  }
  salirAsociacion(asociacion: any, idx:number) {
    this.appModalService
      .confirm(
        'Salir de la asociación',
        'Está seguro que desea salir  de esta asociación',
        'Salir',
        'Cancelar'
      )
      .then((result) => {
        if (result == true) {
          this.asociacionService
            .eliminarSolicitud(asociacion.id_solicitud)
            .subscribe(
              (response) => {
                this.asociacionesIsMiembro.splice(idx, 1);
                if (this.asociacionesIsMiembro.length <= 0) {
                  this.showNotFoundAsocMiemb = true;
                }
              },
              (err) => {
                console.log(err);
              }
            );
        }
      })
      .catch((result) => {});
  }
}

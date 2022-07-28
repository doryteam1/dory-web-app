import { Component, OnInit ,  ElementRef,
  ViewChild, } from '@angular/core';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map,finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MODOFILTRO2, vertices } from '../../../global/constants';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Router } from '@angular/router';
import { PlacesService } from 'src/app/services/places.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { Filtro, MetaFiltro } from '../../../../models/filtro.model';
import { Checkbox } from 'src/models/checkbox.model';
import { BuscarPor } from '../../../../models/buscarPor.model';
const _ = require('lodash');


@Component({
  selector: 'app-mis-asociaciones',
  templateUrl: './mis-asociaciones.component.html',
  styleUrls: ['./mis-asociaciones.component.scss'],
})
export class MisAsociacionesComponent implements OnInit {
  @ViewChild('myselecmunicipio') myselecmunicipio!: ElementRef;
  @ViewChild('map') map: any;
  @ViewChild('fileInput') inputFileDialog!: ElementRef;
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
  apiLoaded: Observable<boolean>;
  infraestructurasData: Array<any> = [];
  especiesData: Array<any> = [];
  authUserId: number = -1;
  vertices = vertices;
  options: google.maps.MapOptions = {
    scrollwheel: true,
    center: { lat: 0, lng: 0 },
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  optionPoli: google.maps.PolylineOptions = {
    strokeColor: '#494949',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    visible: true,
  };
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
  /* varibles de buscqueda y filtros */
  filtro: Filtro[] = [
    {
      nameButton: 'Tipo de asociación',
      data: [
        {
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Piscicultores',
          datoafiltrar: 'Piscicultores',
          modoFiltro: MODOFILTRO2,
        },
        {
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Pescadores',
          datoafiltrar: 'Pescadores',
          modoFiltro: MODOFILTRO2,
        },
        {
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Mixta',
          datoafiltrar: 'Mixta',
          modoFiltro: MODOFILTRO2,
        },
        {
          nombrecampoDB: null,
          nombrefiltro: 'Ver todas',
          datoafiltrar: null,
          modoFiltro: MODOFILTRO2,
        },
      ],
      /*  modoFiltro: ['number_ordenarmayoramenor', 'string_filtrodatosvarios'], */
    },
  ];
  checkbox: Checkbox[] = [
    {
      nameButton: 'Municipios',
      nombrecampoDB: 'municipio',
      modoFiltro: MODOFILTRO2,
      titulomodal: 'Municipios de sucre',
    },
    /* modoFiltro: 'number_ordenarmayoramenor', */
  ];
  asociasionesexistentesarray!: any[];
  arrayFilter: any[] = [];
  palabra: string = '';
  filtroseleccionado!: MetaFiltro;
  filtroseleccionadoCheckbox: string[] = [];

  constructor(
    private asociacionesService: AsociacionesService,
    private appModalService: AppModalService,
    httpClient: HttpClient,
    private router: Router,
    private places: PlacesService,
    private searchBuscadorService: SearchBuscadorService
  ) {
    this.apiLoaded = httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=' + environment.doryApiKey,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  ngOnInit(): void {
    registerLocaleData(es);
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    /*Asociaciones en donde se es representante legal*/
    this.asociacionesService.getAsociacionesUsuario(this.authUserId).subscribe(
      (response) => {
        this.asociaciones = response.data;
        console.log('Asociaciones representante ', this.asociaciones);
        if (this.asociaciones.length < 1) {
          this.showNotFound = true;
        }
      },
      (err) => {
        console.log(err);
      }
    );

    /*Asociaciones en donde se en miembro*/
    this.asociacionesService
      .getAsociacionesIsMiembroUser(this.authUserId)
      .subscribe((response) => {
        this.asociacionesIsMiembro = response.data;
        console.log('Asociaciones de un miembro ', this.asociacionesIsMiembro);
        if (this.asociacionesIsMiembro.length < 1) {
          this.showNotFoundAsocMiemb = true;
        }
      });
    /*Todas las asociaones que existen*/
    this.asociacionesService.getAsociacionesTodas().subscribe((response) => {
      this.asociacionesexistentes = response.data;
      this.asociasionesexistentesarray = response.data;
      console.log('Asociaciones existentes', this.asociacionesexistentes);
      if (this.asociacionesexistentes.length < 1) {
        this.showNotFoundAsocexistente = true;
      } else {
        this.showNotFoundAsocexistente = false;
      }
    });
    /* municipios sucre */
    this.loadMunic();
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
  navigate(event: any, formState: string) {
    console.log('formState ', formState);
    let object: any = { ...event };
    (object.action = 'update'),
      (object.formState =
        this.selectedTab == 'representante' ? 'enable' : 'disable'),
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
      let buscardatospor:BuscarPor[]= [{ data1: 'nombre' }, { data3: 'nit' }];
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
    console.log('palabra', this.palabra);
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
    this.filtroseleccionadoCheckbox = checkboxs;
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
      console.log(this.filtroseleccionadoCheckbox);
    }
    console.log(resultados);
    this.asociacionesexistentes = resultados;
  }
}

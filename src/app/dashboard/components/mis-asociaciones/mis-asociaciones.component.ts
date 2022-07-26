import { Component, OnInit ,  ElementRef,
  ViewChild, } from '@angular/core';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map,finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { vertices } from '../../../global/constants';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Router } from '@angular/router';
import { PlacesService } from 'src/app/services/places.service';
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

  modoFiltro: any[] = ['number_ordenarmayoramenor', 'string_filtrodatosvarios'];
  filtros: any[] = [
    {
      nombre_boton_filtro: [
        {
          name: 'Municipios',
          checkbox: true,
          data: [],
        },
        {
          name: 'Tipo de asociación',
          checkbox: false,
          data: [
            {
              nombrecampoDB: 'tipo_asociacion',
              nombrefiltro: 'Piscicultores',
              datoafiltrar: 'Piscicultores',
            },
            {
              nombrecampoDB: 'tipo_asociacion',
              nombrefiltro: 'Pescadores',
              datoafiltrar: 'Pescadores',
            },
            {
              nombrecampoDB: 'tipo_asociacion',
              nombrefiltro: 'Mixta',
              datoafiltrar: 'Mixta',
            },
            {
              nombrecampoDB: '',
              nombrefiltro: 'Ver todas',
              datoafiltrar: '',
            },
          ],
        },
      ],
    },
  ];
  buscardatospor = [
    { data1: 'nombre' },
    { data2: 'propietario' },
    { data3: 'nit' },
    { data4: 'municipio' },
  ];
  asociasionesexistentesarray!: any[];

  constructor(
    private asociacionesService: AsociacionesService,
    private appModalService: AppModalService,
    httpClient: HttpClient,
    private router: Router,
    private places: PlacesService
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
      console.log(this.selectedTab);
    } else if (selectedTab == 'miembro') {
      this.selectedTab = selectedTab;
      this.activeclass1 = false;
      this.activeclass2 = true;
      this.activeclass3 = false;
      console.log(this.selectedTab);
    } else if (selectedTab == 'Unirme_a_una_asociacion') {
      this.selectedTab = selectedTab;
      this.activeclass1 = false;
      this.activeclass2 = false;
      this.activeclass3 = true;
      console.log(this.selectedTab);
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
    this.router.navigateByUrl(
      '/asociaciones/municipio/detalle/' + asociacion.nit
    );
  }
  /* funciones de busqueda granjas */
  buscarData(data: any[]) {
    this.asociacionesexistentes = data;
  }
  filtradoData(datafilter: any[]) {
    this.asociacionesexistentes = datafilter;
  }
  loadMunic() {
    this.places.getMunicipiosDepartamentos(70).subscribe(
      (response) => {
        this.municipios = response.data;
        console.log(this.municipios);
        this.filtros[0].nombre_boton_filtro[0].data=this.municipios
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

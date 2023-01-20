
import { Component,EventEmitter,Input,OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { MODO_FILTRO_DATOS_VARIOS } from 'src/app/global/constants';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { PlacesService } from 'src/app/services/places.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { Utilities } from 'src/app/utilities/utilities';
import { BuscarPor } from 'src/models/buscarPor.model';
import { Checkbox } from 'src/models/checkbox.model';
import { Filtro, MetaFiltro } from 'src/models/filtro.model';

@Component({
  selector: 'app-asociaciones',
  templateUrl: './asociaciones.component.html',
  styleUrls: ['./asociaciones.component.scss'],
})
export class AsociacionesComponent implements OnInit {
  @Input() cardAsocia: boolean = true;
  @Input() botonFavori: boolean = true;
  @Output() onInvitarAnular: EventEmitter<any> = new EventEmitter();
  asociacionesFiltered!: any[];
  filtroseleccionadoCheckbox: string[] = [];
  filtroseleccionado!: MetaFiltro | any;
  palabra: string = '';
  asociaciones!: any[];
  municipios: Array<any> = [];
  showNotFound: boolean = false;
  authUserId: number = -1;
  authRol: string = '';
  electronActive: any = window.require; //verificar la disponibilidad, solo esta disponible en electronJS;
  checkbox: Checkbox[] = [
    {
      nameButton: 'Municipios',
      nombrecampoDB: 'municipio',
      modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      titulomodal: 'Municipios de sucre',
    },
    /* modoFiltro: 'number_ordenarmayoramenor', */
  ];
  /* varibles de buscqueda y filtros */
  filtro: Filtro = {
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
  };
  resultFiltroPorMunicipio: any[] = [];
  constructor(
    private asociacionService: AsociacionesService,
    private router: Router,
    private searchBuscadorService: SearchBuscadorService,
    private places: PlacesService,
    public mediaQueryService: MediaQueryService,
    public userService: UsuarioService
  ) {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (token) {
      let payload = Utilities?.parseJwt(token!);
      this.authUserId = payload.sub;
      this.authRol = payload.rol;
    }
    /*Todas las asociaones que existen*/
    this.asociacionService.getAsociacionesTodas().subscribe((response) => {
      this.asociaciones = response.data;
      if (this.authRol == 'Piscicultor') {
        this.asociaciones = this.asociaciones.filter((asociacion) => {
          return (
            asociacion.tipo_asociacion == 'Piscicultores' ||
            (asociacion.tipo_asociacion == 'Mixta' &&
              asociacion.id_propietario !== this.authUserId)
          );
        });
      } else if (this.authRol == 'Pescador') {
        this.asociaciones = this.asociaciones.filter((asociacion) => {
          return (
            asociacion.tipo_asociacion == 'Pescadores' ||
            (asociacion.tipo_asociacion == 'Mixta' &&
              asociacion.id_propietario !== this.authUserId)
          );
        });
      }
      this.asociacionesFiltered = this.asociaciones.slice();
      if (this.asociacionesFiltered.length < 1) {
        this.showNotFound = true;
      } else {
        this.showNotFound = false;
      }
    });

    this.loadMunic();
  }

  goAssociationDetail(asociacion: any) {
      this.router.navigateByUrl(
        `/asociaciones/municipio/detalle/${asociacion.nit}`
      );
  }

  delateFilterCheckbox(index: number) {
    this.filtroseleccionadoCheckbox.splice(index, 1);
    this.searchReset();
  }

  searchReset() {
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
    this.asociacionesFiltered = resultados;
    if (this.asociacionesFiltered.length < 1) {
      this.showNotFound = true;
    } else {
      this.showNotFound = false;
    }
  }

  filtradoData(filtroSelecOptionData: MetaFiltro, arrayafiltar: any[]) {
    let filtroresult: any[] = [];
    filtroresult = this.searchBuscadorService.filterSeleccionadoList(
      arrayafiltar,
      filtroSelecOptionData
    );
    return filtroresult;
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

  onBuscarPalabra(palabra: string) {
    this.palabra = palabra;
    this.searchReset();
  }

  buscarData(texto: string): any {
    let asociacionesresult: any[];
    if (texto.trim().length === 0) {
      asociacionesresult = this.asociaciones;
    } else {
      let buscardatospor: BuscarPor[] = [{ data1: 'nombre' }, { data3: 'nit' }];
      asociacionesresult = this.searchBuscadorService.buscarData(
        this.asociaciones,
        texto,
        buscardatospor
      );
    }
    return asociacionesresult;
  }

  delateFilter() {
    this.filtroseleccionado = null;
    this.searchReset();
  }

  onFiltroChangeCheckbox(checkboxs: string[]) {
    if (checkboxs.length == 0) {
      this.filtroseleccionadoCheckbox = [];
      this.resultFiltroPorMunicipio = [];
    } else {
      this.filtroseleccionadoCheckbox = checkboxs;
    }
    this.searchReset();
  }

  onFiltroChange(filtro: MetaFiltro) {
    this.filtroseleccionado = filtro;
    this.searchReset();
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

  onFiltersAplied(result: any) {
    this.filtroseleccionado = result.radioFilter1;
    this.filtroseleccionadoCheckbox = result.selectedCheckboxs;
    this.searchReset();
  }
  goDetalleRepresentante(asociacion: any) {
    if (asociacion.tipo_usuario_propietario == 'Pescador') {
      this.router.navigateByUrl(
        '/pescadores/municipio/detalle/' + asociacion.id_propietario
      );
    } else if (asociacion.tipo_usuario_propietario == 'Piscicultor') {
      this.router.navigateByUrl(
        '/piscicultores/municipio/detalle/' + asociacion.id_propietario
      );
    }
  }
  invitarAnular(asociacion: any) {
    this.onInvitarAnular.emit(asociacion);
  }
}

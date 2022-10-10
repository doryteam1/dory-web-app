
import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { MODO_FILTRO_DATOS_VARIOS } from 'src/app/global/constants';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { PlacesService } from 'src/app/services/places.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
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
  asociacionesFiltered!: any[];
  filtroseleccionadoCheckbox: string[] = [];
  filtroseleccionado!: MetaFiltro | any;
  palabra: string = '';
  asociaciones!: any[];
  municipios: Array<any> = [];
  showNotFound: boolean = false;
  authUserId: number = -1;
  authRol: string = '';
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
    private appModalService: AppModalService,
    private router: Router,
    private searchBuscadorService: SearchBuscadorService,
    private places: PlacesService,
    public mediaQueryService: MediaQueryService
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
      this.asociaciones = this.asociaciones.filter((asociacion) => {
        return asociacion.id_propietario !== this.authUserId;
      });
      this.asociacionesFiltered = this.asociaciones.slice();
      console.log(this.asociacionesFiltered);
      if (this.asociacionesFiltered.length < 1) {
        this.showNotFound = true;
      } else {
        this.showNotFound = false;
      }
    });

    this.loadMunic();
  }
  invitarAnular(asociacion: any) {
    if (asociacion.estado_solicictud == 'Aceptada') {
      this.appModalService
        .confirm(
          'Salir de la asociación',
          'Usted ya no es miembro de esta asociación',
          'Aceptar',
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

  goAssociationDetail(asociacion: any) {
    let url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/asociaciones/municipio/detalle/${asociacion.nit}`,
      ])
    );
    window.open(url, '_blank');
  }

  delateFilterCheckbox(index: number) {
    this.filtroseleccionadoCheckbox.splice(index, 1);
    console.log(this.filtroseleccionadoCheckbox);
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
        this.resultFiltroPorMunicipio =
          this.searchBuscadorService.filterEspecial(
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
}

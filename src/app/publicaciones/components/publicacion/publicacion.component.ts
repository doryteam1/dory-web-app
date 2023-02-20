import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  MODO_FILTRO_DATOS_VARIOS,
  MODO_FILTRO_ORDER_ASC,
  MODO_FILTRO_ORDER_DES,
} from 'src/app/global/constants';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { PlacesService } from 'src/app/services/places.service';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { BuscarPor } from 'src/models/buscarPor.model';
import { Checkbox } from 'src/models/checkbox.model';
import { Filtro, MetaFiltro } from 'src/models/filtro.model';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.scss'],
})
export class PublicacionComponent implements OnInit {
  @Input() otraRuta: boolean = false;
  @Output() onDetallePublicacion: EventEmitter<any> = new EventEmitter();
  publicaciones: any[] = [];
  loading: boolean = false;
  showNotFound: boolean = false;
  showError: boolean = false;
  electronActive:any = window.require //verificar la disponibilidad, solo esta disponible en electronJS;
  /* varibles de buscqueda y filtros */
  palabra: string = '';
  publicacionesFiltered: Array<any> = [];
  municipios: Array<any> = [];
  filtroseleccionadoCheckbox: string[] = [];
  filtroseleccionadoCheckbox_dos: string[] = [];
  filtroseleccionado!: MetaFiltro | any;
  selectedPriceFilter!: MetaFiltro | any;
  checkbox: Checkbox[] = [
    {
      nameButton: 'Municipio de vendedor',
      nombrecampoDB: 'municipio',
      modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      titulomodal: 'Municipios de sucre',
    },
  ];
  checkbox_dos: Checkbox[] = [
    {
      nameButton: 'Especies',
      nombrecampoDB: 'especie',
      modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      titulomodal: 'Especies',
    },
  ];
  /* Ordenar por precios */
  filtro: Filtro = {
    nameButton: 'Ordenar por',
    data: [
      {
        id: 0,
        nombrecampoDB: 'preciokilogramo',
        nombrefiltro: 'Precio (Mayor a menor)',
        datoafiltrar: 'preciokilogramo',
        modoFiltro: MODO_FILTRO_ORDER_DES,
      },
      {
        id: 1,
        nombrecampoDB: 'preciokilogramo',
        nombrefiltro: 'Precio (Menor a mayor)',
        datoafiltrar: 'preciokilogramo',
        modoFiltro: MODO_FILTRO_ORDER_ASC,
      },
    ],
  };
  /* Ordenar por rango */
  orderFilter: Filtro = {
    nameButton: 'Filtrar por precio',
    data: [
      {
        id: 0,
        nombrecampoDB: 'preciokilogramo',
        nombrefiltro: '$0 - $10.000',
        datoafiltrar: 'preciokilogramo',
        modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      },
      {
        id: 1,
        nombrecampoDB: 'preciokilogramo',
        nombrefiltro: '$10.000 - $50.000',
        datoafiltrar: 'preciokilogramo',
        modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      },
      {
        id: 2,
        nombrecampoDB: 'preciokilogramo',
        nombrefiltro: '$50.000 - $100.000',
        datoafiltrar: 'preciokilogramo',
        modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      },
      {
        id: 3,
        nombrecampoDB: 'preciokilogramo',
        nombrefiltro: 'Más de $100.000',
        datoafiltrar: 'preciokilogramo',
        modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      },
    ],
  };
  resultFiltroPorMunicipio: any[] = [];
  especies: any[] = [];
  resultFiltroPorEspecie: any[] = [];
  constructor(
    private router: Router,
    private publicacionService: PublicacionesService,
    private searchBuscadorService: SearchBuscadorService,
    private places: PlacesService,
    private granjasServices: GranjasService,
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.publicacionService.getPublicacionesTodas().subscribe(
      (response) => {
        this.loading = false;
        if (response.data.length > 0) {
          this.publicaciones = response.data;
          this.publicacionesFiltered = this.publicaciones;
          this.showError = false;
          this.showNotFound = false;
        } else {
          this.showNotFound = true;
          this.showError = false;
        }
      },
      (err) => {
        console.log(err);
        this.showNotFound = false;
        this.showError = true;
        this.loading = false;
      }
    );
    /* Especies de peces */
    this.loadEspecies();
    /* municipios sucre */
    this.loadMunic();
  }
  /* Funciones para el  filtrado */
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
  loadEspecies() {
    this.granjasServices.getEspecies().subscribe(
      (response) => {
        this.especies = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  /* Busqueda */
  onSearch(text: string) {
    this.palabra = text;
    this.searchReset();
  }
  buscarData(texto: string): any {
    let result: any[];
    if (texto.trim().length === 0) {
      result = this.publicaciones;
    } else {
      let buscardatospor: BuscarPor[] = [{ data1: 'especie' }];
      result = this.searchBuscadorService.buscarData(
        this.publicaciones,
        texto,
        buscardatospor
      );
    }
    return result;
  }
  /* Filtros checkbox */
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
  filtradoDataCheckbox_dos(arrayCheckboxSelec: any[], arrayafiltrar: any[]) {
    let filtroresult: any[] = [];
    let filtroSelecOptionData: Checkbox[] = this.checkbox_dos;
    filtroresult = this.searchBuscadorService.filterCheckbox(
      arrayafiltrar,
      arrayCheckboxSelec,
      filtroSelecOptionData
    );
    return filtroresult;
  }
  /* Filtro ordena mayor a menor y viseversa */
  filtradoData(filtroSelecOptionData: MetaFiltro, arrayafiltar: any[]) {
    let filtroresult: any[] = [];
    filtroresult = this.searchBuscadorService.filterSeleccionadoList(
      arrayafiltar,
      filtroSelecOptionData
    );
    return filtroresult;
  }
  /* Filtra rangos de precios */
  priceFilter(publicaciones: Array<any>) {
    let result = publicaciones.slice();
    if (this.selectedPriceFilter.id == 0) {
      //0-10
      result = publicaciones.filter((element) => {
        return element.preciokilogramo <= 10000;
      });
    } else if (this.selectedPriceFilter.id == 1) {
      //10-50
      result = publicaciones.filter((element) => {
        return (
          element.preciokilogramo >= 10000 && element.preciokilogramo <= 50000
        );
      });
    } else if (this.selectedPriceFilter.id == 2) {
      //50 - 100
      result = publicaciones.filter((element) => {
        return (
          element.preciokilogramo >= 50000 && element.preciokilogramo <= 100000
        );
      });
    } else if (this.selectedPriceFilter.id == 3) {
      //+100
      result = publicaciones.filter((element) => {
        return element.preciokilogramo > 100000;
      });
    }
    return result;
  }
  /* Borrar el checkbox */
  delateFilterCheckbox(index: number) {
    this.filtroseleccionadoCheckbox.splice(index, 1);
    this.searchReset();
  }
  delateFilterCheckbox_dos(index: number) {
    this.filtroseleccionadoCheckbox_dos.splice(index, 1);
    this.searchReset();
  }
  delateFilter() {
    this.filtroseleccionado = null;
    this.searchReset();
  }
  deletePriceFilter() {
    this.selectedPriceFilter = null;
    this.searchReset();
  }
  /* Evento modal-retorna resultados de los filtros seleccionados */
  onFiltersAplied(result: any) {
    /* Resultado filtro por precio */
    this.selectedPriceFilter = result.chipFilter1;
    /* Resultado filtra de mayor a menor */
    this.filtroseleccionado = result.radioFilter1;
    /* Resultado filtro por municipio */
    this.filtroseleccionadoCheckbox = result.selectedCheckboxs;
    /* Resultado filtro por especie */
    this.filtroseleccionadoCheckbox_dos = result.selectedCheckboxs_dos;
    this.searchReset();
  }
  searchReset() {
    let resultados: any[] = this.buscarData(this.palabra);
    /* Filtrado por especie */
    if (
      this.filtroseleccionadoCheckbox_dos &&
      this.filtroseleccionadoCheckbox_dos.length > 0
    ) {
      resultados = this.filtradoDataCheckbox_dos(
        this.filtroseleccionadoCheckbox_dos,
        resultados
      );
    }
    /* Filtrado por municipio */
    if (
      this.filtroseleccionadoCheckbox &&
      this.filtroseleccionadoCheckbox.length > 0
    ) {
      resultados = this.filtradoDataCheckbox(
        this.filtroseleccionadoCheckbox,
        resultados
      );
    }

    /* Filtra por precio,rango */
    if (this.selectedPriceFilter) {
      resultados = this.priceFilter(resultados);
    }

    if (
      this.filtroseleccionadoCheckbox &&
      this.filtroseleccionadoCheckbox.length > 0
    ) {
      this.resultFiltroPorMunicipio = this.searchBuscadorService.filterEspecial(
        resultados,
        this.filtroseleccionadoCheckbox,
        'municipio'
      );
    }

    if (
      this.filtroseleccionadoCheckbox_dos &&
      this.filtroseleccionadoCheckbox_dos.length > 0
    ) {
      this.resultFiltroPorEspecie = this.searchBuscadorService.filterEspecial(
        resultados,
        this.filtroseleccionadoCheckbox_dos,
        'especie'
      );
    }
    /* Filtra de mayor a menor */
    if (this.filtroseleccionado) {
      resultados = this.filtradoData(this.filtroseleccionado, resultados);
    }
    this.publicacionesFiltered = resultados;
    if (this.publicacionesFiltered.length < 1) {
      this.showNotFound = true;
    } else {
      this.showNotFound = false;
    }
  }

  navigate(idPublicacion: any, publicacion?: any) {
    if (this.otraRuta) {
      this.onDetallePublicacion.emit(publicacion);
    } else {
        this.router.navigateByUrl(
          'publicaciones/publicacion/detalle/' + idPublicacion
        );
    }
  }
}

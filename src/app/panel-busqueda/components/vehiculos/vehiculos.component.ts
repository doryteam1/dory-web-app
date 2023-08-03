import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MODO_FILTRO_DATOS_VARIOS, MODO_FILTRO_ORDER_ASC, MODO_FILTRO_ORDER_DES } from 'src/app/global/constants';
import { PlacesService } from 'src/app/services/places.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { Checkbox } from 'src/models/checkbox.model';
import { Filtro, MetaFiltro } from 'src/models/filtro.model';
const _ = require('lodash');

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss'],
})
export class VehiculosComponent implements OnInit {
  vehiculos: Array<any> = [];
  vehiculosFiltered: Array<any> = [];
  filtroseleccionadoCheckbox: string[] = [];
  selectedOrderFilter!: MetaFiltro | any;
  selectedFilter!: MetaFiltro | any;
  checkbox: Checkbox[] = [
    {
      nameButton: 'Municipios',
      nombrecampoDB: 'municipio_propietario',
      modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      titulomodal: 'Municipios de sucre',
    },
  ];
  palabra: string = '';
  municipios: any;

  /* varibles de buscqueda y filtros */
  orderFilters: Filtro = {
    nameButton: 'Ordenar por',
    data: [
      {
        id: 0,
        nombrecampoDB: 'capacidad',
        nombrefiltro: 'Capacidad (mayor a menor) ',
        datoafiltrar: 'capacidad',
        modoFiltro: MODO_FILTRO_ORDER_DES,
      },
      {
        id: 1,
        nombrecampoDB: 'capacidad',
        nombrefiltro: 'Capacidad (menor a mayor)',
        datoafiltrar: 'capacidad',
        modoFiltro: MODO_FILTRO_ORDER_ASC,
      },
    ],
  };

  filters: Filtro = {
    nameButton: '¿Transporta alimentos?',
    data: [
      {
        id: 0,
        nombrecampoDB: 'transporte_alimento',
        nombrefiltro: 'Si',
        datoafiltrar: '1',
        modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      },
      {
        id: 1,
        nombrecampoDB: 'transporte_alimento',
        nombrefiltro: 'No',
        datoafiltrar: '0',
        modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      },
      {
        id: 2,
        nombrecampoDB: 'transporte_alimento',
        nombrefiltro: 'Ambos',
        datoafiltrar: '2',
        modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      },
    ],
  };
  showNotFound: boolean = false;
  resultFiltroPorMunicipio: any[] = [];
  electronActive: any = window.require; //verificar la disponibilidad, solo esta disponible en electronJS;
  ngOnInit(): void {
    this.loadMunic();
  }

  constructor(
    private vehiculosService: VehiculosService,
    private searchBuscadorService: SearchBuscadorService,
    private places: PlacesService,
    private router: Router
  ) {
    this.vehiculosService.getVehiculosAll().subscribe((response) => {
      this.vehiculos = response.data;
      this.vehiculosFiltered = this.vehiculos;
      if (this.vehiculosFiltered.length < 1) {
        this.showNotFound = true;
      } else {
        this.showNotFound = false;
      }
    });
  }

  deleteFilterCheckbox(index: number) {
    this.filtroseleccionadoCheckbox.splice(index, 1);
    this.searchReset();
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

  filtradoData(filtroSelecOptionData: MetaFiltro, arrayafiltar: any[]) {
    let filtroresult: any[] = [];
    filtroresult = this.searchBuscadorService.filterSeleccionadoList(
      arrayafiltar,
      filtroSelecOptionData
    );
    return filtroresult;
  }

  transportaAlimentoFilter(vehiculos: Array<any>) {
    if (!this.selectedFilter) {
      return null;
    }
    return this.vehiculos.filter(
      (vehiculo) =>
        vehiculo.transporte_alimento == this.selectedFilter.datoafiltrar
    );
  }

  searchReset() {
    let result: any[] = this.filterByText(this.palabra);
    if (this.selectedFilter && this.selectedFilter.id < 2) {
      result = this.transportaAlimentoFilter(result)!;
    }
    if (this.selectedOrderFilter) {
      result = this.filtradoData(this.selectedOrderFilter, result);
    }
    if (
      this.filtroseleccionadoCheckbox &&
      this.filtroseleccionadoCheckbox.length > 0
    ) {
      result = this.filtradoDataCheckbox(
        this.filtroseleccionadoCheckbox,
        result
      );
      this.resultFiltroPorMunicipio = this.searchBuscadorService.filterEspecial(
        result,
        this.filtroseleccionadoCheckbox,
        'municipio_propietario'
      );
    }
    this.vehiculosFiltered = result;
    if (this.vehiculosFiltered.length < 1) {
      this.showNotFound = true;
    } else {
      this.showNotFound = false;
    }
  }

  onSearch(text: string) {
    this.palabra = text;
    this.searchReset();
  }

  filterByText(text: string) {
    if (text == '') {
      this.vehiculosFiltered = this.vehiculos;
    } else {
      this.vehiculosFiltered = this.vehiculos.filter((element) => {
        return element.modelo
          .toLocaleLowerCase()
          .includes(text.toLocaleLowerCase());
      });
    }
    return this.vehiculosFiltered;
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

  onOrderFiltersChange(filter: MetaFiltro) {
    this.selectedOrderFilter = filter;
    this.searchReset();
  }

  onFilterChange(filter: MetaFiltro) {
    this.selectedFilter = filter;
    this.searchReset();
  }

  deleteOrderFilter() {
    this.selectedOrderFilter = null;
    this.searchReset();
  }

  deleteFilter() {
    this.selectedFilter = null;
    this.searchReset();
  }

  onFiltersAplied(result: any) {
    this.selectedFilter = result.chipFilter1;
    this.selectedOrderFilter = result.radioFilter1;
    this.filtroseleccionadoCheckbox = result.selectedCheckboxs;
    this.searchReset();
  }

  goDetail(id: number) {
      this.router.navigateByUrl('transportadores/vehiculo/detalle/' + id);
  }
}

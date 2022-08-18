import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {
  vehiculos:Array<any> = [];
  vehiculosFiltered:Array<any> = [];
  filtroseleccionadoCheckbox: string[] = [];
  selectedOrderFilter!: MetaFiltro | any;
  selectedFilter!: MetaFiltro | any;
  checkbox: Checkbox[] = [
    {
      nameButton: 'Municipios',
      nombrecampoDB: 'municipio_propietario',
      modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      titulomodal: 'Municipios de sucre',
    }
  ];
  palabra: string = '';
  municipios: any;

  /* varibles de buscqueda y filtros */
  orderFilters: Filtro[] = [
    {
      nameButton: 'Ordenar',
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
        }
      ],
    },
  ];

  filters: Filtro[] = [
    {
      nameButton: 'Filtro',
      data: [
        {
          id: 0,
          nombrecampoDB: 'transporte_alimento',
          nombrefiltro: 'Transporta alimento',
          datoafiltrar: '1',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        }
      ],
    },
  ];

  ngOnInit(): void {
    this.loadMunic()
  }

  constructor(private vehiculosService:VehiculosService,
    private searchBuscadorService: SearchBuscadorService,
    private places: PlacesService){
    this.vehiculosService.getVehiculosAll().subscribe(
      (response)=>{
        this.vehiculos = response.data;
        this.vehiculosFiltered = this.vehiculos;
      }
    )
  }


deleteFilterCheckbox(index: number) {
  this.filtroseleccionadoCheckbox.splice(index,1);
   console.log(this.filtroseleccionadoCheckbox);
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

transportaAlimentoFilter(vehiculos:Array<any>){
  return this.vehiculos.filter((vehiculo)=> vehiculo.transporte_alimento == 1)
}

searchReset() {
  let result: any[] = this.filterByText(this.palabra);
  if(this.selectedFilter){
    result = this.transportaAlimentoFilter(result);
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
  }
  this.vehiculosFiltered = result;
}

onSearch(text:string){
  this.palabra = text;
  this.searchReset();
}

filterByText(text:string){
  if(text == ''){
    this.vehiculosFiltered = this.vehiculos;
  }else{
    this.vehiculosFiltered = this.vehiculos.filter((element)=>{
      return element.modelo.toLocaleLowerCase().includes(text.toLocaleLowerCase());
    })
  }
  return this.vehiculosFiltered;
}

onFiltroChangeCheckbox(checkboxs: string[]) {
  this.filtroseleccionadoCheckbox = checkboxs;
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

deleteOrderFilter(){
  this.selectedOrderFilter = null;
  this.searchReset();
}

deleteFilter(){
  this.selectedFilter = null;
  this.searchReset();
}
}

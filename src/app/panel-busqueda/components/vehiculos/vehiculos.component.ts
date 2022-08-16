import { Component, OnInit } from '@angular/core';
import { MODOFILTRO2 } from 'src/app/global/constants';
import { PlacesService } from 'src/app/services/places.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { Checkbox } from 'src/models/checkbox.model';
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
  checkbox: Checkbox[] = [
    {
      nameButton: 'Municipios',
      nombrecampoDB: 'municipio_propietario',
      modoFiltro: MODOFILTRO2,
      titulomodal: 'Municipios de sucre',
    },
    /* modoFiltro: 'number_ordenarmayoramenor', */
  ];
  palabra: string = '';
  municipios: any;
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

searchReset() {
  let results: any[] = this.filterByText(this.palabra);
  if (
    this.filtroseleccionadoCheckbox &&
    this.filtroseleccionadoCheckbox.length > 0
  ) {
    results = this.filtradoDataCheckbox(
      this.filtroseleccionadoCheckbox,
      results
    );
  }
  this.vehiculosFiltered = results;
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
}

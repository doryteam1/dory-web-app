import { Component, OnInit } from '@angular/core';
import { MODO_FILTRO_DATOS_VARIOS } from 'src/app/global/constants';
import { NegociosService } from 'src/app/services/negocios.service';
import { PlacesService } from 'src/app/services/places.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { Checkbox } from 'src/models/checkbox.model';
const _ = require('lodash');

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.scss']
})
export class NegociosComponent implements OnInit {
  negocios:Array<any> = [];
  negociosFiltered:Array<any> = [];
  filtroseleccionadoCheckbox: string[] = [];
  checkbox: Checkbox[] = [
    {
      nameButton: 'Municipios',
      nombrecampoDB: 'nombre_municipio',
      modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      titulomodal: 'Municipios de sucre',
    },
    /* modoFiltro: 'number_ordenarmayoramenor', */
  ];
  palabra: string = '';
  municipios: any;
  ngOnInit(): void {
    this.loadMunic()
  }

  constructor(private negociosService:NegociosService,
    private searchBuscadorService: SearchBuscadorService,
    private places: PlacesService){
    this.negociosService.getNegociosAll().subscribe(
      (response)=>{
        this.negocios = response.data;
        this.negociosFiltered = this.negocios;
      }
    )
  }

onSearch(text:string){
  this.palabra = text;
  this.searchReset();
}

filterByText(text:string){
  if(text == ''){
    this.negociosFiltered = this.negocios;
  }else{
    this.negociosFiltered = this.negocios.filter((element)=>{
      return element.nombre_negocio.toLocaleLowerCase().includes(text.toLocaleLowerCase());
    })
  }
  return  this.negociosFiltered;
}

onFiltroChangeCheckbox(checkboxs: string[]) {
  this.filtroseleccionadoCheckbox = checkboxs;
  this.searchReset();
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
  this.negociosFiltered = results;
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

deleteFilterCheckbox(index: number) {
  this.filtroseleccionadoCheckbox.splice(index,1);
   console.log(this.filtroseleccionadoCheckbox);
   this.searchReset();
 }

}

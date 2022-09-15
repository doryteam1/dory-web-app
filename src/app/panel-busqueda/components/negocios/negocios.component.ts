import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MODO_FILTRO_DATOS_VARIOS } from 'src/app/global/constants';
import { NegociosService } from 'src/app/services/negocios.service';
import { PlacesService } from 'src/app/services/places.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { Checkbox } from 'src/models/checkbox.model';
const _ = require('lodash');

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.scss'],
})
export class NegociosComponent implements OnInit {
  negocios: Array<any> = [];
  negociosFiltered: Array<any> = [];
  filtroseleccionadoCheckbox: string[] = [];
  showNotFound: boolean = false;
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
    this.loadMunic();
  }

  constructor(
    private negociosService: NegociosService,
    private searchBuscadorService: SearchBuscadorService,
    private places: PlacesService,
    private router:Router
  ) {
    this.negociosService.getNegociosAll().subscribe((response) => {
      this.negocios = response.data;
      this.negociosFiltered = this.negocios;
      if (this.negociosFiltered.length < 1) {
        this.showNotFound = true;
      } else {
        this.showNotFound = false;
      }
    });
  }

  onSearch(text: string) {
    this.palabra = text;
    this.searchReset();
  }

  filterByText(text: string) {
    if (text == '') {
      this.negociosFiltered = this.negocios;
    } else {
      this.negociosFiltered = this.negocios.filter((element) => {
        return element.nombre_negocio
          .toLocaleLowerCase()
          .includes(text.toLocaleLowerCase());
      });
    }
    return this.negociosFiltered;
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
    if (this.negociosFiltered.length < 1) {
      this.showNotFound = true;
    } else {
      this.showNotFound = false;
    }
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
  goDetail(id:number){
    let url = this.router.serializeUrl(
      this.router.createUrlTree([
        'negocios/detalle/'+id,
      ])
    );
    window.open(url, '_blank');
  }
    
  deleteFilterCheckbox(index: number) {
    this.filtroseleccionadoCheckbox.splice(index, 1);
    console.log(this.filtroseleccionadoCheckbox);
    this.searchReset();
  }
}

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
  electronActive: any = window.require; //verificar la disponibilidad, solo esta disponible en electronJS;
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
  resultFiltroPorMunicipio: any[] = [];
  ngOnInit(): void {
    this.loadMunic();
  }

  constructor(
    private negociosService: NegociosService,
    private searchBuscadorService: SearchBuscadorService,
    private places: PlacesService,
    private router: Router
  ) {
    this.negociosService.getNegociosAll().subscribe((response) => {
      this.negocios = response.data;
      console.log(this.negocios);
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
    if (checkboxs.length == 0) {
      this.filtroseleccionadoCheckbox = [];
      this.resultFiltroPorMunicipio = [];
    } else {
      this.filtroseleccionadoCheckbox = checkboxs;
    }
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
      this.resultFiltroPorMunicipio = this.searchBuscadorService.filterEspecial(
        results,
        this.filtroseleccionadoCheckbox,
        'nombre_municipio'
      );
      console.log(this.resultFiltroPorMunicipio);
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
  goDetail(id: number) {
       const url = `comerciantes/negocio/detalle/${id}`;
       if (this.electronActive) {
         this.router.navigateByUrl(url);
       } else {
         const serializedUrl = this.router.serializeUrl(
           this.router.createUrlTree([url])
         );
         window.open(serializedUrl, '_blank');
       }
  }

  deleteFilterCheckbox(index: number) {
    this.filtroseleccionadoCheckbox.splice(index, 1);
    console.log(this.filtroseleccionadoCheckbox);
    this.searchReset();
  }
}

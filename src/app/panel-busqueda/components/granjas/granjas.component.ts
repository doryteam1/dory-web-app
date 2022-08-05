import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { MODOFILTRO2 } from 'src/app/global/constants';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PlacesService } from 'src/app/services/places.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { Utilities } from 'src/app/utilities/utilities';
import { BuscarPor } from 'src/models/buscarPor.model';
import { Checkbox } from 'src/models/checkbox.model';
import { Filtro, MetaFiltro } from 'src/models/filtro.model';

@Component({
  selector: 'app-granjas',
  templateUrl: './granjas.component.html',
  styleUrls: ['./granjas.component.scss']
})
export class GranjasComponent implements OnInit {
  granjasFiltered!: any[];
  filtroseleccionadoCheckbox: string[] = [];
  filtroseleccionado!: MetaFiltro | any;
  palabra: string = '';
  granjas!: any[];
  municipios: Array<any> = [];
  showNotFound: boolean = false;
  authUserId: number = -1;
  authRol:string = '';
  checkbox: Checkbox[] = [
    {
      nameButton: 'Municipios',
      nombrecampoDB: 'municipio',
      modoFiltro: MODOFILTRO2,
      titulomodal: 'Municipios de sucre',
    },
    /* modoFiltro: 'number_ordenarmayoramenor', */
  ];
  /* varibles de buscqueda y filtros */
  filtro: Filtro[] = [
    {
      nameButton: 'Ordenar Granjas',
      data: [
        {
          id: 0,
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Calificación',
          datoafiltrar: 'puntuacion',
          modoFiltro: 'number_ordenarmayoramenor',
        },
        {
          id: 1,
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Área',
          datoafiltrar: 'area',
          modoFiltro: 'number_ordenarmayoramenor',
        },
      ],
      /*  modoFiltro: ['number_ordenarmayoramenor', 'string_filtrodatosvarios'], */
    },
  ];
  
  constructor(private granjasService: GranjasService,
    private appModalService: AppModalService,
    private router: Router,
    private searchBuscadorService: SearchBuscadorService,
    private places: PlacesService,
    private asociacionService:AsociacionesService) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.authRol = payload.rol;
    /*Todas las asociaones que existen*/
    this.granjasService.getGranjas().subscribe((response:any) => {
      this.granjas = response.data;
      this.granjasFiltered = this.granjas.slice();
      console.log(this.granjasFiltered);
      if (this.granjasFiltered.length < 1) {
        this.showNotFound = true;
      } else {
        this.showNotFound = false;
      }
    });
    /* municipios sucre */
    this.loadMunic();
  }

  goDetail(granja: any) {
    let url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/granjas/municipio/detalle/${granja.id_granja}`,
      ])
    );
    window.open(url, '_blank');
  }

  delateFilterCheckbox(index: number) {
    this.filtroseleccionadoCheckbox.splice(index,1);
     console.log(this.filtroseleccionadoCheckbox);
     this.reseteoDeBusqueda();
   }

   reseteoDeBusqueda() {
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
    }
    this.granjasFiltered = resultados;
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
    this.reseteoDeBusqueda();
  }

  buscarData(texto: string): any {
    let asociacionesresult: any[];
    if (texto.trim().length === 0) {
      asociacionesresult = this.granjas;
    } else {
      let buscardatospor: BuscarPor[] = [{ data1: 'nombre' }];
      asociacionesresult = this.searchBuscadorService.buscarData(
        this.granjas,
        texto,
        buscardatospor
      );
    }
    return asociacionesresult;
  }

  delateFilter() {
    this.filtroseleccionado = null;
    this.reseteoDeBusqueda();
  }

  onFiltroChangeCheckbox(checkboxs: string[]) {
    this.filtroseleccionadoCheckbox = checkboxs;
    this.reseteoDeBusqueda();
  }

  onFiltroChange(filtro: MetaFiltro) {
    this.filtroseleccionado = filtro;
    this.reseteoDeBusqueda();
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

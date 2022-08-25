import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { MODO_FILTRO_DATOS_VARIOS, MODO_FILTRO_ORDER_ASC, MODO_FILTRO_ORDER_DES } from 'src/app/global/constants';
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
  selectedOrderFilter!: MetaFiltro | any;
  selectedStarFilter!: MetaFiltro | any;
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
      modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      titulomodal: 'Municipios de sucre',
    },
    /* modoFiltro: 'number_ordenarmayoramenor', */
  ];
  /* varibles de buscqueda y filtros */
  orderFilters: Filtro = 
    {
      nameButton: 'Ordenar por',
      data: [
        {
          id: 0,
          nombrecampoDB: 'puntuacion',
          nombrefiltro: 'Calificación (Mayor a menor)',
          datoafiltrar: 'puntuacion',
          modoFiltro: MODO_FILTRO_ORDER_DES,
        },
        {
          id: 1,
          nombrecampoDB: 'puntuacion',
          nombrefiltro: 'Calificación (Menor a mayor)',
          datoafiltrar: 'puntuacion',
          modoFiltro: MODO_FILTRO_ORDER_ASC,
        },
        {
          id: 2,
          nombrecampoDB: 'area',
          nombrefiltro: 'Área (Mayor a menor)',
          datoafiltrar: 'area',
          modoFiltro: MODO_FILTRO_ORDER_DES,
        },
        {
          id: 3,
          nombrecampoDB: 'area',
          nombrefiltro: 'Área (Menor a mayor)',
          datoafiltrar: 'area',
          modoFiltro: MODO_FILTRO_ORDER_ASC,
        },
        {
          id: 4,
          nombrecampoDB: 'count_resenas',
          nombrefiltro: 'Cantidad de reseñas (Mayor a menor)',
          datoafiltrar: 'count_resenas',
          modoFiltro: MODO_FILTRO_ORDER_DES,
        }
      ],
      /*  modoFiltro: ['number_ordenarmayoramenor', 'string_filtrodatosvarios'], */
    };
  
  starsFilter: Filtro = 
    {
      nameButton: 'Filtrar por',
      data: [
        {
          id: 0,
          nombrecampoDB: 'puntuacion',
          nombrefiltro: 'Sin calificación',
          datoafiltrar: '',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
        {
          id: 1,
          nombrecampoDB: 'puntuacion',
          nombrefiltro: '1 Estrella',
          datoafiltrar: '',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
        {
          id: 2,
          nombrecampoDB: 'puntuacion',
          nombrefiltro: '2 Estrellas',
          datoafiltrar: '',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
        {
          id: 3,
          nombrecampoDB: 'puntuacion',
          nombrefiltro: '3 Estrellas',
          datoafiltrar: '',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
        {
          id: 4,
          nombrecampoDB: 'puntuacion',
          nombrefiltro: '4 Estrellas',
          datoafiltrar: '',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
        {
          id: 5,
          nombrecampoDB: 'puntuacion',
          nombrefiltro: '5 Estrellas',
          datoafiltrar: '',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        }
      ],
      /*  modoFiltro: ['number_ordenarmayoramenor', 'string_filtrodatosvarios'], */
    };

  constructor(private granjasService: GranjasService,
    private appModalService: AppModalService,
    private router: Router,
    private searchBuscadorService: SearchBuscadorService,
    private places: PlacesService,
    private asociacionService:AsociacionesService) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if(token){
      let payload = Utilities.parseJwt(token!);
      this.authUserId = payload.sub;
      this.authRol = payload.rol;
    }
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

  deleteFilterCheckbox(index: number) {
    this.filtroseleccionadoCheckbox.splice(index,1);
     console.log(this.filtroseleccionadoCheckbox);
     this.searchReset();
   }

   searchReset() {
    let resultados: any[] = this.buscarData(this.palabra);
    if(this.selectedStarFilter){
      resultados = this.starFilter(resultados)
    }
    if (this.selectedOrderFilter) {
      resultados = this.filtradoData(this.selectedOrderFilter, resultados);
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
    if (this.granjasFiltered.length < 1) {
      this.showNotFound = true;
    } else {
      this.showNotFound = false;
    }
  }

  starFilter(granjas:Array<any>){
    let filteredResult = granjas.slice(0); 
    if(this.selectedStarFilter.id == 0){//sin calificación
      filteredResult = granjas.filter((element)=>{ return !element?.puntuacion })
    }else if(this.selectedStarFilter.id == 1){//1 estrella
      filteredResult = granjas.filter((element)=>{ return element?.puntuacion && element?.puntuacion >= 1 && element.puntuacion < 2})
    }else if(this.selectedStarFilter.id == 2){//2 estrella
      filteredResult = granjas.filter((element)=>{ return element?.puntuacion && element?.puntuacion >= 2 && element.puntuacion < 3})
    }else if(this.selectedStarFilter.id == 3){//3 estrella
      filteredResult = granjas.filter((element)=>{ return element?.puntuacion && element?.puntuacion >= 3 && element.puntuacion < 4})
    }else if(this.selectedStarFilter.id == 4){//4 estrella
      filteredResult = granjas.filter((element)=>{ return element?.puntuacion && element?.puntuacion >= 4 && element.puntuacion < 5})
    }else if(this.selectedStarFilter.id == 5){//5 estrella
      filteredResult = granjas.filter((element)=>{ return element?.puntuacion && element?.puntuacion == 5 })
    }
    return filteredResult;
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

  deleteOrderFilter() {
    this.selectedOrderFilter = null;
    this.searchReset();
  }

  deleteStarFilter(){
    this.selectedStarFilter = null;
    this.searchReset();
  }

  onFiltroChangeCheckbox(checkboxs: string[]) {
    this.filtroseleccionadoCheckbox = checkboxs;
    this.searchReset();
  }

  onOrderFilterChange(filter: MetaFiltro) {
    this.selectedOrderFilter = filter;
    this.searchReset();
  }

  onStarFilterChange(filtro: MetaFiltro) {
    this.selectedStarFilter = filtro;
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

  onFiltersAplied(result:any){
    this.selectedStarFilter = result.chipFilter1;
    this.selectedOrderFilter = result.radioFilter1;
    this.filtroseleccionadoCheckbox = result.selectedCheckboxs;
    this.searchReset();
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { MODOFILTRO2 } from 'src/app/global/constants';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PlacesService } from 'src/app/services/places.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { Utilities } from 'src/app/utilities/utilities';
import { BuscarPor } from 'src/models/buscarPor.model';
import { Checkbox } from 'src/models/checkbox.model';
import { Filtro, MetaFiltro } from 'src/models/filtro.model';

@Component({
  selector: 'app-pescadores',
  templateUrl: './pescadores.component.html',
  styleUrls: ['./pescadores.component.scss']
})
export class PescadoresComponent implements OnInit {
  pescadoresFiltered!: any[];
  filtroseleccionadoCheckbox: string[] = [];
  filtroseleccionado!: MetaFiltro | any;
  palabra: string = '';
  pescadores!: any[];
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
      nameButton: 'Tipo de asociación',
      data: [
        {
          id: 0,
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Piscicultores',
          datoafiltrar: 'Piscicultores',
          modoFiltro: MODOFILTRO2,
        },
        {
          id: 1,
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Pescadores',
          datoafiltrar: 'Pescadores',
          modoFiltro: MODOFILTRO2,
        },
        {
          id: 2,
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Mixta',
          datoafiltrar: 'Mixta',
          modoFiltro: MODOFILTRO2,
        },
      ],
      /*  modoFiltro: ['number_ordenarmayoramenor', 'string_filtrodatosvarios'], */
    },
  ];
  
  constructor(private pescadoresService: PescadoresService,
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
    this.pescadoresService.getPescadores().subscribe((response:any) => {
      this.pescadores = response.data;
      this.pescadoresFiltered = this.pescadores.slice();
      console.log(this.pescadoresFiltered);
      if (this.pescadoresFiltered.length < 1) {
        this.showNotFound = true;
      } else {
        this.showNotFound = false;
      }
    });
    /* municipios sucre */
    this.loadMunic();
  }

  goDetail(pescador: any) {
    let url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/pescadores/municipio/detalle/${pescador.id}`,
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
    /* if (this.filtroseleccionado) {
      resultados = this.filtradoData(this.filtroseleccionado, resultados);
    } */
    if (
      this.filtroseleccionadoCheckbox &&
      this.filtroseleccionadoCheckbox.length > 0
    ) {
      resultados = this.filtradoDataCheckbox(
        this.filtroseleccionadoCheckbox,
        resultados
      );
    }
    this.pescadoresFiltered = resultados;
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
      asociacionesresult = this.pescadores;
    } else {
      let buscardatospor: BuscarPor[] = [{ data1: 'nombre' }];
      asociacionesresult = this.searchBuscadorService.buscarData(
        this.pescadores,
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

import {
  Component,
  OnInit,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Router } from '@angular/router';
import { Filtro, MetaFiltro } from 'src/models/filtro.model';
import { Checkbox } from 'src/models/checkbox.model';
import { MODOFILTRO2, MODO_FILTRO_ORDER_ASC, MODO_FILTRO_ORDER_DES } from 'src/app/global/constants';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { BuscarPor } from 'src/models/buscarPor.model';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  productos:Array<any> = [];
  productosFiltered:Array<any> = [];
  filtroseleccionadoCheckbox: string[] = [];
  filtroseleccionado!: MetaFiltro | any;
  palabra: string = '';
  municipios: Array<any> = [];
  showNotFound: boolean = false;
  authUserId: number = -1;
  authRol:string = '';
  checkbox: Checkbox[] = [
    {
      nameButton: 'Municipio de proveedor',
      nombrecampoDB: 'municipio_proveedor',
      modoFiltro: MODOFILTRO2,
      titulomodal: 'Municipios de sucre',
    },
    /* modoFiltro: 'number_ordenarmayoramenor', */
  ];
  /* varibles de buscqueda y filtros */
  filtro: Filtro[] = [
    {
      nameButton: 'Ordenar por',
      data: [
        {
          id: 0,
          nombrecampoDB: 'precio',
          nombrefiltro: 'Precio (mayor a menor)',
          datoafiltrar: 'precio',
          modoFiltro: MODO_FILTRO_ORDER_DES,
        },
        {
          id: 1,
          nombrecampoDB: 'precio',
          nombrefiltro: 'Precio (menor a mayor)',
          datoafiltrar: 'precio',
          modoFiltro: MODO_FILTRO_ORDER_ASC,
        },
      ],
      /*  modoFiltro: ['number_ordenarmayoramenor', 'string_filtrodatosvarios'], */
    },
  ];
 
  constructor(private proveedorService:ProveedorService,
    private router:Router,
    private searchBuscadorService: SearchBuscadorService,
    private places: PlacesService){

  }
  ngOnInit(): void {
    registerLocaleData(es);
    this.proveedorService.getProductosAll().subscribe(
      (response)=>{
        console.log(response);
        this.productos = response.data;
        this.productosFiltered = this.productos;
        if (this.productosFiltered.length < 1) {
          this.showNotFound = true;
        } else {
          this.showNotFound = false;
        }
      }
    )

    /* municipios sucre */
    this.loadMunic();
  }

  onSearch(text:string){
      console.log("productos ",text)
      if(text == ''){
        this.productosFiltered = this.productos;
      }else{
        this.productosFiltered = this.productos.filter((element)=>{
          return element.nombreProducto.toLocaleLowerCase().includes(text.toLocaleLowerCase());
        })
      }
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
    this.productosFiltered = resultados;
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
    let result: any[];
    if (texto.trim().length === 0) {
      result = this.productos;
    } else {
      let buscardatospor: BuscarPor[] = [{ data1: 'nombre' }];
      result = this.searchBuscadorService.buscarData(
        this.productos,
        texto,
        buscardatospor
      );
    }
    return result;
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

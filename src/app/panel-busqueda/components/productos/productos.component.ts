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
import { MODO_FILTRO_DATOS_VARIOS, MODO_FILTRO_ORDER_ASC, MODO_FILTRO_ORDER_DES } from 'src/app/global/constants';
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
  selectedPriceFilter!: MetaFiltro | any;
  palabra: string = '';
  municipios: Array<any> = [];
  showNotFound: boolean = false;
  authUserId: number = -1;
  authRol:string = '';
  checkbox: Checkbox[] = [
    {
      nameButton: 'Municipio de proveedor',
      nombrecampoDB: 'municipio_proveedor',
      modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      titulomodal: 'Municipios de sucre',
    },
    /* modoFiltro: 'number_ordenarmayoramenor', */
  ];
  /* varibles de buscqueda y filtros */
  filtro: Filtro = 
    {
      nameButton: 'Ordenar por',
      data: [
        {
          id: 0,
          nombrecampoDB: 'precio',
          nombrefiltro: 'Precio (Mayor a menor)',
          datoafiltrar: 'precio',
          modoFiltro: MODO_FILTRO_ORDER_DES,
        },
        {
          id: 1,
          nombrecampoDB: 'precio',
          nombrefiltro: 'Precio (Menor a mayor)',
          datoafiltrar: 'precio',
          modoFiltro: MODO_FILTRO_ORDER_ASC,
        },
      ]
    };

  orderFilter: Filtro = 
    {
      nameButton: 'Filtrar por precio',
      data: [
        {
          id: 0,
          nombrecampoDB: 'precio',
          nombrefiltro: '$0 - $100.000',
          datoafiltrar: 'precio',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
        {
          id: 1,
          nombrecampoDB: 'precio',
          nombrefiltro: '$100.000 - $200.000',
          datoafiltrar: 'precio',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
        {
          id: 2,
          nombrecampoDB: 'precio',
          nombrefiltro: '$200.000 - $500.000',
          datoafiltrar: 'precio',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
        {
          id: 3,
          nombrecampoDB: 'precio',
          nombrefiltro: 'Más de $500.000',
          datoafiltrar: 'precio',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        }
      ]
    };


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
      this.palabra = text;
      this.searchReset();
  }

  delateFilterCheckbox(index: number) {
    this.filtroseleccionadoCheckbox.splice(index,1);
     console.log(this.filtroseleccionadoCheckbox);
     this.searchReset();
   }
  searchReset() {
    let resultados: any[] = this.buscarData(this.palabra);
    if(this.selectedPriceFilter){
      resultados = this.priceFilter(resultados);
    }
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
    if(this.productosFiltered.length < 1){
      this.showNotFound = true;
    }else{
      this.showNotFound = false;
    }

    console.log("showNotFound ",this.showNotFound)
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
    let result: any[];
    if (texto.trim().length === 0) {
      result = this.productos;
    } else {
      let buscardatospor: BuscarPor[] = [{ data1: 'nombreProducto' }];
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
    this.searchReset();
  }

  deletePriceFilter(){
    this.selectedPriceFilter = null;
    this.searchReset();
  }

  onFiltroChangeCheckbox(checkboxs: string[]) {
    this.filtroseleccionadoCheckbox = checkboxs;
    this.searchReset();
  }

  onFiltroChange(filtro: MetaFiltro) {
    this.filtroseleccionado = filtro;
    this.searchReset();
  }

  onPriceFilterChange(filter: MetaFiltro){
    this.selectedPriceFilter = filter;
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

  priceFilter(productos:Array<any>){
    let result = productos.slice()
    console.log(this.selectedPriceFilter.id)
    if(this.selectedPriceFilter.id == 0){//0-100
      result = productos.filter((element)=>{
        return element.precio <= 100000
      })  
    }else if(this.selectedPriceFilter.id == 1){//100-200
      result = productos.filter((element)=>{
        return element.precio >= 100000 && element.precio <= 200000 
      })
    }else if(this.selectedPriceFilter.id == 2){//200 - 500
      result = productos.filter((element)=>{
        return element.precio >= 200000 && element.precio <= 500000 
      })
    }else if(this.selectedPriceFilter.id == 3){//+500
      result = productos.filter((element)=>{
        return element.precio > 500000
      })
    }
    return result;
  }

  onFiltersAplied(result:any){
    this.selectedPriceFilter = result.chipFilter1;
    this.filtroseleccionado = result.radioFilter1;
    this.filtroseleccionadoCheckbox = result.selectedCheckboxs;
    this.searchReset();
  }

  goDetail(producto: any) {
    let url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/proveedores/producto/detalle/${producto.codigo}`,
      ])
    );
    window.open(url, '_blank');
  }
}

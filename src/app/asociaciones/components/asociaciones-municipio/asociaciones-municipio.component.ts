import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { AsociacionesService } from '../../services/asociaciones.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { BuscarPor } from '../../../../models/buscarPor.model';
import { Filtro, MetaFiltro } from 'src/models/filtro.model';
import { MODO_FILTRO_DATOS_VARIOS } from 'src/app/global/constants';
import { filter } from 'rxjs/internal/operators/filter';
import { PlacesService } from 'src/app/services/places.service';
@Component({
  selector: 'app-asociaciones-municipio',
  templateUrl: './asociaciones-municipio.component.html',
  styleUrls: ['./asociaciones-municipio.component.scss'],
})
export class AsociacionesMunicipioComponent implements OnInit {
  showNotFound: boolean = false;
  legalrepresentanteasociacion: any;
  asociaciones: any[] = [];
  asociasionessarray: any[] = [];
  filtro: Filtro[] = [
    {
      nameButton: 'Tipo de asociación',
      data: [
        {
          id: 0,
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Piscicultores',
          datoafiltrar: 'Piscicultores',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
        {
          id: 1,
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Pescadores',
          datoafiltrar: 'Pescadores',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
        {
          id: 2,
          nombrecampoDB: 'tipo_asociacion',
          nombrefiltro: 'Mixta',
          datoafiltrar: 'Mixta',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
      ],
    },
  ];
  filtroseleccionado!: MetaFiltro | null;
  palabra: string = '';
  poblacion: number = 0;
  municipio: string = '';
  constructor(
    private asociacionesService: AsociacionesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private searchBuscadorService: SearchBuscadorService,
    private placesService: PlacesService
  ) {}

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.params.id;
     this.placesService.getMunicipioById(id).subscribe(
      /* preguntarle a renso */
       (response) => {
         if (response.data.length > 0) {
           this.poblacion = response.data[0].poblacion;
           this.municipio = response.data[0].nombre;
         }
       },
       (err) => {}
     );
    this.asociacionesService
      .getAsociacionesMunicipio(Number(this.activatedRoute.snapshot.url[1]))
      .subscribe(
        (response) => {
          this.asociaciones = response.data;
          this.asociasionessarray = response.data;
          if (this.asociaciones.length !== 0) {
            this.showNotFound = false;
          } else {
            this.showNotFound = true;
          }
        },
        (err) => {
          console.error(err);
          this.showNotFound = true;
        }
      );

  }
  goAsociacionDetail(asociacion: any) {
    this.router.navigateByUrl(
      '/asociaciones/municipio/detalle/' + asociacion.nit
    );
  }
  goDetalleRepresentante(asociacion: any) {
    console.log('representante legal');
    console.log(asociacion.id_propietario);
    console.log(asociacion);
    console.log(asociacion.tipo_propietario);
    if (asociacion.tipo_propietario == 'Pescador') {
      this.router.navigateByUrl(
        '/pescadores/municipio/detalle/' + asociacion.id_propietario
      );
    } else if (asociacion.tipo_propietario == 'Piscicultor') {
      this.router.navigateByUrl(
        '/piscicultores/municipio/detalle/' + asociacion.id_propietario
      );
    }
  }
  /* funciones de busqueda granjas */
  buscarData(texto: string): any {
    let asociacionesresult: any[];
    if (texto.trim().length === 0) {
      asociacionesresult = this.asociasionessarray;
    } else {
      let buscardatospor: BuscarPor[] = [
        { data1: 'nombre' },
        { data2: 'propietario' },
        { data3: 'nit' },
        { data4: 'municipio' },
      ];
      asociacionesresult = this.searchBuscadorService.buscarData(
        this.asociasionessarray,
        texto,
        buscardatospor
      );
    }
    return asociacionesresult;
  }
  onBuscarPalabra(palabra: string) {
    this.palabra = palabra;
    this.reseteoDeBusqueda();
  }
  filtradoData(filtroSelecOptionData: MetaFiltro, arrayafiltar: any[]) {
    let filtroresult: any[] = [];
    filtroresult = this.searchBuscadorService.filterSeleccionadoList(
      arrayafiltar,
      filtroSelecOptionData
    );
    return filtroresult;
  }
  onFiltroChange(filtro: MetaFiltro) {
    this.filtroseleccionado = filtro;
    this.reseteoDeBusqueda();
  }
  delateFilter() {
    this.filtroseleccionado = null;
    this.reseteoDeBusqueda();
  }
  reseteoDeBusqueda() {
    let resultados: any[] = this.buscarData(this.palabra);
    if (this.filtroseleccionado) {
      resultados = this.filtradoData(this.filtroseleccionado, resultados);
    }
    this.asociaciones = resultados;
  }
}

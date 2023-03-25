import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MODO_FILTRO_DATOS_VARIOS } from 'src/app/global/constants';
import { NovedadesService } from 'src/app/services/novedades.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { BuscarPor } from 'src/models/buscarPor.model';
import { Filtro, MetaFiltro } from 'src/models/filtro.model';
import { Novedad } from 'src/models/novedad.model';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss'],
})
export class NovedadesComponent implements OnInit {
  novedadesFiltered: Array<Novedad> = [];
  tipo!: string;
  showNotFound: boolean = false;
  loading: boolean = false;
  novedades: any[] = [];
  palabra: string = '';
  filtroseleccionado!: MetaFiltro | null;
  filtro: Filtro[] = [
    {
      nameButton: 'Filtrar',
      data: [
        {
          id: 0,
          nombrecampoDB: 'me_gusta',
          nombrefiltro: 'Me gustas',
          datoafiltrar: 'me_gusta',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
        },
      ],
    },
  ];
  filtersButton: any[] = [
    { label: 'Artículos', route: '/novedades/articulos' },
    { label: 'Artículos colombianos', route: '/novedades/articulos-colombia' },
    { label: 'Revistas', route: '/novedades/revistas' },
    { label: 'Noticias', route: '/novedades/noticias' },
  ];
  constructor(
    private activatedRoute: ActivatedRoute,
    private nService: NovedadesService,
    public userService: UsuarioService,
    private searchBuscadorService: SearchBuscadorService,
    private appModalService: AppModalService,
    public location2: PlatformLocation,
    public router: Router
  ) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.url[0].path == 'articulos-colombia') {
      this.tipo = 'articulo-colombia';
    } else {
      this.tipo = this.activatedRoute.snapshot.url[0].path.substring(
        0,
        this.activatedRoute.snapshot.url[0].path.length - 1
      );
    }
    this.cargarTodos();
  }
  onFiltroChange() {
    let filtro: any = this.filtro[0].data[0];
    this.filtroseleccionado = filtro;
    this.reseteoDeBusqueda();
  }
  filtradoData(filtroSelecOptionData: MetaFiltro, arrayafiltar: any[]) {
    return arrayafiltar.filter((dataarray) => {
      let dataanalisis =
        dataarray[filtroSelecOptionData.nombrecampoDB!].toString();
      return dataanalisis?.includes('1');
    });
  }
  delateFilter() {
    this.filtroseleccionado = null;
    this.reseteoDeBusqueda();
  }
  cargarTodos() {
    this.showNotFound = false;
    this.loading = true;
    this.nService.getNovedadesByTipo(this.tipo).subscribe(
      (response) => {
        this.novedadesFiltered = response.data;
        this.novedades = this.novedadesFiltered.slice();
        if (this.novedadesFiltered.length < 1) {
          this.showNotFound = true;
        }
        this.loading = false;
      },
      (err) => {
        this.novedadesFiltered.length = 0;
        this.loading = false;
        console.log(err);
      }
    );
  }
  onView(idNovedad: number, i: number, url_novedad?: any) {
    this.nService.addView(idNovedad).subscribe(
      (response) => {
        this.navigateDetalle(url_novedad);
        this.novedadesFiltered[i].cant_visitas++;
      },
      (err) => {
        this.novedadesFiltered[i].cant_visitas--;
      }
    );
  }

  onLike(novedad: any, i: number) {
    if (this.userService.isAuthenticated()) {
      if (novedad.me_gusta > 0) {
        this.novedadesFiltered[i].me_gusta = 0;
        this.novedadesFiltered[i].likes--;
        this.nService.dislike(novedad.id_novedad).subscribe(
          (response) => {},
          (err) => {
            this.novedadesFiltered[i].me_gusta = 1;
            this.novedadesFiltered[i].likes++;
          }
        );
      } else {
        this.novedadesFiltered[i].me_gusta = 1;
        this.novedadesFiltered[i].likes++;
        this.nService.like(novedad.id_novedad).subscribe(
          (response) => {},
          (err) => {
            this.novedadesFiltered[i].me_gusta = 0;
            this.novedadesFiltered[i].likes--;
          }
        );
      }
    } else if (!this.userService.isAuthenticated()) {
      this.location2.onPopState(() => {
        this.appModalService.closeModalAlertSignu();
      });
      this.appModalService
        .modalAlertSignu()
        .then((result: any) => {
          if (result == 'registrate') {
            this.router.navigate(['/registro']);
          } else if (result == 'ingresar') {
            this.router.navigate(['/login']);
          }
        })
        .catch((result) => {});
    }
  }
  navigateDetalle(urlNovedad: any) {
    window.open(urlNovedad, '_blank');
  }
  buscarData(texto: string): any {
    if (texto.trim().length === 0) {
      return this.novedadesFiltered;
    }
    const buscardatospor: BuscarPor[] = [
      { data1: 'titulo' },
      { data2: 'autor' },
      { data3: 'resumen' },
    ];
    return this.searchBuscadorService.buscarData(
      this.novedadesFiltered,
      texto,
      buscardatospor
    );
  }
  onBuscarPalabra(palabra: string) {
    this.palabra = palabra;
    this.reseteoDeBusqueda();
  }
  reseteoDeBusqueda() {
    const resultados = this.buscarData(this.palabra);
    const filtrado = this.filtroseleccionado
      ? this.filtradoData(this.filtroseleccionado, resultados)
      : resultados;
    this.novedades = filtrado;
    this.showNotFound = !this.novedades.length;
  }
}

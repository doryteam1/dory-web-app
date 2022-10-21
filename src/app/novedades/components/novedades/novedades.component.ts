import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NovedadesService } from 'src/app/services/novedades.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { BuscarPor } from 'src/models/buscarPor.model';
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
  novedades: any[]=[];
  palabra: string='';
  constructor(
    private activatedRoute: ActivatedRoute,
    private nService: NovedadesService,
    private userService: UsuarioService,
    private searchBuscadorService: SearchBuscadorService
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

  cargarTodos() {
    this.showNotFound = false;
    this.loading = true;
    this.nService.getNovedadesByTipo(this.tipo).subscribe(
      (response) => {
        this.novedadesFiltered = response.data;
        this.novedades = this.novedadesFiltered.slice()
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
    this.navigateDetalle(url_novedad);
    this.novedadesFiltered[i].cant_visitas++;
    this.nService.addView(idNovedad).subscribe(
      (response) => {},
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
    } else {
      console.log('El usuario debe estar autenticado para poder dar like');
    }
  }
  navigateDetalle(url_novedad: any) {
    console.log(url_novedad);
    let url = '';
    url = url_novedad;
    window.open(url, '_blank');
  }
  buscarData(texto: string): any {
    let normasresult: any[];
    if (texto.trim().length === 0) {
      normasresult = this.novedadesFiltered;
    } else {
      let buscardatospor: BuscarPor[] = [
        { data1: 'titulo' },
        { data2: 'autor' },
        { data3: 'resumen' },
      ];
      normasresult = this.searchBuscadorService.buscarData(
        this.novedadesFiltered,
        texto,
        buscardatospor
      );
    }
    return normasresult;
  }
  onBuscarPalabra(palabra: string) {
    this.palabra = palabra;
    this.reseteoDeBusqueda();
  }
  reseteoDeBusqueda() {
     let resultados: any[] = this.buscarData(this.palabra);
     this.novedades = resultados;
     if (this.novedades.length < 1) {
       this.showNotFound = true;
     } else {
       this.showNotFound = false;
     }
  }
}

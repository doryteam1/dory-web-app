import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NovedadesService } from 'src/app/services/novedades.service';
import { UsuarioService } from 'src/app/services/usuario.service';
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
  constructor(
    private activatedRoute: ActivatedRoute,
    private nService: NovedadesService,
    private userService: UsuarioService,
    private router: Router
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
    console.log('cargar novedade de tipo ', this.tipo);
    this.cargarTodos();
  }

  cargarTodos() {
    this.showNotFound = false;
    this.loading = true;
    this.nService.getNovedadesByTipo(this.tipo).subscribe(
      (response) => {
        this.novedadesFiltered = response.data;
        console.log(this.novedadesFiltered);
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

  textChange(event: string) {
    if (event == '') {
      this.cargarTodos();
      return;
    }
  }

  onSearch(event: string) {
    console.log('event: ', event);
    if (event == '') {
      return;
    }

    this.showNotFound = false;
    this.loading = true;
    this.nService.getNovedadesByTipoCadena(this.tipo, event).subscribe(
      (response) => {
        this.novedadesFiltered = response.data;
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
  navigateDetalle(url_novedad:any) {
    console.log(url_novedad);
    let url = '';
    (url = url_novedad)
    window.open(url, '_blank');
  }
}

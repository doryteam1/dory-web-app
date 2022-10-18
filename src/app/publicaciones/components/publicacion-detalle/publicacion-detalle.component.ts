import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
@Component({
  selector: 'app-publicacion-detalle',
  templateUrl: './publicacion-detalle.component.html',
  styleUrls: ['./publicacion-detalle.component.scss'],
})
export class PublicacionDetalleComponent implements OnInit {
  selectedId: number = -1;
  publicacion: any;
  images: any = [];
  constructor(
    private publicacionesService: PublicacionesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
     registerLocaleData(es);
    this.selectedId = Number(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.publicacionesService
      .getPublicacionDetail(this.selectedId)
      .subscribe((response) => {
        this.publicacion = response?.data[0];
        console.log(this.publicacion)
        this.images = this.publicacion.fotos;
      },(err) => {
        console.log(err);
      });
  }

  goDetail(id: number) {
    let url = this.router.serializeUrl(
      this.router.createUrlTree(['transportadores/detalle/' + id])
    );
    window.open(url, '_blank');
  }
}
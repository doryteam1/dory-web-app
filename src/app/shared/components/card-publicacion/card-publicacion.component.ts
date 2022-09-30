import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

@Component({
  selector: 'app-card-publicacion',
  templateUrl: './card-publicacion.component.html',
  styleUrls: ['./card-publicacion.component.scss']
})
export class CardPublicacionComponent implements OnInit {
  @Input() publicacion:any;
  @Input() index!:number;
  constructor(private router:Router) { }

  ngOnInit(): void {
    registerLocaleData( es );
  }

  goDetail(publicacion: any) {
    let url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/proveedores/producto/detalle/${publicacion.id_publicacion}`,
      ])
    );
    window.open(url, '_blank');
  }
}

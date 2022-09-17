import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NegociosService } from 'src/app/services/negocios.service';
import { negocio } from '../../../../models/negocio-detalle.model';

@Component({
  selector: 'app-negocio-detalle',
  templateUrl: './negocio-detalle.component.html',
  styleUrls: ['./negocio-detalle.component.scss'],
})
export class NegocioDetalleComponent implements OnInit {
  selectedId: number = -1;
  negocio!: negocio;
  images: any = [];
  fullScreen: boolean = true;
  constructor(
    private negociosService: NegociosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.selectedId = Number(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.negociosService.detail(this.selectedId).subscribe(
      (response) => {
        console.log(response);
        this.negocio = response?.data[0];
        if (this.negocio && this.negocio.fotos_negocio) {
          this.images = this.negocio.fotos_negocio;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  goDetail(id: number) {
    let url = this.router.serializeUrl(
      this.router.createUrlTree(['comerciantes/detalle/' + id])
    );
    window.open(url, '_blank');
  }
}

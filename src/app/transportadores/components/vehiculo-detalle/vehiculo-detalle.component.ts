import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculosService } from 'src/app/services/vehiculos.service';

@Component({
  selector: 'app-vehiculo-detalle',
  templateUrl: './vehiculo-detalle.component.html',
  styleUrls: ['./vehiculo-detalle.component.scss'],
})
export class VehiculoDetalleComponent implements OnInit {
  selectedId: number = -1;
  vehiculo: any;
  images: any = [];
  electronActive: any = window.require; //verificar la disponibilidad, solo esta disponible en electronJS;
  constructor(
    private vehiculoService: VehiculosService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.selectedId = Number(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.vehiculoService.getDetail(this.selectedId).subscribe(
      (response) => {
        this.vehiculo = response?.data[0];
        if (this.vehiculo && this.vehiculo.fotos_vehiculos) {
          this.images = this.vehiculo.fotos_vehiculos;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  goDetail(id: number) {
     if (this.electronActive) {
       this.router.navigateByUrl('transportadores/detalle/' + id);
     } else {
       let url = this.router.serializeUrl(
         this.router.createUrlTree(['transportadores/detalle/' + id])
       );
       window.open(url, '_blank');
     }
  }
}

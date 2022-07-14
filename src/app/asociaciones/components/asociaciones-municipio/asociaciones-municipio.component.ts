import { Component, OnInit } from '@angular/core';
import { AsociacionesService } from '../../services/asociaciones.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-asociaciones-municipio',
  templateUrl: './asociaciones-municipio.component.html',
  styleUrls: ['./asociaciones-municipio.component.scss'],
})
export class AsociacionesMunicipioComponent implements OnInit {
  asociaciones: any[] = [];
  showNotFound: boolean = false;
  legalrepresentanteasociacion: any;

  constructor(
    private asociacionesService: AsociacionesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.asociacionesService
      .getAsociacionesMunicipio(Number(this.activatedRoute.snapshot.url[1]))
      .subscribe(
        (response) => {
          this.asociaciones = response.data;
          console.log(this.asociaciones)
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
              if (
                asociacion.tipo_propietario == 'Pescador'
              ) {
                this.router.navigateByUrl(
                  '/pescadores/municipio/detalle/' + asociacion.id_propietario
                );
              }else if (
                asociacion.tipo_propietario == 'Piscicultor'
              ) {
                    this.router.navigateByUrl(
                      '/piscicultores/municipio/detalle/' +
                        asociacion.id_propietario
                    );
              }
  }
}

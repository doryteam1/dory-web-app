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
  showNotFound: boolean=false;

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
          if (this.asociaciones.length !== 0) {
             this.showNotFound = false;
          }else{
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
    this.router.navigateByUrl('/asociaciones/municipio/detalle/' + asociacion.nit);
  }
}

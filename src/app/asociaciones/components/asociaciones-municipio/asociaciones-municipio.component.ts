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
  showNotFound: boolean = false;
  legalrepresentanteasociacion: any;
  asociaciones: any[] = [];
  asociasionessarray: any[] = [];
  modoFiltro: any[] = ['number_ordenarmayoramenor', 'string_filtrodatosvarios'];

  filtros: any[] = [
    {
      nombre_boton_filtro: [
        {
          name: 'Tipo de asociación',
          checkbox: false,
          data: [
            {
              nombrecampoDB: 'tipo_asociacion',
              nombrefiltro: 'Piscicultores',
              datoafiltrar: 'Piscicultores',
            },
            {
              nombrecampoDB: 'tipo_asociacion',
              nombrefiltro: 'Pescadores',
              datoafiltrar: 'Pescadores',
            },
            {
              nombrecampoDB: 'tipo_asociacion',
              nombrefiltro: 'Mixta',
              datoafiltrar: 'Mixta',
            },
            {
              nombrecampoDB: '',
              nombrefiltro: 'Ver todas',
              datoafiltrar: '',
            },
          ],
        },
      ],
    },
  ];
  buscardatospor = [
    { data1: 'nombre' },
    { data2: 'propietario' },
    { data3: 'nit' },
  ];

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
  buscarData(data: any[]) {
    this.asociaciones = data;
  }
  filtradoData(datafilter: any[]) {
    this.asociaciones = datafilter;
  }
}

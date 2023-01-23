import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-demographic-statistics',
  templateUrl: './demographic-statistics.component.html',
  styleUrls: ['./demographic-statistics.component.scss'],
})
export class DemographicStatisticsComponent implements OnInit {
  tipoFiltro: any = '';
  filtersButton: any[] = [
    { label: 'Granjas', route: '/geolocalizacion/granjas' },
    { label: 'Piscicultores', route: '/geolocalizacion/piscicultores' },
    { label: 'Pescadores', route: '/geolocalizacion/pescadores' },
    { label: 'Asociaciones', route: '/geolocalizacion/asociaciones' },
  ];
  filtros: any = {
    granjas: 'granjas',
    piscicultores: 'piscicultores',
    pescadores: 'pescadores',
    asociaciones: 'asociaciones',
  };
  constructor(private activatedRoute: ActivatedRoute, public _router: Router) {}

  ngOnInit(): void {
    this.cargaService();
  }

  cargaService() {
    const path = this.activatedRoute.snapshot.url[0].path;
    this.tipoFiltro = this.filtros[path] || 'nada';
  }
}

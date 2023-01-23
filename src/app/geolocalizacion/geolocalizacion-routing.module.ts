import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemographicStatisticsComponent } from './demographic-statistics/demographic-statistics.component';

const routes: Routes = [
  {
    path: 'granjas',
    component: DemographicStatisticsComponent,
  },
  {
    path: 'piscicultores',
    component: DemographicStatisticsComponent,
  },
  {
    path: 'pescadores',
    component: DemographicStatisticsComponent,
  },
  {
    path: 'asociaciones',
    component: DemographicStatisticsComponent,
  },
  {
    path: '**',
    redirectTo: '/geolocalizacion/granjas',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeolocalizacionRoutingModule { }

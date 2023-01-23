import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeolocalizacionRoutingModule } from './geolocalizacion-routing.module';
import { DemographicStatisticsComponent } from './demographic-statistics/demographic-statistics.component';
import { SharedModule } from '../shared/shared.module';
import { PiscicultoresModule } from '../piscicultores/piscicultores.module';
import { GranjasModule } from '../granjas/granjas.module';
import { PescadoresModule } from '../pescadores/pescadores.module';
import { AsociacionesModule } from '../asociaciones/asociaciones.module';



@NgModule({
  declarations: [DemographicStatisticsComponent],
  imports: [
    CommonModule,
    GeolocalizacionRoutingModule,
    SharedModule,
    PiscicultoresModule,
    GranjasModule,
    PescadoresModule,
    AsociacionesModule,
  ],
})
export class GeolocalizacionModule {}

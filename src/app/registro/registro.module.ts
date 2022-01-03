import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './components/registro/registro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlacesService } from '../services/places.service';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  declarations: [
    RegistroComponent,
  ],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgxSpinnerModule
  ],
  exports: [
    RegistroComponent
  ],
  providers:[
    PlacesService
  ]
})
export class RegistroModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './components/registro/registro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlacesService } from '../services/places.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbdModalOptions } from '../modals/modal-options/modal-options.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    RegistroComponent,NgbdModalOptions
  ],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgxSpinnerModule,
    SharedModule
  ],
  exports: [
    RegistroComponent
  ],
  providers:[
    PlacesService
  ]
})
export class RegistroModule { }

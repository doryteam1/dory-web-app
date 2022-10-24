import {  Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-card-asociacion',
  templateUrl: './card-asociacion.component.html',
  styleUrls: ['./card-asociacion.component.scss'],
})
export class CardAsociacionComponent
  implements OnInit
{
  @Input() asociacion: any;
  @Input() delatecard!: boolean;
  @Input() showRepLegal: boolean = true;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  @Output() onDetalleRepresentante: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  showNotFound: boolean = false;
  changeItem: boolean = true;
  piscicultorasociaciones: any;
  showError: boolean = false;
  errorMessage = '';
  ngOnlnitPiscicultorDetalle: boolean = false;
  idEmailUser:number=-1
  constructor(
    public mediaQueryService: MediaQueryService,
    private us: UsuarioService
  ) {}

  ngOnInit(): void {
       let email = localStorage.getItem('email');
       this.us.getUsuarioByEmail(email).subscribe((response) => {
        this.idEmailUser = response.data[0].id;
       });
       console.log(this.asociacion)
  }

  detalle(asociacion: any) {
    console.log(asociacion);
    return this.onDetalle.emit(asociacion);
  }

  eliminar(asociacion: any) {
    return this.onDelete.emit(asociacion);
  }
  goDetalleRepresentante(asociacion: any) {
    console.log(asociacion);
    return this.onDetalleRepresentante.emit(asociacion);
  }
}

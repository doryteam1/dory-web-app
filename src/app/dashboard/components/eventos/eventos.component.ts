import { DatePipe, DecimalPipe, formatDate, PlatformLocation, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import * as dayjs from 'dayjs';
interface eventos {
  id_evento: number;
  nombre: string;
  resumen: string;
  fecha?: any;
  hora: string;
  imagen: string;
  url: string;
  dirigidoa: string;
  organizador: string;
  costo: string;
  id_modalidad_fk: number;
  id_tipo_evento_fk: number;
  tipo: string;
  modalidad: string;
}
@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  eventos: eventos[] = [];
  evento!: eventos;
  showError: boolean = false;
  showNotFound: boolean = false;
  authUserId: number = -1;
  constructor(
    private eventosService: EventosService,
    private storage: FirebaseStorageService,
    public platformLocation: PlatformLocation,
    private appModalService: AppModalService,
    private router: Router,
    private decimalPipe: DecimalPipe
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.cargaService();
  }
  cargaService() {
    this.eventosService.getEventos().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.eventos = response.data;
          this.showError = false;
          this.showNotFound = false;
        } else {
          this.showNotFound = true;
          this.showError = false;
        }
      },
      (err) => {
        console.log(err);
        this.showNotFound = false;
        this.showError = true;
      }
    );
  }
  deleteEvento(id: any, nombre: any, imagen: any, idx: any) {
    this.appModalService
      .confirm(
        'Eliminar novedad',
        'Está seguro que desea eliminar esta novedad',
        'Sí',
        'No',
        nombre
      )
      .then((result) => {
        if (result == true) {
          this.eventosService.deleteEvento(id).subscribe(
            (response) => {
              this.eventos.splice(idx, 1);
              if (imagen.length > 0) {
                this.storage.deleteByUrl(imagen);
              }
              if (this.eventos.length <= 0) {
                this.showNotFound = true;
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      })
      .catch((result) => {});
  }
  editarData(idNovedad: any) {
    let object: any = {
      id: idNovedad,
      action: 'update',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/evento-admi/detalle', object]);
  }
  openFormCrear() {
    let object = {
      action: 'create',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/evento-admi/detalle', object]);
  }
  FechaPipe(evento: any): any {
    if (evento?.fecha) {
      let fecha = evento?.fecha as unknown as string;
      fecha = fecha.split('T')[0];
      fecha = formatDate(fecha, 'yyyy-MM-dd', 'es');
      return fecha;
    }
  }
  numberPipe(evento: any): any {
    let number: any = Number(evento?.costo);
    if (evento.costo && number > 0) {
      number = this.decimalPipe?.transform(number, '', 'es');
      return '$' + number;
    } else {
      return 'Gratis'
    }
  }

}

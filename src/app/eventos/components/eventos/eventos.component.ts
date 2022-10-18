import {  DecimalPipe, formatDate, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EventosService } from 'src/app/services/eventos.service';
import { Evento } from 'src/models/evento.model';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  eventType: string = '';
  eventsFiltered: Array<Evento> = [];
  showNotFound: boolean = false;
  loading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eService: EventosService,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);
    let eventType: string = this.activatedRoute.snapshot.url[0].path;
    this.eventType = eventType;
    this.cargarTodos();
  }

  cargarTodos() {
    /* this.eventsFiltered = this.eventos.filter((value) => {
      return this.eventType == "capacitaciones" ? value.tipo == this.eventType.substring(0,this.eventType.length - 2) : value.tipo == this.eventType.substring(0,this.eventType.length - 1)
    }); */
    console.log('Cargando todos!');
    this.showNotFound = false;
    this.loading = true;
    this.eService.getEventoByTipo(this.eventType).subscribe(
      (response) => {
        this.eventsFiltered = response.data;
        console.log(this.eventsFiltered);
        if (this.eventsFiltered.length < 1) {
          this.showNotFound = true;
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  textChange(event: string) {
    if (event == '') {
      this.cargarTodos();
      return;
    }
  }

  onSearch(event: string) {
    console.log('event: ', event);
    if (event == '') {
      return;
    }
    let obser: Observable<any>;
    this.loading = true;
    if (this.eventType == 'cursos') {
      obser = this.eService.getCursosByString(event);
    } else if (this.eventType == 'congresos') {
      obser = this.eService.getCongresosByString(event);
    } else if (this.eventType == 'capacitaciones') {
      obser = this.eService.getCapacitacionesByString(event);
    } else {
      return;
    }

    this.showNotFound = false;
    obser.subscribe(
      (response) => {
        this.eventsFiltered = response.data;
        if (this.eventsFiltered.length < 1) {
          this.showNotFound = true;
        }
        this.loading = false;
      },
      (err) => {
        console.log('Error ', err);
        this.eventsFiltered.length = 0;
        this.loading = false;
      }
    );
  }
  FechaPipe(fecha: any): any {
    if (fecha) {
      let fech = fecha as unknown as string;
      fech = fecha.split('T')[0];
      fech = formatDate(fech, 'yyyy-MM-dd', 'es');
      return fech;
    }
  }
  numberPipe(costo: any): any {
    let number: any = Number(costo);
    if (costo && number > 0) {
      number = this.decimalPipe?.transform(number, '', 'es');
      return '$' + number;
    } else {
      return 'Gratis';
    }
  }
}

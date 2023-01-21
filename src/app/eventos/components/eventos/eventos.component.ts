import {  DecimalPipe, formatDate, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EventosService } from 'src/app/services/eventos.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { BuscarPor } from 'src/models/buscarPor.model';
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
  palabra: string = '';
  eventos: Evento[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private eService: EventosService,
    private decimalPipe: DecimalPipe,
    private searchBuscadorService: SearchBuscadorService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);
    let eventType: string = this.activatedRoute.snapshot.url[0].path;
    this.eventType = eventType;
    this.cargarTodos();
  }

  cargarTodos() {
    this.showNotFound = false;
    this.loading = true;
    this.eService.getEventoByTipo(this.eventType).subscribe(
      (response) => {
        this.eventsFiltered = response.data;
        this.eventos = this.eventsFiltered.slice();
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

  onBuscarPalabra(palabra: string) {
    this.palabra = palabra;
    this.searchReset();
  }
  searchReset() {
    let resultados: any[] = this.buscarData(this.palabra);
    this.eventos = resultados;
    this.showNotFound = this.eventos.length < 1 ? true : false;
  }
  buscarData(texto: string): any {
      if (texto.trim().length === 0) {
        return this.eventsFiltered;
      }
      const buscardatospor: BuscarPor[] = [
        { data1: 'nombre' },
        { data2: 'resumen' },
        { data3: 'organizador' },
        { data4: 'dirigidoa' },
      ];
      return this.searchBuscadorService.buscarData(
        this.eventsFiltered,
        texto,
        buscardatospor
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

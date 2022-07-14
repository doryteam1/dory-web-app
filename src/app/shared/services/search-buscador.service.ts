import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchBuscadorService {
  private _historialgranjas: string[] = [];
  private _historialpiscicultores: string[] = [];
  private _historialpescadores: string[] = [];
  private _historialasociaciones: string[] = [];
  private _valoractualpulsado: string = '';

  constructor(){
    if (
      localStorage.getItem('HistirialSearchGranjas') ||
      localStorage.getItem('HistirialSearchPescadores') ||
      localStorage.getItem('HistirialSearchPiscicultores') ||
      localStorage.getItem('HistirialSearchAsociaciones')
    ) {
      this._historialgranjas = JSON.parse(
        localStorage.getItem('HistirialSearchGranjas')! ||
          localStorage.getItem('HistirialSearchPescadores')! ||
          localStorage.getItem('HistirialSearchPiscicultores')! ||
          localStorage.getItem('HistirialSearchAsociaciones')!
      );
    }
  }
  get getHistorialGranjas() {
    return this._historialgranjas;
  }
  get getHistorialPiscicultores() {
    return [...this._historialpiscicultores];
  }
  get getHistorialPescadores() {
    return [...this._historialpescadores];
  }
  get getHistorialAsociaciones() {
    return [...this._historialasociaciones];
  }
  get getValorActualPulsado() {
    return this._valoractualpulsado;
  }
  DataSearchExiste(datasearchexiste:boolean){

  }
  buscarData(query: string, dataabuscar?: string) {
    this._valoractualpulsado=query
    if (dataabuscar == 'granjas') {
      if (!this._historialgranjas.includes(query)) {
        this._historialgranjas.unshift(query);
        this._historialgranjas = this._historialgranjas.splice(0, 5);
        localStorage.setItem('HistirialSearchGranjas',JSON.stringify(this._historialgranjas))
      }
    } else if (dataabuscar == 'pescadores') {
      if (!this._historialpescadores.includes(query)) {
        this._historialpescadores.unshift(query);
        this._historialpescadores = this._historialpescadores.splice(0, 5);
         localStorage.setItem(
           'HistirialSearchPescadores',
           JSON.stringify(this._historialpescadores)
         );
      }
    } else if (dataabuscar == 'piscicultores') {
      if (!this._historialpiscicultores.includes(query)) {
        this._historialpiscicultores.unshift(query);
        this._historialpiscicultores = this._historialpiscicultores.splice(
          0,
          5
        );
         localStorage.setItem(
           'HistirialSearchPiscicultores',
           JSON.stringify(this._historialpiscicultores)
         );
      }
    } else if (dataabuscar == 'asociaciones') {
      if (!this._historialasociaciones.includes(query)) {
        this._historialasociaciones.unshift(query);
        this._historialasociaciones = this._historialasociaciones.splice(0, 5);
         localStorage.setItem(
           'HistirialSearchAsociaciones',
           JSON.stringify(this._historialasociaciones)
         );
      }
    }
  }
}

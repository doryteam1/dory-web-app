import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchBuscadorService {
  private _arraydatasearch: any[] = [];
  private _arraydatafilter: any[] = [];
  /*   private _historialpiscicultores: string[] = [];
  private _historialpescadores: string[] = [];
  private _historialasociaciones: string[] = [];
  private _valoractualpulsado: string = ''; */

  constructor() {
    /*     if (
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
    } */
  }
  get getArraydataSearch() {
    return [...this._arraydatasearch];
  }
  get getArraydataFilter() {
    return [...this._arraydatafilter];
  }
  /*   get getHistorialPiscicultores() {
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
  } */
  buscarData(arraydata: any[], query: string) {
    let arraydatanew = arraydata.slice()
    let newArray = arraydatanew.filter((dataarray) => {
      return (
        dataarray.nombre.toLowerCase().includes(query.toLowerCase()) ||
        dataarray.descripcion.toLowerCase().includes(query.toLowerCase())
      );
    });
    this._arraydatasearch=newArray
    /*     this._valoractualpulsado=query
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
    } */
  }
  filterArray(arraydata: any[], parametroaevualuar:any) {
     let arraydatanew = arraydata.slice();
    let filterarraydata = arraydatanew.sort((a, b) => {
      if (Number(a[parametroaevualuar]) > Number(b[parametroaevualuar])) {
        return -1;
      } else if (
        Number(a[parametroaevualuar]) < Number(a[parametroaevualuar])
      ) {
        return 1;
      } else {
        return 0;
      }
    });
    this._arraydatafilter=filterarraydata
  }

}

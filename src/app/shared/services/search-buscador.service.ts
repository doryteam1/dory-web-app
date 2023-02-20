import { Injectable } from '@angular/core';
import { MODO_FILTRO_DATOS_VARIOS, MODO_FILTRO_ORDER_ASC } from 'src/app/global/constants';
import { Checkbox } from 'src/models/checkbox.model';
import { MetaFiltro } from '../../../models/filtro.model';
import { MODO_FILTRO_ORDER_DES } from '../../global/constants';


@Injectable({
  providedIn: 'root',
})
export class SearchBuscadorService {
  arrayx: any[] = [];
  buscarData(arraydata: any[], query: string, buscarpor: any[]) {
    let arraydatanew = arraydata.slice();
    query = query.toLowerCase();
    let newArray = arraydatanew.filter((dataarray) => {
      let dataanalisis;
      for (let i = 0; i < buscarpor.length; i++) {
        let dta = `data${i + 1}`;
        dataanalisis = dataarray[buscarpor[i][dta]]?.toString().toLowerCase();
        if (dataanalisis?.includes(query)) {
          return true;
        }
      }
      return false;
    });
    return newArray;
  }

  /**
   * @param items objetos del array
   * @param term termino de busqueda (culaquier letra o palabra)
   * @param includeList matriz de cadenas que se filtrara durante la búsqueda,ejemplo:se filtrara, por titulo,descripcion (key en el objeto)
   */

  buscarDataDos(
    items: Array<{ [key: string]: any }>,
    term: string,
    includeList: any[] = []
  ): any {
    if (!term || !items) return items;
    const toCompare = term?.toLowerCase()?.trim();
    let arrayCopy = [...items];
    return arrayCopy.filter((item: any) =>
      this.checkInside(item, term, includeList, toCompare)
    );
  }

  checkInside(item: any, term: string, includeList: any, toCompare: string) {
    if (
      typeof item === 'string' &&
      item.toString()?.toLowerCase()?.includes(toCompare)
    ) {
      return true;
    }

    for (let property in item) {
      if (
        item[property] === null ||
        item[property] == undefined ||
        !includeList.includes(property)
      ) {
        continue;
      }
      if (typeof item[property] === 'object') {
        if (this.checkInside(item[property], term, includeList, toCompare)) {
          return true;
        }
      } else if (item[property].toString().toLowerCase()?.includes(toCompare)) {
        return true;
      }
    }
    return false;
  }

  filterSeleccionadoList(
    arraydataabuscar: any[],
    filtroSelecOptionData: MetaFiltro
  ): any {
    /* Ordena arrayas de mayor a menor , pasandole una referencia un valor numerico */
    let arraydatanew = arraydataabuscar.slice();

    const orderAsc = (a: any, b: any) =>
      Number(a[filtroSelecOptionData.datoafiltrar!]) -
      Number(b[filtroSelecOptionData.datoafiltrar!]);

    const orderDes = (a: any, b: any) => {
      if (
        Number(a[filtroSelecOptionData.datoafiltrar!]) >
        Number(b[filtroSelecOptionData.datoafiltrar!])
      ) {
        return -1;
      } else if (
        Number(a[filtroSelecOptionData.datoafiltrar!]) <
        Number(b[filtroSelecOptionData.datoafiltrar!])
      ) {
        return 1;
      } else {
        return 0;
      }
    };

    if (filtroSelecOptionData.modoFiltro === MODO_FILTRO_ORDER_DES) {
      return arraydatanew.sort(orderDes);
    } else if (filtroSelecOptionData.modoFiltro === MODO_FILTRO_ORDER_ASC) {
      return arraydatanew.sort(orderAsc);
    } else if (filtroSelecOptionData.modoFiltro === MODO_FILTRO_DATOS_VARIOS) {
      if (
        filtroSelecOptionData.nombrecampoDB == null ||
        filtroSelecOptionData.datoafiltrar == null ||
        filtroSelecOptionData == null
      ) {
        return arraydatanew;
      } else {
        let query = filtroSelecOptionData.datoafiltrar.toLowerCase();
        let newArray = arraydatanew.filter((dataarray) => {
          let dataanalisis =
            dataarray[filtroSelecOptionData.nombrecampoDB!]?.toLowerCase();
          return dataanalisis?.includes(query);
        });
        return newArray;
      }
    }
  }

  filterCheckbox(
    arraydataabuscar: any[],
    arrayCheckboxSelec: any[],
    filtroSelecOptionData: Checkbox[]
  ): any {
    if (filtroSelecOptionData[0].modoFiltro == MODO_FILTRO_DATOS_VARIOS) {
      let arraydataabuscarnew = arraydataabuscar.slice();
      let _arraydatafilter: any[] = [];
      let queryList: any[] = arrayCheckboxSelec;
      for (let index = 0; index < queryList.length; index++) {
        const element = queryList[index].toLowerCase();
        let newArray = arraydataabuscarnew.filter((dataarray) => {
          let dataanalisis =
            dataarray[filtroSelecOptionData[0].nombrecampoDB!]?.toLowerCase();
          return dataanalisis?.includes(element);
        });
        _arraydatafilter = _arraydatafilter.concat(newArray);
      }
      return _arraydatafilter;
    }
  }

  filterEspecial(
    arrayAfiltrar: any[],
    filtroSelec: any[],
    nombrecampoDB: string
  ) {
    let respuestaFinal = [];
    for (let index = 0; index < filtroSelec.length; index++) {
      const element = filtroSelec[index];
      let newArray = arrayAfiltrar.filter((dataarray) => {
        let dataanalisis = dataarray[nombrecampoDB];
        return dataanalisis?.includes(element);
      });
      let valores: any = {
        nombre: element,
        datos: newArray,
      };
      respuestaFinal.push(valores);
    }
    return respuestaFinal;
  }
}

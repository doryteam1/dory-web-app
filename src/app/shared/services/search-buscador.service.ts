import { Injectable } from '@angular/core';
import { MODO_FILTRO_DATOS_VARIOS, MODO_FILTRO_ORDER_ASC } from 'src/app/global/constants';
import { Checkbox } from 'src/models/checkbox.model';
import { MetaFiltro } from '../../../models/filtro.model';
import { MODO_FILTRO_ORDER_DES } from '../../global/constants';
import { BuscarPor } from '../../../models/buscarPor.model';

@Injectable({
  providedIn: 'root',
})
export class SearchBuscadorService {
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
  filterSeleccionadoList(
    arraydataabuscar: any[],
    filtroSelecOptionData: MetaFiltro
  ): any {
    /* Ordena arrayas de mayor a menor , pasandole una referencia un valor numerico */
    let arraydatanew = arraydataabuscar.slice();

    const orderAsc = (a:any, b:any) =>
      Number(a[filtroSelecOptionData.datoafiltrar!]) -
      Number(b[filtroSelecOptionData.datoafiltrar!]);

    const orderDes = (a:any, b:any) => {
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

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

  buscarData(arraydata: any[], query: string, buscarpor: BuscarPor []) {
    let arraydatanew = arraydata.slice();
    query = query.toLowerCase();
    let newArray = arraydatanew.filter((dataarray) => {
      if (buscarpor.length == 1) {
        let dataanalisis = dataarray[buscarpor[0].data1!]
          ?.toString()
          .toLowerCase();
        return dataanalisis.includes(query);
      } else if (buscarpor.length == 2) {
        let dataanalisis1 = dataarray[buscarpor[0].data1!]
          ?.toString()
          .toLowerCase();
        let dataanalisis2 = dataarray[buscarpor[1].data2!]
          ?.toString()
          .toLowerCase();
        return dataanalisis1?.includes(query) || dataanalisis2?.includes(query);
      } else if (buscarpor.length == 3) {
        let dataanalisis1 = dataarray[buscarpor[0].data1!]
          ?.toString()
          .toLowerCase();
        let dataanalisis2 = dataarray[buscarpor[1].data2!]
          ?.toString()
          .toLowerCase();
        let dataanalisis3 = dataarray[buscarpor[2].data3!]
          ?.toString()
          .toLowerCase();
        return (
          dataanalisis1?.includes(query) ||
          dataanalisis2?.includes(query) ||
          dataanalisis3?.includes(query)
        );
      } else if (buscarpor.length == 4) {
        let dataanalisis1 = dataarray[buscarpor[0].data1!]
          ?.toString()
          .toLowerCase();
        let dataanalisis2 = dataarray[buscarpor[1].data2!]
          ?.toString()
          .toLowerCase();
        let dataanalisis3 = dataarray[buscarpor[2].data3!]
          ?.toString()
          .toLowerCase();
        let dataanalisis4 = dataarray[buscarpor[3].data4!]
          ?.toString()
          .toLowerCase();
        return (
          dataanalisis1?.includes(query) ||
          dataanalisis2?.includes(query) ||
          dataanalisis3?.includes(query) ||
          dataanalisis4?.includes(query)
        );
      }
    });
    /* this._arraydatasearch = newArray; */
    return newArray;
  }
  filterSeleccionadoList(
    arraydataabuscar: any[],
    filtroSelecOptionData: MetaFiltro
  ): any {
    /* Ordena arrayas de mayor a menor , pasandole una referencia un valor numerico */
    let arraydatanew = arraydataabuscar.slice();
    console.log(filtroSelecOptionData);
    if (filtroSelecOptionData.modoFiltro == MODO_FILTRO_ORDER_DES) {
      let filterarraydata = arraydatanew.sort((a, b) => {
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
      });
      return filterarraydata;
    }else if (filtroSelecOptionData.modoFiltro == MODO_FILTRO_ORDER_ASC) {
      let filterarraydata = arraydatanew.sort((a, b) => {
          return Number(a[filtroSelecOptionData.datoafiltrar!])  - Number(b[filtroSelecOptionData.datoafiltrar!])
      });

      return filterarraydata;
    } else if (filtroSelecOptionData.modoFiltro == MODO_FILTRO_DATOS_VARIOS) {
      if (
        filtroSelecOptionData.nombrecampoDB == null ||
        filtroSelecOptionData.datoafiltrar == null ||
        filtroSelecOptionData ==null
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
    console.log(arrayCheckboxSelec);
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
}

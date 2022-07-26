import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchBuscadorService {
  private _arraydatasearch: any[] = [];
  private _arraydatafilter: any[] = [];
  get getArraydataSearch() {
    return [...this._arraydatasearch];
  }
  get getArraydataFilter() {
    return [...this._arraydatafilter];
  }
  buscarData(arraydata: any[], query: string, buscarpor: any[]) {
    let arraydatanew = arraydata.slice();
    let newArray = arraydatanew.filter((dataarray) => {
      if (buscarpor.length == 1) {
        let dataanalisis= dataarray[buscarpor[0].data1]?.toString().toLowerCase()
        return dataanalisis.includes(query);
      } else if (buscarpor.length == 2) {
        let dataanalisis1= dataarray[buscarpor[0].data1]?.toString().toLowerCase()
        let dataanalisis2= dataarray[buscarpor[1].data2]?.toString().toLowerCase()
        return dataanalisis1?.includes(query) || dataanalisis2?.includes(query);
      } else if (buscarpor.length == 3) {
        let dataanalisis1= dataarray[buscarpor[0].data1]?.toString().toLowerCase()
        let dataanalisis2= dataarray[buscarpor[1].data2]?.toString().toLowerCase()
        let dataanalisis3= dataarray[buscarpor[2].data3]?.toString().toLowerCase()
        return (
          dataanalisis1?.includes(query) ||
          dataanalisis2?.includes(query) ||
          dataanalisis3?.includes(query)
        );
      } else if (buscarpor.length == 4) {
        let dataanalisis1= dataarray[buscarpor[0].data1]?.toString().toLowerCase()
        let dataanalisis2= dataarray[buscarpor[1].data2]?.toString().toLowerCase()
        let dataanalisis3= dataarray[buscarpor[2].data3]?.toString().toLowerCase()
        let dataanalisis4= dataarray[buscarpor[3].data4]?.toString().toLowerCase()
        return (
          dataanalisis1?.includes(query) ||
          dataanalisis2?.includes(query) ||
          dataanalisis3?.includes(query) ||
          dataanalisis4?.includes(query)
        );
      }
    });
    this._arraydatasearch = newArray;

  }
  filterArray(arraydata: any[], filtroSelecData: any, modoFiltro: string) {
    /* ordena arrayas de mayor a menor , pasandole una referencia un valor numerico */
    let arraydatanew = arraydata.slice();
    if (modoFiltro == 'number_ordenarmayoramenor') {
      let filterarraydata = arraydatanew.sort((a, b) => {
        if (
          Number(a[filtroSelecData.datoafiltrar]) >
          Number(b[filtroSelecData.datoafiltrar])
        ) {
          return -1;
        } else if (
          Number(a[filtroSelecData.datoafiltrar]) <
          Number(a[filtroSelecData.datoafiltrar])
        ) {
          return 1;
        } else {
          return 0;
        }
      });
      this._arraydatafilter = filterarraydata;
    } else if (modoFiltro == 'string_filtrodatosvarios') {
      /* filtra  segun el campo requerido, pasarle un string */
      if (filtroSelecData.nombrecampoDB=="" || filtroSelecData.datoafiltrar == '') {
         this._arraydatafilter = arraydatanew;
      }else{
        let query = filtroSelecData.datoafiltrar.toLowerCase();
        let newArray = arraydatanew.filter((dataarray) => {
          let dataanalisis =
            dataarray[filtroSelecData.nombrecampoDB]?.toLowerCase();
          return dataanalisis?.includes(query);
        });
        this._arraydatafilter = newArray;
        // /*  let query = filtroSelecData.datoafiltrar.toLowerCase(); */
        // let query: any[] = ['Sincelejo', 'Corozal'];
        // for (let index = 0; index < query.length; index++) {
        //   const element = query[index].toLowerCase();
        //   let newArray = arraydatanew.filter((dataarray) => {
        //     let dataanalisis = dataarray.municipio?.toLowerCase();
        //     return dataanalisis?.includes(element);
        //   });
        //   this._arraydatafilter = this._arraydatafilter.concat(newArray);
        //   console.log(this._arraydatafilter);
        // }
      }
    }
  }
}

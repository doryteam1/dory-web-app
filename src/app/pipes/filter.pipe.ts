import { Pipe, PipeTransform, Injectable } from "@angular/core";
/* https://github.com/solodynamo/ng2-search-filter/tree/master/src */
@Pipe({
  name: 'filter',
  pure: false,
})
@Injectable()
export class FilterPipe implements PipeTransform {
  /**
   * @param items objetos del array
   * @param term termino de busqueda (culaquier letra o palabra)
   * @param includeList matriz de cadenas que se filtrara durante la búsqueda,ejemplo:se filtrara, por titulo,descripcion (key en el objeto)
   */
  transform(
    items: Array<{ [key: string]: any }>,
    term: string,
    includeList: any[] = []
  ):any {
    if (!term || !items) return items;
    const toCompare = term.toLowerCase();
    return items.filter((item: any) =>
      this.checkInside(item, term, includeList, toCompare)
    );
  }

  checkInside(item: any, term: string, includeList: any, toCompare: string) {
    if (
      typeof item === 'string' &&
      item.toString().toLowerCase().includes(toCompare)
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
      } else if (item[property].toString().toLowerCase().includes(toCompare)) {
        return true;
      }
    }
    return false;
  }

}






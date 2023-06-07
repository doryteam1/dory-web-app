import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');
export class Utilities {
  static dateTimeNow(): string {
    let today = new Date();
    return (
      today.toISOString().substring(0, 10) +
      today.getDay() +
      ' ' +
      today.getHours() +
      '-' +
      today.getMinutes() +
      '-' +
      today.getSeconds()
    );
  }

  static dateNow(): string {
    let today = new Date();
    return (
      today.getFullYear().toString() +
      '-' +
      today.getMonth().toString() +
      '-' +
      today.getDate().toString()
    );
  }

  static dateToISOString(date: string) {
    return new Date(date).toISOString().substring(0, 10);
  }

  static parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  /*retorna un string indicando cuanto tiempo ha pasado desde la fecha date hasta el tiempo presente*/
  static dateFromX(date: string) {
    return dayjs(date).fromNow(true);
  }

  static isMinor(a: dayjs.Dayjs, b: dayjs.Dayjs) {
    if (a.year() < b.year()) {
      return true;
    } else if (a.year() == b.year() && a.month() < b.month()) {
      return true;
    } else {
      return false;
    }
  }

  //0 - 11 Enero - Febrero
  static getMonthName(monthNumber: number) {
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return monthNames[monthNumber];
  }

 static getNomApell(nombres: string, apellidos: string) {
    let nomComp: string = '';
    if (nombres) {
      nomComp = nombres.split(' ')[0];
    }
    if (apellidos) {
      nomComp = nomComp + ' ' + apellidos.split(' ')[0];
    }
    return nomComp;
  }

}

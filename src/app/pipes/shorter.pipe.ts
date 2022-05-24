import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorter'
})
export class ShorterPipe implements PipeTransform {

  transform(value: string, ...args: number[]): unknown {
    return value.substring(0,args[0]) + (value.length > args[0] ? '...' : '');
  }

}

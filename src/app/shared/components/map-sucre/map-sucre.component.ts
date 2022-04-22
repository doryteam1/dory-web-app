import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-map-sucre',
  templateUrl: './map-sucre.component.html',
  styleUrls: ['./map-sucre.component.scss']
})
export class MapSucreComponent implements OnInit {
  @Output() munClick:EventEmitter<number> = new EventEmitter();
  @Output() munOver:EventEmitter<number> = new EventEmitter();

  @Input() munData:any = {
    nombre:"Not Selected",
    poblacion:0,
    count:0
  }

  @Input() labelTooltip:string = '';
  
  constructor() { }

  ngOnInit(): void {
  }

  munSelected(num:number){
    this.munClick.emit(num);
  }

  mouseOver(num:number){
    this.munOver.emit(num);
  }

}

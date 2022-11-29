import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import * as SvgPanZoom from 'svg-pan-zoom';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-map-sucre',
  templateUrl: './map-sucre.component.html',
  styleUrls: ['./map-sucre.component.scss'],
})
export class MapSucreComponent implements OnInit {
  @Output() munClick: EventEmitter<number> = new EventEmitter();
  @Output() munOver: EventEmitter<number> = new EventEmitter();
  @Input() idMapa: any = 'idMapa';
  @Input() zoom: boolean = false;
  @ViewChild('svgelemento ') svgelemento!: ElementRef<HTMLElement>;
  @Input() munData: any = {
    nombre: 'Not Selected',
    poblacion: 0,
    count: 0,
  };

  @Input() labelTooltip: string = '';
  svgPanZoom!: SvgPanZoom.Instance;
  zoomMapa: boolean = false;
  activeClass: boolean = false;
  zoomInActive:boolean=false
  constructor(/* private renderer: Renderer2 */) {}

  ngOnInit(): void {}
  munSelected(num: number) {
    this.munClick.emit(num);
  }
  mouseOver(num: number) {
    this.munOver.emit(num);
  }
}

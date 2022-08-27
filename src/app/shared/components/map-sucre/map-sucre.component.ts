import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Input() munData: any = {
    nombre: 'Not Selected',
    poblacion: 0,
    count: 0,
  };

  @Input() labelTooltip: string = '';
  svgPanZoom!: SvgPanZoom.Instance;
  constructor() {}

  ngOnInit(): void {}
  ngAfterViewInit0() {
    var eventsHandler;
    /*    var svgActive = false,
        svgHovered = false; */
    eventsHandler = {
      haltEventListeners: [
        'touchstart',
        'touchend',
        'touchmove',
        'touchleave',
        'touchcancel',
      ],
      init: function (options: {
        instance: any;
        svgElement: HTMLElement | SVGElement;
      }) {
        var instance = options.instance,
          initialScale = 1,
          pannedX = 0,
          pannedY = 0;
        // Init Hammer
        // Listen only for pointer and touch events
        this.hammer = new Hammer(options.svgElement, {
          inputClass: Hammer.TouchMouseInput
            ? Hammer.PointerEventInput
            : Hammer.TouchInput,
        });

        // Enable pinch
        this.hammer.get('pinch').set({ enable: true });

        // Handle double tap
        this.hammer.on('doubletap', function (ev: any) {
          instance.zoomIn();
          instance;
        });

        // Handle pan
        this.hammer.on('panstart panmove', function (ev: any) {
          // On pan start reset panned variables
          if (ev.type === 'panstart') {
            pannedX = 0;
            pannedY = 0;
          }

          // Pan only the difference
          instance.panBy({
            x: ev.deltaX - pannedX,
            y: ev.deltaY - pannedY,
          });
          pannedX = ev.deltaX;
          pannedY = ev.deltaY;
        });

        // Handle pinch
        this.hammer.on('pinchstart pinchmove', function (ev: any) {
          // On pinch start remember initial zoom
          if (ev.type === 'pinchstart') {
            initialScale = instance.getZoom();
            instance.zoomAtPoint(initialScale * ev.scale, {
              x: ev.center.x,
              y: ev.center.y,
            });
          }

          instance.zoomAtPoint(initialScale * ev.scale, {
            x: ev.center.x,
            y: ev.center.y,
          });
        });

        // Prevent moving the page on some devices when panning over SVG
        options.svgElement.addEventListener('touchmove', function (e: any) {
          e.preventDefault();
        });
        /*        function updateSvgClassName() {
          options.svgElement.setAttribute(
            'class',
            '' + (svgActive ? 'active' : '') + (svgHovered ? ' hovered' : '')
          );
        } */

        /*  this.listeners = {
          click: function () {
            if (svgActive) {
              options.instance.disableZoom();
              svgActive = false;
            } else {
              options.instance.enableZoom();
              svgActive = true;
            }

            updateSvgClassName();
          },
          mouseenter: function () {
            svgHovered = true;

            updateSvgClassName();
          },
          mouseleave: function () {
            svgActive = false;
            svgHovered = false;
            options.instance.disableZoom();

            updateSvgClassName();
          },
        }; */

        /*    this.listeners.mousemove = this.listeners.mouseenter;

        for (var eventName in this.listeners) {
          options.svgElement.addEventListener(
            eventName,
            this.listeners[eventName]
          );
        } */
      },
      destroy: function (options: any) {
        this.hammer.destroy();
        /*      for (var eventName in this.listeners) {
          options.svgElement.removeEventListener(
            eventName,
            this.listeners[eventName]
          );
        } */
      },
    };

    // initializing the function

    this.svgPanZoom = SvgPanZoom(`#${this.idMapa}`, {
      zoomEnabled: false,
      controlIconsEnabled: false,
      fit: true,
      center: true,
      customEventsHandler: eventsHandler,

    });
  }

  activarZoom() {
    this.ngAfterViewInit0()
    /*     if (this.svgPanZoom.isZoomEnabled()) {
      this.svgPanZoom.disableZoom();
    } else {
      this.svgPanZoom.enableZoom();
    } */
    /*    this.svgPanZoom.zoomIn()
    this.svgPanZoom.zoomIn() */
    /* this.svgPanZoom.reset() */
  }
  zoomMas(){
  this.svgPanZoom.zoomIn();
  }
  zooMenos(){
this.svgPanZoom.zoomOut();
  }
  resetZoom(){
this.svgPanZoom.reset();
  }
  desaptivaZoom() {
    this.svgPanZoom.destroy();
    /* this.svgPanZoom.disableControlIcons();
    this.svgPanZoom.disableMouseWheelZoom();
    this.svgPanZoom.disableDblClickZoom();
    this.svgPanZoom.disablePan();
    this.svgPanZoom.disableZoom(); */
  }
  zoomLupa() {}
  munSelected(num: number) {
    console.log(num);
    this.munClick.emit(num);
  }

  mouseOver(num: number) {
    this.munOver.emit(num);
  }
}

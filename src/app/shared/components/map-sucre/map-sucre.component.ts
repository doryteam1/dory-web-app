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
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}
  activarZoomMapa() {
    this.zoomMapa = true;
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
      },
      destroy: function () {
        this.hammer.destroy();
      },
    };

    // initializing the function

    this.svgPanZoom = SvgPanZoom(`#${this.idMapa}`, {
      viewportSelector: '.svg-pan-zoom_viewport',
      zoomEnabled: true,
      controlIconsEnabled: false,
      fit: true,
      center: true,
      minZoom: 1,
      customEventsHandler: eventsHandler,
      beforePan: this.beforePan,
    });
  }
  beforePan = (oldPan: any, newPan: { x: number; y: number }) => {
    var stopHorizontal = false,
      stopVertical = false,
      gutterWidth = 200,
      gutterHeight = 200,
      // Computed variables
      sizes: any = this.svgPanZoom.getSizes(),
      leftLimit =
        -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) +
        gutterWidth,
      rightLimit = sizes.width - gutterWidth - sizes.viewBox.x * sizes.realZoom,
      topLimit =
        -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) +
        gutterHeight,
      bottomLimit =
        sizes.height - gutterHeight - sizes.viewBox.y * sizes.realZoom;
    var customPan = {
      x: Math.max(leftLimit, Math.min(rightLimit, newPan.x)),
      y: Math.max(topLimit, Math.min(bottomLimit, newPan.y)),
    };
    return customPan;
  };
  zoomIn() {
    /* Aumentar zoom */
    this.zoomInActive=true
    if (this.zoomMapa) {
      this.svgPanZoom.zoomIn();
    } else if (!this.zoomMapa) {
      this.activeClass = false;
      this.activarZoomMapa();
    }
  }
  zooOut() {
    /* Disminuir zoom */
    if (this.zoomInActive) {
      this.svgPanZoom.zoomOut();
    }
  }
  resetZoom() {
    /* Reiniciar el zoom y configuración */
    if (this.zoomMapa) {
      this.svgPanZoom.resize();
      this.svgPanZoom.fit();
      this.svgPanZoom.center();
      this.svgPanZoom.destroy();
      this.renderer.setAttribute(
        this.svgelemento.nativeElement,
        'viewBox',
        '0 0 774 1234'
      );
      this.activeClass = true;
      this.zoomMapa = false;
      this.zoomInActive=false
      this.svgelemento.nativeElement.removeAllListeners!('touchmove');
    }
  }
  munSelected(num: number) {
    this.munClick.emit(num);
  }
  mouseOver(num: number) {
    this.munOver.emit(num);
  }
}

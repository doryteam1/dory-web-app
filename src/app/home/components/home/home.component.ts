import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DashboardInicioService } from 'src/app/services/dashboard-inicio.service';
import { EnlacesDirectosInicioService } from 'src/app/services/enlaces-directos-inicio.service';
import { SliderInicioService } from 'src/app/services/slider-inicio.service';
declare var window: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit{
  isDragging: boolean = false;
  eventOwlCarousel: any[] = [];
  customOptions: OwlOptions = {
    autoWidth: true,
    mouseDrag: true,
    touchDrag: true,
    loop: true,
    nav: true,
    center: true,
    dots: false,
    margin: 120,
    navText: [
      "<i class='bi bi-chevron-left'></i>",
      "<i class='bi bi-chevron-right'></i>",
    ],

    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
  };
  sliderCard: any[] = [
    {
      src: 'assets/icons/gps.svg',
      title: 'Geolocalización',
      informacion:
        'Desde esta sección tendrás acceso a información privilegiada del sector piscícola',
      url: '/geolocalizacion',
      id: '1',
    },
    {
      src: 'assets/icons/shop-window.svg',
      title: 'Plaza de mercado',
      informacion:
        'Desde esta sección podrá encontrar distintos tipos de peces para la venta.',
      url: '/publicaciones',
      id: '2',
    },
    {
      src: 'assets/icons/icon_forum.svg',
      title: 'Foro de inquietudes',
      informacion:
        'Desde esta sección te ayudarán a solucionar dudas referente al sector piscícola.',
      url: '/foro',
      id: '3',
    },
  ];
  /*  */
  datosCounter = [
    { title: 'Granjas', img: 'assets/icons/granja-icon-home.svg', cantidad: 0 },
    {
      title: 'Asociaciones',
      img: 'assets/icons/asociacio-icon-home.svg',
      cantidad: 0,
    },
    {
      title: 'Pescadores',
      img: 'assets/icons/pescador-icon-home.svg',
      cantidad: 0,
    },
    {
      title: 'Piscicultores',
      img: 'assets/icons/piscicul-icon-home.svg',
      cantidad: 0,
    },
    { title: 'Usuarios', img: 'assets/icons/group-circle.svg', cantidad: 0 },
  ];

  enlaceRapido: any[] = [];

  sliders: any[] = [
    {
      url_imagen:
        'https://firebasestorage.googleapis.com/v0/b/dory-qa-83409.appspot.com/o/foto-defecto-slaider%2Ffoto1.jpg?alt=media&token=718f0ffd-e756-4c13-9a41-4148f91db140',
      titulo: '',
      url_enlace: '/home',
      mostrar_titulo: 0,
    },
    {
      url_imagen:
        'https://firebasestorage.googleapis.com/v0/b/dory-qa-83409.appspot.com/o/foto-defecto-slaider%2Ffoto4.jpg?alt=media&token=d5b2cefb-bef7-4abc-80f6-31a54c74b19c',
      titulo: '',
      url_enlace: '/home',
      mostrar_titulo: 0,
    },
    {
      url_imagen:
        'https://firebasestorage.googleapis.com/v0/b/dory-qa-83409.appspot.com/o/foto-defecto-slaider%2Ffoto3.jpg?alt=media&token=01f61f58-29f6-442e-bd79-eb81867fe747',
      titulo: '',
      url_enlace: '/home',
      mostrar_titulo: 0,
    },
  ];
  tiempoSlide: number = 0;
  loadingSlider = true;
  electronActive: any = window.require; //verificar la disponibilidad, solo esta disponible en electronJS;

  novedades: Array<any> = [
    {
      title: 'Artículos',
      route: '/novedades/articulos',
    },
    {
      title: 'Artículos Colombianos',
      route: '/novedades/articulos-colombia',
    },
    {
      title: 'Revistas',
      route: '/novedades/revistas',
    },
    {
      title: 'Noticias',
      route: '/novedades/noticias',
    },
  ];

  eventos: Array<any> = [
    {
      title: 'Cursos',
      route: '/eventos/cursos',
    },
    {
      title: 'Capacitaciones',
      route: '/eventos/capacitaciones',
    },
    {
      title: 'Congresos',
      route: '/eventos/congresos',
    },
  ];

  normatividades: Array<any> = [
    {
      title: 'Leyes',
      route: '/normatividad/leyes',
    },
    {
      title: 'Decretos',
      route: '/normatividad/decretos',
    },
    {
      title: 'Resoluciones',
      route: '/normatividad/resoluciones',
    },
  ];

  urlLinkCardImgNovedades: string =
    'https://images.pexels.com/photos/242492/pexels-photo-242492.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  urlLinkCardImgEventos: string =
    'https://images.pexels.com/photos/4443160/pexels-photo-4443160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  urlLinkCardImgNormativas: string =
    'https://images.pexels.com/photos/48148/document-agreement-documents-sign-48148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  sliderRef: any;
  constructor(
    private sliderInicioService: SliderInicioService,
    private enlacesDirectosInicioService: EnlacesDirectosInicioService,
    private router: Router,
    private dashboardInicioService: DashboardInicioService
  ) {}
  sliderImgRet() {
    let ride = this.tiempoSlide > 0 ? 'carousel' : false;
    let interval = this.tiempoSlide > 0 ? this.tiempoSlide : false;
    this.sliderRef = new window.bootstrap.Carousel(
      document.getElementById('carouselExampleCaptions'),
      {
        ride:ride,
        interval: interval,
      }
    );
   this.loadingSlider = false;
  }

  ngOnInit() {
    this.servicesDataLength();
    this.cargaServiceSlaider();
    this.cargaServiceEnlacesDirc();
  }

  servicesDataLength() {
    this.dashboardInicioService.getDatosLenght().subscribe((response: any) => {
      let datos = Object.values(response.data);
      for (let index = 0; index < datos.length; index++) {
        const element: any = datos[index];
        this.datosCounter[index].cantidad = element;
      }
    });
  }

  async cargaServiceSlaider() {
    try {
      let response = await this.sliderInicioService.getSliders().toPromise();
      if (response.data.slider.length > 0) {
        this.sliders = response.data.slider;
        this.tiempoSlide = response.data.tiempo;
      }
    } catch (error) {
      console.log(error);
    } finally{
      this.sliderImgRet()
    }
  }

  cargaServiceEnlacesDirc() {
    this.enlacesDirectosInicioService.getTodos().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.enlaceRapido = response.data;
        }
      },
      (err) => {}
    );
  }
  /* Funciones slaider */

  clisFotoSlide(url: string) {
    if (url != '') {
      window.open(url, '_blank');
    }
  }

  clisEnlaceDirect(event: any) {
    let url = event.url_enlace;
    window.open(url, '_blank');
  }
  navigate(ruta: any) {
    this.router.navigateByUrl(`${ruta}`);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
       this.nextImgGallery();
    } else if (event.key === 'ArrowLeft') {
      this.prevImgGallery();
    }
  }

  nextImgGallery() {
    this.sliderRef?.next();
  }
  prevImgGallery() {
    this.sliderRef?.prev();
  }
  navigateSliderCard(ruta: any, id: string) {
    /*  let idx = this.eventOwlCarousel.findIndex(
      (element: any) => element.center == true && element.id === id
    );
    if (idx != -1 && !this.isDragging) { */
    this.router.navigateByUrl(`${ruta}`);
    /*   } */
  }
  /*  sliderCardEvent(evento: any) {
    this.eventOwlCarousel = evento;
  } */
}

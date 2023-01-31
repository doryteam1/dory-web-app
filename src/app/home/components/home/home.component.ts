import {
  Component,
  OnInit,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { Gallery, GalleryRef } from 'ng-gallery';
import { DashboardInicioService } from 'src/app/services/dashboard-inicio.service';
import { EnlacesDirectosInicioService } from 'src/app/services/enlaces-directos-inicio.service';
import { SliderInicioService } from 'src/app/services/slider-inicio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
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

  imagenes: any[] = [
    {
      url_imagen:
        'https://firebasestorage.googleapis.com/v0/b/dory-qa-83409.appspot.com/o/foto-defecto-slaider%2Ffoto1.jpg?alt=media&token=718f0ffd-e756-4c13-9a41-4148f91db140',
      titulo: '',
      url_enlace: '',
    },
    {
      url_imagen:
        'https://firebasestorage.googleapis.com/v0/b/dory-qa-83409.appspot.com/o/foto-defecto-slaider%2Ffoto4.jpg?alt=media&token=d5b2cefb-bef7-4abc-80f6-31a54c74b19c',
      titulo: '',
      url_enlace: '',
    },
    {
      url_imagen:
        'https://firebasestorage.googleapis.com/v0/b/dory-qa-83409.appspot.com/o/foto-defecto-slaider%2Ffoto3.jpg?alt=media&token=01f61f58-29f6-442e-bd79-eb81867fe747',
      titulo: '',
      url_enlace: '',
    },
  ];
  lightboxRef!: GalleryRef;
  sliders: any[] = [];
  tiempoSlide: any = 0;
  electronActive: any = window.require; //verificar la disponibilidad, solo esta disponible en electronJS;

  novedades:Array<any> = [
    {
      title:'Artículos',
      route:'/novedades/articulos'
    },
    {
      title:'Artículos Colombianos',
      route:'/novedades/articulos-colombia'
    },
    {
      title:'Revistas',
      route:'/novedades/revistas'
    },
    {
      title:'Noticias',
      route:'/novedades/noticias'
    }
  ]

  eventos:Array<any> = [
    {
      title:'Cursos',
      route:'/eventos/cursos'
    },
    {
      title:'Capacitaciones',
      route:'/eventos/capacitaciones'
    },
    {
      title:'Congresos',
      route:'/eventos/congresos'
    }
  ]

  normatividades:Array<any> = [
    {
      title:'Leyes',
      route:'/normatividad/leyes'
    },
    {
      title:'Decretos',
      route:'/normatividad/decretos'
    },
    {
      title:'Resoluciones',
      route:'/normatividad/resoluciones'
    }
  ]
  constructor(
    public gallery: Gallery,
    private sliderInicioService: SliderInicioService,
    private enlacesDirectosInicioService: EnlacesDirectosInicioService,
    private router: Router,
    private dashboardInicioService: DashboardInicioService
  ) {}
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
  cargaServiceSlaider() {
    this.sliderInicioService.getSliders().subscribe(
      (response) => {
        if (response.data.slider.length > 0) {
          this.sliders = response.data.slider;
          this.tiempoSlide = response.data.tiempo;
          this.openSlaider(response.data.slider);
        } else {
          this.tiempoSlide = 6000;
          this.openSlaider(this.imagenes);
        }
      },
      (err) => {
        console.log(err);
      }
    );
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
  openSlaider(slaid: any) {
    let imageData: any[] = [];
    this.lightboxRef = this.gallery.ref('homegallery');
    slaid.forEach((element: any) => {
      imageData.push({
        srcUrl: element.url_imagen,
        previewUrl: element.url_imagen,
        title: element.titulo,
        mostrar_titulo: element.mostrar_titulo,
      });
    });
    for (let index = 0; index < imageData.length; index++) {
      const element = imageData[index];
      this.lightboxRef.addImage({
        src: element.srcUrl,
        thumb: element.previewUrl,
        title: element.title,
        mostrar_titulo: element.mostrar_titulo,
      });
    }
  }
  clisFotoSlide(event: any) {
    if (this.sliders[event]?.url_enlace) {
      let url = this.sliders[event]?.url_enlace;
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
      this.lightboxRef?.next();
    } else if (event.key === 'ArrowLeft') {
      this.lightboxRef?.prev();
    }
  }
  stopGalerry() {
    this.lightboxRef?.stop();
  }
  playGalery() {
    this.lightboxRef?.play();
  }
  nextImgGallery() {
    this.lightboxRef?.next();
  }
  prevImgGallery() {
    this.lightboxRef?.prev();
  }
}

import {
  Component,
  OnInit,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { Gallery, GalleryRef } from 'ng-gallery';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';
import { EnlacesDirectosInicioService } from 'src/app/services/enlaces-directos-inicio.service';
import { SliderInicioService } from 'src/app/services/slider-inicio.service';
import { UsuarioService } from 'src/app/services/usuario.service';
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
  constructor(
    public gallery: Gallery,
    private pescadoresService: PescadoresService,
    private piscicultoresService: PiscicultoresService,
    private granjasService: GranjasService,
    private asociacionService: AsociacionesService,
    private usuarioService: UsuarioService,
    private sliderInicioService: SliderInicioService,
    private enlacesDirectosInicioService: EnlacesDirectosInicioService,
    private router: Router
  ) {}
  ngOnInit() {
    this.servicesDataLength();
    this.cargaServiceSlaider();
    this.cargaServiceEnlacesDirc();
  }
  servicesDataLength() {
    this.granjasService.getGranjas().subscribe((response: any) => {
      this.datosCounter[0].cantidad = response.data.length;
    });
    this.asociacionService.getAsociacionesTodas().subscribe((response) => {
      this.datosCounter[1].cantidad = response.data.length;
    });
    this.pescadoresService.getPescadores().subscribe((response: any) => {
      this.datosCounter[2].cantidad = response.data.length;
    });
    this.piscicultoresService.getPiscicultores().subscribe((response: any) => {
      this.datosCounter[3].cantidad = response.data.length;
    });
    this.usuarioService.getTodosUsuarioAll().subscribe((response: any) => {
      this.datosCounter[4].cantidad = response.data.length;
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
      });
    });
    for (let index = 0; index < imageData.length; index++) {
      const element = imageData[index];
      this.lightboxRef.addImage({
        src: element.srcUrl,
        thumb: element.previewUrl,
        title: element.title,
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
    let url = '';
    url = this.router.serializeUrl(this.router.createUrlTree([ruta]));
    window.open(url, '_blank');
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

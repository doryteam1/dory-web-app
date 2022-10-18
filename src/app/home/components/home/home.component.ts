import {
  Component,
  OnInit,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { Gallery, GalleryRef } from 'ng-gallery';
import { Observable } from 'rxjs';
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

  enlaceRapido:any []= [];

  imagenes: any[] = [
    {
      url_imagen:
        'https://img.lalr.co/cms/2015/07/09125916/peces0215-612.jpg?size=sm',
      titulo: '',
      url_enlace: '/panel-busqueda/productos',
    },
    {
      url_imagen:
        'https://www.boyaca.gov.co/wp-content/uploads/2016/09/images_Noticias2016_Septiembre2_pescado74748.jpg',
      titulo: '',
      url_enlace: '/panel-busqueda/vehiculos',
    },
  ];
  lightboxRef!: GalleryRef;
  setInterval: any;
  percent: number = 0;
  contador: number = 0;
  sliders: any[] = [];
  constructor(
    public gallery: Gallery,
    private pescadoresService: PescadoresService,
    private piscicultoresService: PiscicultoresService,
    private granjasService: GranjasService,
    private asociacionService: AsociacionesService,
    private usuarioService: UsuarioService,
    private sliderInicioService: SliderInicioService,
    private enlacesDirectosInicioService: EnlacesDirectosInicioService
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
        if (response.data.length > 0) {
          this.sliders = response.data;
          this.openSlaider(response.data);
        }else{
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
    let url = this.sliders[event].url_enlace;
    window.open(url, '_blank');
  }
  clisEnlaceDirect(event: any) {
    let url = event.url_enlace;
    window.open(url, '_blank');
  }
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    /* console.log(event); */
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

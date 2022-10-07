import {
  Component,
  OnInit,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { Gallery, GalleryRef } from 'ng-gallery';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  array = [
    {
      img: 'https://static8.depositphotos.com/1302629/980/i/450/depositphotos_9806860-stock-photo-fish-farm.jpg',
      title: 'title1',
    },
    {
      img: 'https://static8.depositphotos.com/1302629/980/i/450/depositphotos_9806860-stock-photo-fish-farm.jpg',
      title: 'title2',
    },
    {
      img: 'https://static8.depositphotos.com/1302629/980/i/450/depositphotos_9806860-stock-photo-fish-farm.jpg',
      title: 'title3',
    },
    {
      img: 'https://static8.depositphotos.com/1302629/980/i/450/depositphotos_9806860-stock-photo-fish-farm.jpg',
      title: 'title4',
    },
    {
      img: 'https://static8.depositphotos.com/1302629/980/i/450/depositphotos_9806860-stock-photo-fish-farm.jpg',
      title: 'title5',
    },
    {
      img: 'https://static8.depositphotos.com/1302629/980/i/450/depositphotos_9806860-stock-photo-fish-farm.jpg',
      title: 'title6',
    },
  ];
  array2 = [
    {
      img: 'https://static8.depositphotos.com/1302629/980/i/450/depositphotos_9806860-stock-photo-fish-farm.jpg',
      title: 'Granjas',
      ruta: '/granjas',
    },
    {
      img: 'https://st4.depositphotos.com/1192060/21812/i/600/depositphotos_218124688-stock-photo-hatchery-worker-netting-kokanee-salmon.jpg',
      title: 'Piscicultores',
      ruta: '/piscicultores',
    },
    {
      img: 'https://st3.depositphotos.com/1192060/14569/i/600/depositphotos_145692603-stock-photo-man-fixing-the-buoy.jpg',
      title: 'Pescadores',
      ruta: '/pescadores',
    },
    {
      img: 'https://tierragrata.org/wp-content/uploads/2020/09/IMG_5486-2-1.jpg',
      title: 'Asociaciones',
      ruta: '/asociaciones',
    },
    {
      img: 'https://img.lalr.co/cms/2015/07/09125916/peces0215-612.jpg?size=sm',
      title: 'Productos',
      ruta: '/panel-busqueda/productos',
    },
    {
      img: 'https://www.boyaca.gov.co/wp-content/uploads/2016/09/images_Noticias2016_Septiembre2_pescado74748.jpg',
      title: 'Vehículos',
      ruta: '/panel-busqueda/vehiculos',
    },
  ];
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  imagenes: any[] = this.array;
  imageData: any[] = [];
  lightboxRef!: GalleryRef;
  setInterval: any;
  percent: number = 0;
  contador: number = 0;
  constructor(public gallery: Gallery, private router: Router) {}
  ngOnInit() {
    /* this.timePlayGallery(); */
    this.lightboxRef = this.gallery.ref('homegallery');
    this.imagenes.forEach((element: any) => {
      this.imageData.push({
        srcUrl: element.img,
        previewUrl: element.img,
        title: element.title,
      });
    });

    for (let index = 0; index < this.imageData.length; index++) {
      const element = this.imageData[index];
      this.lightboxRef.addImage({
        src: element.srcUrl,
        thumb: element.previewUrl,
        title: element.title,
      });
    }
  }
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    /* console.log(event); */
    if (event.key === 'ArrowRight') {
      this.lightboxRef.next();
    } else if (event.key === 'ArrowLeft') {
      this.lightboxRef.prev();
    }
  }
  stopGalerry() {
    this.lightboxRef.stop();
  }
  playGalery() {
    this.lightboxRef.play();
  }
  nextImgGallery() {
    this.lightboxRef.next();
  }
  prevImgGallery() {
    this.lightboxRef.prev();
  }
  navigate(ruta: any) {
    console.log(ruta)
    let url = '';
    url = this.router.serializeUrl(this.router.createUrlTree([ruta]));
    window.open(url, '_blank');
  }
}

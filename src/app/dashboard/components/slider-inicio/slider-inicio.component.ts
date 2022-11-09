import { PlatformLocation, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { Gallery,  GalleryItem, GalleryRef, ImageItem } from 'ng-gallery';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SliderInicioService } from 'src/app/services/slider-inicio.service';
 interface slide {
   id_slid?: number;
   url_imagen: string;
   url_enlace: string;
   titulo: string;
   time?: any;
 }

@Component({
  selector: 'app-slider-inicio',
  templateUrl: './slider-inicio.component.html',
  styleUrls: ['./slider-inicio.component.scss'],
})
export class SliderInicioComponent implements OnInit {
  form: FormGroup = new FormGroup({
    time: new FormControl(''),
  });
  modalMode: any = 'visualice';
  loading = false;
  tiempoSlide: any = 0;
  sliders: slide[] = [];
  showError: boolean = false;
  showNotFound: boolean = false;
  authUserId: number = -1;
  lightboxRef!: GalleryRef;
  items: GalleryItem[] = [];
  imagenes: any[] = [];
  sliderActive: boolean = false;
  constructor(
    private sliderInicioService: SliderInicioService,
    private storage: FirebaseStorageService,
    public platformLocation: PlatformLocation,
    private appModalService: AppModalService,
    private router: Router,
    public gallery: Gallery
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.cargaService();
  }
  cargaService() {
     this.imagenes= [];
     this.sliders=[],
     this.items=[]
     this.loading = false;
      this.showError = false;
      this.showNotFound= false;
    this.sliderInicioService.getSliders().subscribe(
      (response) => {
          if (response.data.slider.length > 0) {
            this.tiempoSlide = response.data.tiempo
            for (let index = 0; index < response.data.slider.length; index++) {
              const foto: slide = response.data.slider[index];
              this.imagenes.push(foto.url_imagen);
            }
            if (this.imagenes.length > 0) {
              this.sliders = response.data.slider;
              console.log(this.sliders);
              this.cargarFuntionSlider(this.imagenes);
            }
            this.showError = false;
            this.showNotFound = false;
          } else {
            this.showNotFound = true;
            this.showError = false;
          }

      },
      (err) => {
        console.log(err);
        if (err.status == 404) {
          this.showNotFound = true;
           this.showError = false;
        }else{
         this.showNotFound = false;
          this.showError = true;
        }
      }
    );
  }

  deleteNovedad(id: any, nombre: any, imagen: any, idx: any) {
    this.appModalService
      .confirm(
        'Eliminar slide',
        'Esta seguro que desea eliminar este slide',
        'Si',
        'No',
        nombre
      )
      .then((result) => {
        if (result == true) {
          this.sliderInicioService.deleteSlide(id).subscribe(
            (response) => {
              this.sliders.splice(idx, 1);
              this.storage.deleteByUrl(imagen);
              if (this.imagenes.length > 0) {
                this.imagenes.splice(idx, 1);
                this.lightboxRef.remove(idx);
              }
              if (this.imagenes.length <= 0) {
                this.sliderActive = false;
              }
              if (this.sliders.length <= 0) {
                this.items = [];
                this.sliderActive = false;
                this.showNotFound = true;
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      })
      .catch((result) => {});
  }
  editarData(idNovedad: any) {
    let object: any = {
      id: idNovedad,
      action: 'update',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/slider-inicio-admi/detalle', object]);
  }
  openFormCrear() {
    let object = {
      action: 'create',
      authUserId: this.authUserId,
    };
    this.router.navigate(['/dashboard/slider-inicio-admi/detalle', object]);
  }
  /*Funciones slider */
  cargarFuntionSlider(imagenes: any[]) {
    let imageData: any = [];
    this.sliderActive = true;
    this.lightboxRef = this.gallery.ref('homegallery');
    imagenes.forEach((element: any) => {
      imageData.push({
        srcUrl: element,
        previewUrl: element,
      });
    });
    this.items = imageData.map(
      (item: any) => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl })
    );
  }
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
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
  clisFotoSlide(event: any) {
    let url = this.sliders[event].url_enlace;
    window.open(url, '_blank');
  }
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  cancelingEdition() {
    this.modalMode = 'visualice';
    if ((this.modalMode = 'visualice')) {
      this.lightboxRef.reset()
      this.cargaService();
    }
  }
  updateData() {
    this.loading = true;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    this.form.disable();
    this.sliderInicioService
      .updateTiempoSlaid(this.time?.value * 1000)
      .subscribe(
        (response) => {
          this.loading = false;
          this.form.enable();
          this.cancelingEdition();
        },
        (err) => {
          this.loading = false;
          this.form.enable();
          console.log(err);
        }
      );
  }

  EditionTime() {
    this.modalMode = 'update';
    if (this.modalMode == 'update') {
      this.time?.setValue(this.tiempoSlide / 1000);
    }
  }
  get time() {
    return this.form.get('time');
  }
}

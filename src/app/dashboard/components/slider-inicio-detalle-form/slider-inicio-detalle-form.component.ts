import { PlatformLocation, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { SliderInicioService } from 'src/app/services/slider-inicio.service';

 interface slide {
   id_slid?: number;
   url_imagen: string;
   url_enlace: string;
   titulo: string;
 }
@Component({
  selector: 'app-slider-inicio-detalle-form',
  templateUrl: './slider-inicio-detalle-form.component.html',
  styleUrls: ['./slider-inicio-detalle-form.component.scss'],
})
export class SliderInicioDetalleFormComponent implements OnInit {
  @ViewChild('fileInputCreate') inputFileDialogCreate!: ElementRef;
  form: FormGroup = new FormGroup({
    titulo: new FormControl(''),
    url_enlace: new FormControl('', [Validators.required]),
  });
  loading: boolean = false;
  modalMode: string = 'visualize';
  fotoSlide: any;
  fotoSlideFinal: any[] = [];
  fotoAmandar: string = '';
  file: any = null;
  slide!: slide;
  sinFoto:boolean=false
  id_slide: number = -1;
  constructor(
    private storage: FirebaseStorageService,
    public platformLocation: PlatformLocation,
    private compressImageSizeService: CompressImageSizeService,
    private sanitizer: DomSanitizer,
    private ar: ActivatedRoute,
    private sliderInicioService: SliderInicioService
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    let idslide = Number(this.ar.snapshot.paramMap.get('id'));
    this.modalMode = this.ar.snapshot.paramMap.get('action')!;
    if (this.modalMode == 'update') {
      this.sliderInicioService.getSliders().subscribe(
        (response) => {
          if (response.data.slider.length > 0) {
            let index = response.data.slider.findIndex(
              (slide: slide) => slide.id_slid == idslide
            );
            this.slide = response.data.slider[index];
            this.id_slide = this.slide?.id_slid!;
            this.prepareForm();
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  prepareForm() {
    if (this.modalMode == 'create') {
      this.form.reset();
      this.titulo?.setValue('');
      this.url_enlace?.setValue('');
      this.fotoSlide = '';
      this.fotoSlideFinal = [];
      this.loading = false;
      this.sinFoto = false;
      this.fotoAmandar = '';
    } else if (this.modalMode == 'update') {
      this.titulo?.setValue(this.slide?.titulo);
      this.url_enlace?.setValue(this.slide?.url_enlace);
      this.fotoSlide = this.slide?.url_imagen;
    }
  }
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  openAddFileDialogCreate() {
    if (!this.loading) {
      const element: HTMLElement = this.inputFileDialogCreate.nativeElement;
      element.click();
    }
  }
  fileChangeCreate(event: any) {
    let previewImageCreate: SafeUrl = '';
    this.file = event.target.files[0];
    let objectURL = URL.createObjectURL(this.file);
    previewImageCreate = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    this.fotoSlide = previewImageCreate;
    this.fotoSlideFinal = [this.file];
    this.sinFoto = false;
    event.srcElement.value = '';
  }

  async loadPhotos() {
    try {
      if (this.fotoSlideFinal.length != 0) {
        const compressedFile =
          await this.compressImageSizeService.handleImageUpload(
            this.fotoSlideFinal[0]
          );
        let fileNameBase = 'sliderInicioFotos/foto';
        let file: any = compressedFile;
        let nowTimestamp = new Date().getTime().toString();
        await this.storage
          .cloudStorageTask(fileNameBase + nowTimestamp, file)
          .percentageChanges()
          .toPromise();
        let downloadUrl = await this.storage
          .cloudStorageRef(fileNameBase + nowTimestamp)
          .getDownloadURL()
          .toPromise();
        this.fotoAmandar = downloadUrl;
      }
    } catch (err) {
      console.log(err);
    }
  }
  async updateData() {
     this.loading = true;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }

    let foto: string = '';
    let urlFoto = this.slide?.url_imagen;
    this.form.disable();
    await this.loadPhotos();
    if (this.fotoAmandar && urlFoto?.includes('firebasestorage')) {
      console.log('Foto eliminada de firebase');
      this.storage.deleteByUrl(urlFoto);
    }
    if (this.fotoAmandar) {
      console.log('Foto cargada de firebase');
      foto = this.fotoAmandar;
    } else {
      console.log('Foto cargada de DB');
      foto = this.slide?.url_imagen;
    }
    let newslide:slide = {
      titulo: this.titulo?.value,
      url_enlace:this.url_enlace?.value,
      url_imagen:foto
    };
    this.sliderInicioService
      .updateSlide(this.id_slide, newslide)
      .subscribe(
        (response) => {
          this.goBack();
          this.loading = false;
          this.sinFoto = false;
        },
        (err) => {
          console.log(err);
          this.goBack();
          this.loading = false;
          this.sinFoto = false;
        }
      );
  }
  async addData() {
       this.loading = true;
       this.sinFoto = false;
    if (!this.form.valid || !this.fotoAmandar.includes('firebasestorage') && !this.file) {
      this.form.markAllAsTouched();
      this.loading = false;
      if (!this.fotoAmandar.includes('firebasestorage') && !this.file) {
        this.sinFoto = true;
      }
      return;
    }
    this.form.disable();
    await this.loadPhotos();
      let newslide: slide = {
        titulo: this.titulo?.value,
        url_enlace: this.url_enlace?.value,
        url_imagen: this.fotoAmandar,
      };

    this.sliderInicioService.addSlide(newslide).subscribe(
      (response) => {
        this.loading = false;
        this.sinFoto = false;
        this.goBack();
      },
      (err) => {
        console.log(err);
        this.goBack();
        this.sinFoto = false;
        this.loading = false;
      }
    );
  }
  editarData(slide: any) {
    this.form.enable();
    this.slide = slide;
    this.modalMode = 'update';
    this.prepareForm();
  }
  goBack() {
    this.platformLocation.back();
  }
  get titulo() {
    return this.form.get('titulo');
  }
  get url_enlace() {
    return this.form.get('url_enlace');
  }
}

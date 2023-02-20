import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ComunicacionEntreComponentesService } from '../../services/comunicacion-entre-componentes.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-modal-gallery-slider-ver-y-elimanar-fotos',
  templateUrl: './modal-gallery-slider-ver-y-elimanar-fotos.component.html',
  styleUrls: ['./modal-gallery-slider-ver-y-elimanar-fotos.component.scss'],
})
export class ModalGallerySliderVerYElimanarFotosComponent
  implements OnInit, OnDestroy
{
  @ViewChildren('myItemLists') items!: QueryList<ElementRef>;
  @ViewChild('fileInputCreate') inputFileDialogCreate!: ElementRef;
  @Input() shadoweffectindice!: number;
  @Input() imgselecmodal!: number;
  @Input() valorindicecarrucel!: number;
  @Input() showconteslaider!: boolean;
  @Input() arrayConAtributos: any;
  @Input() veryadicionar: boolean = false;
  @Input() ArrayFotos: Array<string | SafeUrl> = [];
  @Input() ArrayFiles: Array<string | SafeUrl> = [];
  @Input() action!: string;
  selectedGranjaId: number = -1;
  errorMessage = '';
  showGallery: boolean = false;
  indx!: number;
  indicatorsphotos!: boolean;
  /* variables nuevas */
  photosAppArray: Array<string | SafeUrl> = [];
  isPhotoSelectingToDel: boolean = false;
  photosArrayUrlToDel: Array<string | SafeUrl> = [];
  file: any = null;
  photosAppArrayCopy: Array<string | SafeUrl> = [];
  loading1: boolean = false;
  loading2: boolean = false;
  loading3: boolean = false;
  filesfinalCreate: any[] = [];
  previewImageCreate: SafeUrl = '';
  showNotFoundPhotos: boolean = false;
  arrayamandar: any = [];
  indicePhotodelate: number[] = [];
  cancelarseleccionphoto: boolean = false;
  maxFotosAlert:boolean=false;
  constructor(
    private _modalService: NgbActiveModal,
    private sanitizer: DomSanitizer,
    private comunicacionEntreComponentesService: ComunicacionEntreComponentesService
  ) {}

  public changeArray2!: Subscription;
  ngOnInit(): void {
    if (this.ArrayFotos.length == 0) {
      this.showNotFoundPhotos = true;
    } else {
      this.showNotFoundPhotos = false;
    }
    /* escucha el evento de fotos subidas y me actuliza mis fotos */
    this.changeArray2 =
      this.comunicacionEntreComponentesService.changeArray2.subscribe(
        (Array) => {
          this.ArrayFotos = this.ArrayFotos.concat(Array);
          this.loading2 = false;
        }
      );
  }
  ngOnDestroy(): void {
    this.changeArray2?.unsubscribe();
  }
  closeslider() {
    this.showconteslaider = false;
    setTimeout(() => {
      const scrollmover = localStorage.getItem('index');
      this.inView(Number(scrollmover));
    }, 10);
    setTimeout(() => {
      localStorage.removeItem('index');
    }, 11);
  }

  selcCarruselImg(idx: number) {
    this.valorindicecarrucel = idx;
    localStorage.setItem('index', idx.toString());
     this.imgselecmodal = -1;
  }
  eventClickOnPreviousOrNewSlider() {
    this.imgselecmodal = -1;
  }
  eventValueResponseClickFotoMiniSlider(index: number) {
    this.indx = index;
    localStorage.setItem('index', index.toString());
    if (this.imgselecmodal !== index) {
      this.imgselecmodal = -1;
    }
  }
  inView(index: number) {
    let valor = this.items.get(index);
    valor?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }

  imgSelecionadaModal(idx: number, photoUrl: any) {
    if (!this.isPhotoSelectingToDel) {
      this.imgselecmodal = idx;
      this.shadoweffectindice = -1;
      this.valorindicecarrucel = -1;
      localStorage.setItem('index', idx.toString());
      this.showconteslaider = true;
      this.imgselecmodal = idx;
    } else {
      let i = this.photosArrayUrlToDel.indexOf(photoUrl);
      if (i > -1) {
        this.photosArrayUrlToDel.splice(i, 1);
      } else {
        this.photosArrayUrlToDel.push(photoUrl);
      }
    }
  }
  onLongPressing(event: number) {
    console.log(event);
  }

  onLongPress() {
    if (this.veryadicionar) {
      this.isPhotoSelectingToDel = true;
      this.shadoweffectindice = -1;
      this.valorindicecarrucel = -1;
      this.imgselecmodal = -1;
    }
  }

  onReleasePressing() {
    if (this.veryadicionar) {
      this.shadoweffectindice = -1;
      this.valorindicecarrucel = -1;
      this.imgselecmodal = -1;
    }
  }

  abortDeleting() {
    if (this.veryadicionar) {
      this.isPhotoSelectingToDel = false;
      this.cancelarseleccionphoto = false;
      this.photosArrayUrlToDel = [];
    }
  }
  addPhotoToDel(photoUrl: string | SafeUrl, idx: number) {
    if (this.veryadicionar) {
      if (!this.isPhotoSelectingToDel) {
        this.showconteslaider = true;
        this.imgselecmodal = idx;
      }
      if (!this.isPhotoSelectingToDel) {
        return;
      }
      let i = this.photosArrayUrlToDel.indexOf(photoUrl);
      if (i > -1) {
        this.photosArrayUrlToDel.splice(i, 1);
      } else {
        this.photosArrayUrlToDel.push(photoUrl);
      }
    }
  }
  isPhotoIncludeToDelete(photoUrl: string | SafeUrl) {
    return this.photosArrayUrlToDel.includes(photoUrl);
  }
  seleccionarTodo() {
    this.shadoweffectindice = -1;
    this.valorindicecarrucel = -1;
    this.imgselecmodal = -1;
    if (this.photosArrayUrlToDel.length == this.ArrayFotos.length) {
      this.photosArrayUrlToDel = [];
    } else {
      for (let index = 0; index < this.ArrayFotos.length; index++) {
        let i = this.photosArrayUrlToDel.indexOf(this.ArrayFotos[index]);
        if (i > -1) {
          this.isPhotoIncludeToDelete(this.ArrayFotos[i]);
        } else {
          this.photosArrayUrlToDel.push(this.ArrayFotos[index]);
          this.isPhotoIncludeToDelete(this.ArrayFotos[index]);
        }
      }
    }
  }
  openAddFileDialogCreate() {
    const element: HTMLElement = this.inputFileDialogCreate.nativeElement;
    element.click();
  }
  @HostListener('openAddFileDialogCreate')
  fileChangeCreate(event: any) {
    let time;
    this.maxFotosAlert = false
    if (event.target.files.length > 10- this.ArrayFotos.length) {
      this.maxFotosAlert=true
      time =setTimeout(() => {
        this.maxFotosAlert = false;
      },5000);
      return;
    }
    clearTimeout(time)
   this.maxFotosAlert = false;
    if (this.action == 'create') {
      this.file = event.target.files;
      for (let index = 0; index < this.file.length; index++) {
        const element = this.file[index];
        this.filesfinalCreate.push(element);
        let objectURL = URL.createObjectURL(element);
        this.previewImageCreate =
        this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.ArrayFotos = this.ArrayFotos.concat(this.previewImageCreate);
        this.photosAppArray = this.ArrayFotos;
      }

      this.arrayamandar = [
        this.photosAppArray,
        this.filesfinalCreate,
        this.indicePhotodelate,
      ];
      this.comunicacionEntreComponentesService.changeMyArray(this.arrayamandar);
      this.filesfinalCreate = [];
      this.indicePhotodelate = [];
      this.photosAppArray = [];
       event.srcElement.value = ''
    } else if (this.action == 'update') {
      this.file = [];
      this.filesfinalCreate = [];
      this.file = event.target.files;
      for (let index = 0; index < this.file.length; index++) {
        const element = this.file[index];
        this.filesfinalCreate.push(element);
        this.loading2 = true;
      }
      if ( this.filesfinalCreate.length !== 0) {
        this.comunicacionEntreComponentesService.changeMyArray(
          this.filesfinalCreate
        );
      }
       event.srcElement.value = '';
    }
  }
  @HostListener('photosDeleteCreate')
  photosDeleteCreate() {
    if (this.action == 'create') {
      this.loading3 = true;
      this.cancelarseleccionphoto = true;
      this.photosAppArrayCopy = this.ArrayFotos.slice(0);
      this.photosArrayUrlToDel.forEach((photo) => {
        let index = this.photosAppArrayCopy.indexOf(photo);
        if (index > -1) {
          this.indicePhotodelate.push(index);
          this.photosAppArrayCopy.splice(index, 1);
          this.filesfinalCreate.splice(index, 1);
        }
        this.ArrayFotos = this.photosAppArrayCopy;
        this.photosAppArray = this.ArrayFotos;
            this.arrayamandar = [
              this.photosAppArray,
              this.filesfinalCreate,
              this.indicePhotodelate,
            ];
         this.comunicacionEntreComponentesService.changeMyArray(
           this.arrayamandar
         );
         this.filesfinalCreate = [];
         this.indicePhotodelate=[]
          this.photosAppArray=[]
          this.photosArrayUrlToDel=[]
        this.loading3 = false;

      });
      if (this.ArrayFotos.length == 0) {
        this.showNotFoundPhotos = true;
        this.cancelarseleccionphoto=false
        this.isPhotoSelectingToDel=false
         this.photosArrayUrlToDel = [];
      } else {
        this.showNotFoundPhotos = false;
      }
    } else if (this.action == 'update') {
      let newArrayFotos:any={
           arrayFotosBorradas:[],
           arrayFotosActualizadas:[]
      }
      this.loading3 = true;
      this.cancelarseleccionphoto = true;
      this.photosAppArrayCopy = this.ArrayFotos.slice(0);
      this.photosArrayUrlToDel.forEach((photo) => {
        newArrayFotos.arrayFotosBorradas.push(photo)
        let index = this.photosAppArrayCopy.indexOf(photo);
        if (index > -1) {
          this.photosAppArrayCopy.splice(index, 1);
        }
        this.ArrayFotos = this.photosAppArrayCopy;
        newArrayFotos.arrayFotosActualizadas = this.photosAppArrayCopy;
        this.loading3 = false;
        this.photosArrayUrlToDel = [];
      });
      this.comunicacionEntreComponentesService.arrayDelate(newArrayFotos);
      if (this.ArrayFotos.length == 0) {
      this.showNotFoundPhotos = true;
      this.cancelarseleccionphoto = false;
      this.isPhotoSelectingToDel = false;
      this.photosArrayUrlToDel = [];
        this.showNotFoundPhotos = true;
      } else {
        this.showNotFoundPhotos = false;
      }
    }
  }
  clickDelate() {
    this.shadoweffectindice = -1;
    this.valorindicecarrucel = -1;
    this.imgselecmodal = -1;
    this.cancelarseleccionphoto = true;
      if (this.ArrayFotos.length == 0) {
      this.isPhotoSelectingToDel = false
         this.showNotFoundPhotos = true;
         this.cancelarseleccionphoto = false;
         this.photosArrayUrlToDel = [];
      } else {
        this.isPhotoSelectingToDel = !this.isPhotoSelectingToDel;
      }
  }
  public dismiss() {
    this._modalService.dismiss(this.arrayamandar);
  }
}

import { PlatformLocation, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { NovedadesService } from 'src/app/services/novedades.service';

interface noveda {
  id_novedad?: number /* no */;
  autor: string;
  url_foto_autor?: string;
  url_foto_novedad: string;
  titulo: string;
  resumen: string;
  fecha_creacion?: any;
  cant_visitas: any;
  likes: any;
  url_novedad: string;
  email_autor?: any;
  canal?: any;
  cuerpo?: any;
  tipo_novedad: number;
  tipo: string;
  id_categoria?: any;
  nombre_categoria: string;
  descripcion_categoria: string;
  me_gusta: any;
  categorias?: string[];
}

@Component({
  selector: 'app-novedad-actualidad-detalle-form',
  templateUrl: './novedad-actualidad-detalle-form.component.html',
  styleUrls: ['./novedad-actualidad-detalle-form.component.scss'],
})
export class NovedadActualidadDetalleFormComponent implements OnInit {
  @ViewChild('fileInputCreate') inputFileDialogCreate!: ElementRef;
  form: FormGroup = new FormGroup({
    tipo_novedad: new FormControl('', [Validators.required]),
    titulo: new FormControl('', [Validators.required]),
    resumen: new FormControl('', [Validators.required]),
    autor: new FormControl('', [Validators.required]),
    url_novedad: new FormControl('', [Validators.required]),
  });
  tipoNovedad: any = [
    { nombre: 'Artículo', id: 1 },
    { nombre: 'Artículo-Colombia', id: 2 },
    { nombre: 'Revista', id: 3 },
    { nombre: 'Noticia', id: 4 },
  ];
  loading: boolean = false;
  modalMode: string = 'visualize';
  fotoNovedad: any;
  fotoNovedadFinal: any[] = [];
  fotoAmandar: string = '';
  file: any = null;
  novedad!: noveda;
  authUserId: number = -1;
  id_novedad: number = -1;
  enlacesArray: any[] = [];
  constructor(
    private storage: FirebaseStorageService,
    public platformLocation: PlatformLocation,
    private compressImageSizeService: CompressImageSizeService,
    private sanitizer: DomSanitizer,
    private ar: ActivatedRoute,
    private novedadesService: NovedadesService
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    let idNovedad = Number(this.ar.snapshot.paramMap.get('id'));
    this.modalMode = this.ar.snapshot.paramMap.get('action')!;
    this.authUserId = Number(this.ar.snapshot.paramMap.get('authUserId')!);
    if (this.modalMode == 'update') {
      this.novedadesService.getNovedades().subscribe(
        (response) => {
          let index = response.data.findIndex(
            (novedad: noveda) => novedad.id_novedad == idNovedad
          );
          this.novedad = response.data[index];
          this.id_novedad = this.novedad?.id_novedad!;
          this.prepareForm();
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
      this.autor?.setValue('');
      this.resumen?.setValue('');
      this.idTipo_novedad?.setValue(-1);
      this.titulo?.setValue('');
      this.url_novedad?.setValue('');
      this.fotoNovedad = '';
      this.fotoNovedadFinal = [];
      this.loading = false;
      this.fotoAmandar = '';
    } else if (this.modalMode == 'update') {
      this.autor?.setValue(this.novedad?.autor);
      this.resumen?.setValue(this.novedad?.resumen);
      this.idTipo_novedad?.setValue(this.novedad?.tipo_novedad);
      this.titulo?.setValue(this.novedad?.titulo);
      this.url_novedad?.setValue(this.novedad?.url_novedad);
      this.fotoNovedad = this.novedad?.url_foto_novedad;
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
    this.fotoNovedad = previewImageCreate;
    this.fotoNovedadFinal = [this.file];
    event.srcElement.value = '';
  }

  async loadPhotos() {
    try {
      if (this.fotoNovedadFinal.length != 0) {
        const compressedFile =
          await this.compressImageSizeService.handleImageUpload(
            this.fotoNovedadFinal[0]
          );
        let fileNameBase = 'novedades/foto';
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
    let urlFoto = this.novedad?.url_foto_novedad;
    this.form.disable();
    await this.loadPhotos();
    if (this.fotoAmandar && urlFoto.includes('firebasestorage')) {
      console.log('Foto eliminada de firebase');
      this.storage.deleteByUrl(urlFoto);
    }
    if (this.fotoAmandar) {
      console.log('Foto cargada de firebase');
      foto = this.fotoAmandar;
    } else {
      console.log('Foto cargada de DB');
      foto = this.novedad?.url_foto_novedad;
    }
    let newNovedad = {
      titulo: this.titulo?.value,
      autor: this.autor?.value,
      cuerpo: '',
      fecha_creacion: '',
      resumen: this.resumen?.value,
      cant_visitas: '',
      url_foto_autor: '',
      url_foto_novedad: foto,
      url_novedad: this.url_novedad?.value,
      canal: '',
      email_autor: '',
      id_tipo_novedad: Number(this.idTipo_novedad?.value),
    };
    this.novedadesService
      .updateNovedadParcial(this.id_novedad, newNovedad)
      .subscribe(
        (response) => {
          this.goBack();
          this.loading = false;
        },
        (err) => {
          console.log(err);
          this.goBack();
          this.loading = false;
        }
      );
  }
  async addData() {
    this.loading = true;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    this.form.disable();
    await this.loadPhotos();
    let newNovedad = {
      titulo: this.titulo?.value,
      autor: this.autor?.value,
      cuerpo: '',
      fecha_creacion: '',
      resumen: this.resumen?.value,
      cant_visitas: '',
      url_foto_autor: '',
      url_foto_novedad: this.fotoAmandar,
      url_novedad: this.url_novedad?.value,
      canal: '',
      email_autor: '',
      id_tipo_novedad: Number(this.idTipo_novedad?.value),
      arrayCategorias: [],
    };
    this.novedadesService.addNovedad(newNovedad).subscribe(
      (response) => {
        this.loading = false;
        this.goBack();
      },
      (err) => {
        console.log(err);
        this.goBack();
        this.loading = false;
      }
    );
  }
  editarData(novedad: any) {
    this.form.enable();
    this.novedad = novedad;
    this.modalMode = 'update';
    this.prepareForm();
  }
  goBack() {
    this.platformLocation.back();
  }
  get idTipo_novedad() {
    return this.form.get('tipo_novedad');
  }
  get resumen() {
    return this.form.get('resumen');
  }
  get autor() {
    return this.form.get('autor');
  }
  get titulo() {
    return this.form.get('titulo');
  }
  get url_novedad() {
    return this.form.get('url_novedad');
  }
}

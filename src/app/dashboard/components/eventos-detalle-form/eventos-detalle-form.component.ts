import {
  formatDate,
  PlatformLocation,
  registerLocaleData,
} from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { EventosService } from 'src/app/services/eventos.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
interface evento {
  id_evento?: number;
  nombre: string;
  resumen: string;
  fecha: any;
  hora: string;
  imagen: string;
  url: string;
  dirigidoa: string;
  organizador: string;
  costo: string;
  id_modalidad_fk?: number;
  id_tipo_evento_fk?: number;
  id_modalidad?: number;
  id_tipo_evento?: number;
  tipo?: string;
  modalidad?: string;
}

@Component({
  selector: 'app-eventos-detalle-form',
  templateUrl: './eventos-detalle-form.component.html',
  styleUrls: ['./eventos-detalle-form.component.scss'],
})
export class EventosDetalleFormComponent implements OnInit {
  @ViewChild('fileInputCreate') inputFileDialogCreate!: ElementRef;
  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    resumen: new FormControl('', [Validators.required]),
    organizador: new FormControl('', [Validators.required]),
    dirigidoa: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required]),
    costo: new FormControl('', ),
    fecha: new FormControl('', ),
    hora: new FormControl(null, ),
    id_modalidad_fk: new FormControl('', [Validators.required]),
    id_tipo_evento_fk: new FormControl('', [Validators.required]),
  });
  tipoModalidad: any = [
    { nombre: 'Presencial', id: 1 },
    { nombre: 'Virtual-c', id: 2 },
    { nombre: 'Online', id: 3 },
  ];
  tipoEventos: any = [
    { nombre: 'Cursos', id: 1 },
    { nombre: 'Capacitaciones', id: 5 },
    { nombre: 'Congresos', id: 6 },
  ];
  loading: boolean = false;
  modalMode: string = 'visualize';
  fotoEvento: any;
  fotoEventoFinal: any[] = [];
  fotoAmandar: string = '';
  file: any = null;
  evento!:evento;
  id_evento:number=-1
  constructor(
    private storage: FirebaseStorageService,
    public platformLocation: PlatformLocation,
    private compressImageSizeService: CompressImageSizeService,
    private sanitizer: DomSanitizer,
    private ar: ActivatedRoute,
    private eventosService: EventosService
  ) {}
  ngOnInit(): void {
    registerLocaleData(es);
    let idEvento = Number(this.ar.snapshot.paramMap.get('id'));
    this.modalMode = this.ar.snapshot.paramMap.get('action')!;
    if (this.modalMode == 'update') {
      this.eventosService.getEventos().subscribe(
        (response) => {
          let index = response.data.findIndex(
            (evento:evento) => evento.id_evento == idEvento
          );
          this.evento = response.data[index];
          this.id_evento=this.evento.id_evento!
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
      this.url?.setValue('');
      this.nombre?.setValue('');
      this.resumen?.setValue('');
      this.organizador?.setValue('');
      this.dirigidoa?.setValue('');
      this.costo?.setValue(null);
      this.fecha?.setValue('');
      this.hora?.setValue(null);
      this.id_modalidad_fk?.setValue(null);
      this.id_tipo_evento_fk?.setValue(null);
      this.fotoEvento = '';
      this.fotoEventoFinal = [];
      this.loading = false;
      this.fotoAmandar = '';
    }
    if (this.modalMode == 'update') {
      let fecha: any;
      this.url?.setValue(this.evento.url);
      this.nombre?.setValue(this.evento?.nombre);
      this.resumen?.setValue(this.evento?.resumen);
      this.organizador?.setValue(this.evento?.organizador);
      this.dirigidoa?.setValue(this.evento?.dirigidoa);
      this.costo?.setValue(this.evento?.costo);
      if (this.evento?.fecha) {
        fecha = this.evento?.fecha as string;
        fecha = fecha.split('T')[0];
        this.fecha?.setValue(formatDate(fecha, 'yyyy-MM-dd', 'es'));
      }
      this.hora?.setValue(this.evento?.hora);
      this.id_modalidad_fk?.setValue(this.evento?.id_modalidad_fk);
      this.id_tipo_evento_fk?.setValue(this.evento?.id_tipo_evento_fk);
      this.fotoEvento = this.evento?.imagen;
      console.log(this.hora)
      console.log(this.fecha)
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
    this.fotoEvento = previewImageCreate;
    this.fotoEventoFinal = [this.file];
    event.srcElement.value = '';
  }

  async loadPhotos() {
    try {
      if (this.fotoEventoFinal.length != 0) {
        const compressedFile =
          await this.compressImageSizeService.handleImageUpload(
            this.fotoEventoFinal[0]
          );
        let fileNameBase = 'eventos/foto';
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
    let foto: string = '';
    let urlFoto = this.evento?.imagen;

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    this.form.disable();
    await this.loadPhotos();
    if (this.fotoAmandar && urlFoto.includes('firebasestorage')) {
      console.log("Foto eliminada de firebase")
      this.storage.deleteByUrl(urlFoto);
    }
    if (this.fotoAmandar) {
      console.log('Foto cargada de firebase');
      foto = this.fotoAmandar;
    } else {
      console.log('Foto cargada de DB');
      foto = this.evento?.imagen;
    }
    let newEvento:evento = {
      url: this.url?.value,
      nombre: this.nombre?.value,
      resumen: this.resumen?.value,
      organizador: this.organizador?.value,
      dirigidoa: this.dirigidoa?.value,
      costo: this.costo?.value,
      fecha: this.fecha?.value,
      hora: this.hora?.value,
      id_modalidad: Number(this.id_modalidad_fk?.value),
      id_tipo_evento: Number(this.id_tipo_evento_fk?.value),
      imagen: foto,
    };
    console.log(newEvento)
    this.eventosService
      .updateEvento(this.evento.id_evento!, newEvento)
      .subscribe(
        (response) => {
          /*  this.goBack(); */
          this.loading = false;
        },
        (err) => {
          console.log(err);
           /* this.goBack(); */
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
    let newEvento:evento = {
      url: this.url?.value,
      nombre: this.nombre?.value,
      resumen: this.resumen?.value,
      organizador: this.organizador?.value,
      dirigidoa: this.dirigidoa?.value,
      costo: this.costo?.value,
      fecha: this.fecha?.value,
      hora: this.hora?.value,
      id_modalidad: Number(this.id_modalidad_fk?.value),
      id_tipo_evento: Number(this.id_tipo_evento_fk?.value),
      imagen: this.fotoAmandar,
    };
    this.eventosService.addEvento(newEvento).subscribe(
      (response) => {
        console.log(response);
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
  editarData(evento: any) {
    this.form.enable();
    this.evento = evento;
    this.modalMode = 'update';
    this.prepareForm();
  }
  goBack() {
    this.platformLocation.back();
  }
  get dirigidoa() {
    return this.form.get('dirigidoa');
  }
  get resumen() {
    return this.form.get('resumen');
  }
  get organizador() {
    return this.form.get('organizador');
  }
  get nombre() {
    return this.form.get('nombre');
  }
  get url() {
    return this.form.get('url');
  }
  get costo() {
    return this.form.get('costo');
  }
  get fecha() {
    return this.form.get('fecha');
  }
  get hora() {
    return this.form.get('hora');
  }
  get id_modalidad_fk() {
    return this.form.get('id_modalidad_fk');
  }
  get id_tipo_evento_fk() {
    return this.form.get('id_tipo_evento_fk');
  }
}

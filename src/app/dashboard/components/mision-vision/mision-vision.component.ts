
import { MisionVisionService } from 'src/app/services/mision-vision.service';
import { PlatformLocation } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { ComunicacionEntreComponentesService } from 'src/app/shared/services/comunicacion-entre-componentes.service';
@Component({
  selector: 'app-mision-vision',
  templateUrl: './mision-vision.component.html',
  styleUrls: ['./mision-vision.component.scss'],
})
export class MisionVisionComponent implements OnInit {
  @ViewChild('fileInputCreate') inputFileDialogCreate!: ElementRef;
  misionVision: any;
  form: FormGroup = new FormGroup({
    entidad: new FormControl('', [Validators.required]),
    mision: new FormControl('', [Validators.required]),
    vision: new FormControl('', [Validators.required]),
  });
  loading: boolean = false;
  modalMode: string = 'visualize';
  fotoMision: any;
  fotoVision: any;
  fotoEntidad: any;
  fotoMisionFinal!: string;
  fotoVisionFinal!: string;
  fotoEntidadFinal!: string;
  fotosMisionVision: any[] = [{ entidad: [] }, { mision: [] }, { vision: [] }];
  option: string = '';
  file: any = null;
  constructor(
    private misionVisionService: MisionVisionService,
    private storage: FirebaseStorageService,
    public platformLocation: PlatformLocation,
    private compressImageSizeService: CompressImageSizeService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.fotoMisionFinal = '';
    this.fotoVisionFinal = '';
    this.fotoEntidadFinal = '';
    this.fotosMisionVision = [{ entidad: [] }, { mision: [] }, { vision: [] }];
    this.form.disable();
    if (this.modalMode == 'visualize') {
      this.misionVisionService.getVisionMision().subscribe(
        (response) => {
          this.misionVision = response.data[0];
          this.entidad?.setValue(this.misionVision?.entidad);
          this.mision?.setValue(this.misionVision?.mision);
          this.vision?.setValue(this.misionVision?.vision);
          this.fotoEntidad = this.misionVision?.imagen_entidad;
          this.fotoMision = this.misionVision?.imagen_mision;
          this.fotoVision = this.misionVision?.imagen_vision;
          this.fotoEntidadFinal = this.misionVision?.imagen_entidad;
          this.fotoMisionFinal = this.misionVision?.imagen_mision;
          this.fotoVisionFinal = this.misionVision?.imagen_vision;
        },
        (err) => {}
      );
    }
  }
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  openAddFileDialogCreate(option: string) {
    this.option = option;
    const element: HTMLElement = this.inputFileDialogCreate.nativeElement;
    element.click();
  }
  fileChangeCreate(event: any) {
    let previewImageCreate: SafeUrl = '';
    this.file = event.target.files[0];
    let objectURL = URL.createObjectURL(this.file);
    previewImageCreate = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    if (this.option == 'entidad') {
      this.fotoEntidad = previewImageCreate;
      this.fotosMisionVision[0].entidad = [this.file];
    } else if (this.option == 'mision') {
      this.fotoMision = previewImageCreate;
      this.fotosMisionVision[1].mision = [this.file];
    } else if (this.option == 'vision') {
      this.fotoVision = previewImageCreate;
      this.fotosMisionVision[2].vision = [this.file];
    }
    event.srcElement.value = '';
  }

  async loadPhotos() {
    try {
      let datos = ['entidad', 'mision', 'vision'];
      for (let index = 0; index < this.fotosMisionVision.length; index++) {
        let foto = this.fotosMisionVision[index][datos[index]];
        if (foto.length != 0) {
          const compressedFile =
            await this.compressImageSizeService.handleImageUpload(foto[0]);
          let fileNameBase = 'misionVision/nosotros';
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
          await this.VerifyPhoto(datos[index], downloadUrl);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  VerifyPhoto(data: string, urlFoto: string) {
   let urlfotoVision = this.fotoVisionFinal;;
   let urlfotoMision = this.fotoMisionFinal;
   let urlfotoEntidad = this.fotoEntidadFinal;
    if (data == 'entidad') {
       this.storage.deleteByUrl(urlfotoEntidad);
      this.fotoEntidadFinal = urlFoto;
    }
    if (data == 'mision') {
       this.storage.deleteByUrl(urlfotoMision);
      this.fotoMisionFinal = urlFoto;
    }
    if (data == 'vision') {
      this.storage.deleteByUrl(urlfotoVision);
      this.fotoVisionFinal = urlFoto;
    }
  }
  async updateData() {
    this.loading = true;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    this.form.disable();
    this.modalMode = 'visualize';
    await this.loadPhotos();
    let newMisionVision = {
      entidad: this.entidad?.value,
      mision: this.mision?.value,
      vision: this.vision?.value,
      imagen_entidad: this.fotoEntidadFinal,
      imagen_mision: this.fotoMisionFinal,
      imagen_vision: this.fotoVisionFinal,
    };
    this.misionVisionService.updateVisionMision(0, newMisionVision).subscribe(
      (response) => {
        this.misionVision = newMisionVision;
        this.loading = false;
        this.cancelarEditarData();
      },
      (err) => {
        this.cancelarEditarData();
        this.loading = false;
      }
    );
  }
  editarData() {
    this.form.enable();
    this.modalMode = 'update';
  }
  cancelarEditarData() {
    this.form.disable();
    this.modalMode = 'visualize';
    this.prepareForm();
  }
  get entidad() {
    return this.form.get('entidad');
  }
  get mision() {
    return this.form.get('mision');
  }
  get vision() {
    return this.form.get('vision');
  }
}

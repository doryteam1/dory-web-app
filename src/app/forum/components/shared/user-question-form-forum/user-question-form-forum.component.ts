import { PlatformLocation } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CommunicateDataService } from 'src/app/services/communicate-data.service';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { ForumService } from 'src/app/services/forum.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { WhiteSpaceValidator } from 'src/app/validators/white-space.validator';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user-question-form-forum',
  templateUrl: './user-question-form-forum.component.html',
  styleUrls: ['./user-question-form-forum.component.scss'],
})
export class UserQuestionFormForumComponent implements OnInit {
  @ViewChild('fileInputCreate') inputFileDialogCreate!: ElementRef;
  @Output() onShowForm: EventEmitter<boolean> = new EventEmitter();
  @Input() showForm: boolean = false;
  @Input() showButton: boolean = false;
  @Input() formMode: string = 'create';
  @Input() pregunta: any;

  form: FormGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required, WhiteSpaceValidator]),
    descripcion: new FormControl('', [
      Validators.required,
      WhiteSpaceValidator,
    ]),
  });

  maxPhotosAlert: boolean = false;
  photos: any[] = [];
  photosFiles: any[] = [];
  loading: boolean = false;
  isAuthUserPhoto: any;
  id_pregunta!: number;
  photosDeleteStorage: any[] = [];
  previewCreatedPhotos: any[] = [];
  limitePhotos: number = Number(environment.limitPhotosForum);
  constructor(
    private sanitizer: DomSanitizer,
    private compressImageSizeService: CompressImageSizeService,
    private forumService: ForumService,
    private communicateDataService: CommunicateDataService,
    public userService: UsuarioService,
    private storage: FirebaseStorageService,
    public location: PlatformLocation
  ) {}

  ngOnInit(): void {
    this.prepareForm();
    this.isAuthUserPhoto = this.userService.getAuthUserPhoto();
  }

  async actionData() {
    this.loading = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    this.form.disable();
    try {
      let response;
      switch (this.formMode) {
        case 'create':
          response = await this.forumService
            .addPregunta(this.form.getRawValue())
            .toPromise();
          if (this.photosFiles.length > 0 && response?.body?.insertId) {
            this.id_pregunta = response.body.insertId;
            await this.loadPhotos(this.photosFiles);
          }
          break;
        case 'update':
          response = await this.forumService
            .updatePregunta(this.pregunta.id, this.form.getRawValue())
            .toPromise();

          if (
            this.photosFiles.length > 0 ||
            this.photosDeleteStorage.length > 0
          ) {
            await this.loadPhotos(this.photosFiles);
          }

          break;
      }

      this.communicateDataService.updateData(true);
    } catch (err) {
      console.error(err);
      this.openForm();
    } finally {
      this.openForm();
    }
  }

  async loadPhotos(event: any) {
    try {
      const compressedFiles =
        await this.compressImageSizeService.handleImageArrayUpload(event);
      let fileNameBase =
        '/pregunta/User' + Number(this.userService.getAuthUserId()) + '/foto';
      let files: Array<any> = compressedFiles;
      let arrayPhotos: Array<any> = [];
      for (let i = 0; i < files.length; i++) {
        let nowTimestamp = new Date().getTime().toString();
        await this.storage
          .cloudStorageTask(fileNameBase + nowTimestamp, files[i])
          .percentageChanges()
          .toPromise();
        let downloadUrl = await this.storage
          .cloudStorageRef(fileNameBase + nowTimestamp)
          .getDownloadURL()
          .toPromise();
        arrayPhotos.push(downloadUrl);
      }
      switch (this.formMode) {
        case 'create':
          await this.photosUpdate(arrayPhotos);
          break;
        case 'update':
          await this.photosUpdate(this.photos.concat(arrayPhotos));
          break;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async photosUpdate(photos: any[]) {
    try {
      let response = await this.forumService
        .updatePhotos(this.id_pregunta, photos)
        .toPromise();
      if (this.photosDeleteStorage.length > 0) {
        this.storage?.deleteMultipleByUrls(this.photosDeleteStorage);
      }
    } catch (error) {
      console.log(error);
    }
  }
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }

  openForm() {
    this.resetVariables();
    this.onShowForm.emit(this.showForm);
  }

  openAddFileDialogCreate() {
    const element: HTMLElement = this.inputFileDialogCreate.nativeElement;
    element.click();
  }

  fileChangeCreate(event: any) {
    let time;
    this.maxPhotosAlert = false;
    if (
      event.target.files.length > (this.limitePhotos - (this.photos.length + this.previewCreatedPhotos.length))
    ) {
      this.maxPhotosAlert = true;
      time = setTimeout(() => {
        this.maxPhotosAlert = false;
      }, 5000);
      return;
    }
    clearTimeout(time);
    this.maxPhotosAlert = false;
    let files: any = event.target.files;
    let photos: any[] = [];
    let photosFiles: any = [];
    for (let file of files) {
      let objectURL = URL.createObjectURL(file);
      photos.push(this.sanitizer.bypassSecurityTrustUrl(objectURL));
      photosFiles.push(file);
    }

    this.previewCreatedPhotos = this.previewCreatedPhotos.concat(photos);
    this.photosFiles = this.photosFiles.concat(photosFiles);
    event.srcElement.value = '';
  }

  deleteImg(i: number, typePhoto: string, photo: any) {
    if (this.loading) {
      return;
    }
    switch (this.formMode) {
      case 'create':
        this.photosSplice(i);
        break;
      case 'update':
        if (typePhoto === 'fireStorage') {
          this.photosDeleteStorage.push(photo);
          this.photos.splice(i, 1);
        } else {
          this.photosSplice(i);
        }
        break;
    }
  }

  photosSplice(i: number) {
    this.photosFiles.splice(i, 1);
    this.previewCreatedPhotos.splice(i, 1);
  }

  prepareForm() {
    this.resetVariables();
    if (this.formMode === 'update') {
      this.titulo?.setValue(this.pregunta?.titulo);
      this.descripcion?.setValue(this.pregunta?.descripcion);
      this.id_pregunta = this.pregunta?.id;
      this.photos = [...this.pregunta.fotos];
    }
  }

  resetVariables() {
    this.loading = false;
    this.maxPhotosAlert = false;
    this.photosFiles = [];
    this.photos = [];
    this.photosDeleteStorage = [];
    this.previewCreatedPhotos = [];
    this.form.enable();
    this.form.reset();
  }

  get descripcion(): AbstractControl | null {
    return this.form.get('descripcion');
  }

  get titulo(): AbstractControl | null {
    return this.form.get('titulo');
  }
}

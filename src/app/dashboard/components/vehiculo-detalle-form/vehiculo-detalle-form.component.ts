import { PlatformLocation } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { ComunicacionEntreComponentesService } from 'src/app/shared/services/comunicacion-entre-componentes.service';
@Component({
  selector: 'app-vehiculo-detalle-form',
  templateUrl: './vehiculo-detalle-form.component.html',
  styleUrls: ['./vehiculo-detalle-form.component.scss'],
})
export class VehiculoDetalleFormComponent implements OnInit {
  vehiculo: any;
  form: FormGroup = new FormGroup({
    modelo: new FormControl('', [Validators.required]),
    capacidad: new FormControl(0, [Validators.required]),
    transporte_alimento: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
  });
  loading: boolean = false;
  /* showErrorNotImageSelected: boolean = false; */
  photosVehicuArray: Array<string | SafeUrl> = [];
  filesfinalCreate: any[] = [];
  authUserId: number = -1;
  modalMode: string = 'create';
  codigoVehiculo!: number;
  loadingphoto: boolean = false;
  constructor(
    private vehiculosService: VehiculosService,
    private storage: FirebaseStorageService,
    private appModalService: AppModalService,
    public platformLocation: PlatformLocation,
    private comunicacionEntreComponentesService: ComunicacionEntreComponentesService,
    private compressImageSizeService: CompressImageSizeService,
    private ar: ActivatedRoute
  ) {}
  public changeArray!: Subscription;
  public ArrayDelate!: Subscription;
  ngOnInit(): void {
    this.vehiculo = this.ar.snapshot.params;
    this.modalMode = this.ar.snapshot.paramMap.get('action')!;
    this.authUserId = Number(this.ar.snapshot.paramMap.get('authUserId')!);
    this.prepareForm(this.modalMode!, this.vehiculo);
    if (this.modalMode == 'update') {
      this.vehiculosService
        .getDetail(Number(this.vehiculo.id_vehiculo))
        .subscribe((response) => {
          this.photosVehicuArray = response.data[0].fotos_vehiculos;
        });
    }
    this.changeArray =
      this.comunicacionEntreComponentesService.changeArray.subscribe(
        (arrayFiles) => {
          if (arrayFiles.length > 0) {
            if (this.modalMode == 'create') {
              if (arrayFiles[0].length > 0) {
                for (let index = 0; index < arrayFiles[0].length; index++) {
                  this.photosVehicuArray = arrayFiles[0];
                }
              } else {
                this.photosVehicuArray = [];
              }
              for (let index = 0; index < arrayFiles[1].length; index++) {
                const element = arrayFiles[1][index];
                this.filesfinalCreate.push(element);
              }
              for (let index = 0; index < arrayFiles[2].length; index++) {
                const element = arrayFiles[2][index];
                this.filesfinalCreate.splice(element, 1);
              }
            } else if (this.modalMode == 'update') {
              this.loadPhotos(arrayFiles);
            }
          }
        }
      );
    this.ArrayDelate =
      this.comunicacionEntreComponentesService.ArrayDelate.subscribe(
        (arrayFotoDelate) => {
          this.photosDelete(arrayFotoDelate);
        }
      );
  }
  ngOnDestroy(): void {
    this.changeArray?.unsubscribe();
    this.ArrayDelate?.unsubscribe();
  }
  prepareForm(action: string, vehiculo?: any) {
    this.modalMode = action;
    this.photosVehicuArray = [];
    this.filesfinalCreate = [];
    this.codigoVehiculo = -1;
    this.form.reset();
    this.formInit();
    if (action == 'update') {
      this.codigoVehiculo = Number(vehiculo.id_vehiculo!);
      this.modelo?.setValue(vehiculo.modelo);
      this.capacidad?.setValue(Number(vehiculo.capacidad));
      this.transporteAlimento?.setValue(vehiculo.transporte_alimento);
      this.descripcion?.setValue(vehiculo.descripcion);
    }
  }
  formInit() {
    this.modelo?.setValue('');
    this.capacidad?.setValue(null);
    this.transporteAlimento?.setValue('');
    this.descripcion?.setValue('');
  }
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  addVehiculo() {
    this.loading = true;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      console.log('Faltan datos');
      this.loading = false;
      return;
    }
    this.form.disable();
    let newVehiculo = {
      modelo: this.modelo?.value,
      capacidad: this.capacidad?.value,
      transporte_alimento: this.transporteAlimento?.value,
      descripcion: this.descripcion?.value,
    };
    this.vehiculosService.addVehiculo(newVehiculo).subscribe(
      (response) => {
        this.codigoVehiculo = response.body.message.insertId;
        this.loadPhotos(this.filesfinalCreate);
        this.loadingphoto = true;
      },
      (err) => {
        console.log(err);
        this.goBack();
        this.form.enable();
        this.loading = false;
      }
    );
  }
  updateVehiculo() {
    this.loading = true;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    let newVehiculo = {
      modelo: this.modelo?.value,
      capacidad: this.capacidad?.value,
      transporte_alimento: this.transporteAlimento?.value,
      descripcion: this.descripcion?.value,
    };
    this.form.disable();
    this.vehiculosService
      .updateVehiculo(newVehiculo, Number(this.vehiculo.id_vehiculo))
      .subscribe(
        (response) => {
          this.filesfinalCreate = [];
          this.photosVehicuArray = [];
          this.goBack();
          this.loading = false;
          this.form.enable();
        },
        (err) => {
          console.log(err);
          this.filesfinalCreate = [];
          this.photosVehicuArray = [];
          this.goBack();
          this.loading = false;
          this.form.enable();
          this.loading = false;
        }
      );
  }
  /* funciones necesarias para cargar y adicionar fotos */
  /* modal fotos */
  openPhotosModal() {
    if (!this.loading) {
      this.platformLocation.onPopState(() => {
        this.appModalService.CloseModalGalleryVerAdiconarEliminarFotos();
      });
      let showconteslaider = false;
      let veryadicionar = true;
      let arrayFotos = this.photosVehicuArray;
      let filesCreate: any;
      if (this.modalMode == 'create') {
        filesCreate = this.filesfinalCreate;
      } else if (this.modalMode == 'update') {
        filesCreate = -1;
      }
      this.appModalService
        .modalGalleryVerAdiconarEliminarFoto(
          -1,
          -1,
          -1,
          showconteslaider,
          veryadicionar,
          arrayFotos,
          filesCreate,
          this.modalMode
        )
        .then((result: any) => {})
        .catch((result) => {});
    }
  }
  @HostListener('loadPhotos')
  async loadPhotos(event: any) {
    if (this.modalMode == 'create') {
      try {
        const compressedFiles =
          await this.compressImageSizeService.handleImageArrayUpload(event);
        let fileNameBase = '/vehiculos/' + 'vehiculo-' + this.authUserId + '-';
        let files: Array<any> = compressedFiles;
        let arrayFotos: Array<any> = [];
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
          arrayFotos.push(downloadUrl);
          console.log('Fotos guardadas');
        }
        this.photosVehicuArray = [];
        this.photosVehicuArray = this.photosVehicuArray.concat(arrayFotos);
        this.photosUpdate();
      } catch (err) {
        console.log(err);
      }
    } else if (this.modalMode == 'update') {
      try {
        const compressedFiles =
          await this.compressImageSizeService.handleImageArrayUpload(event);
        let fileNameBase = '/vehiculos/' + 'vehiculo-' + this.authUserId + '-';
        let files: Array<any> = compressedFiles;
        let arrayFotos: Array<any> = [];
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
          arrayFotos.push(downloadUrl);
          console.log('Fotos guardadas');
        }
        this.photosVehicuArray = this.photosVehicuArray.concat(arrayFotos);
        /* entrega las ultimas fotos que se cargaron, las manda al componente
        que las necesite */
        this.comunicacionEntreComponentesService.changeMyArray2(arrayFotos);
        this.photosUpdate();
      } catch (err) {
        console.log(err);
      }
    }
  }
  photosUpdate() {
    if (this.modalMode == 'create') {
      this.vehiculosService
        .updatePhotosVehiculos(this.codigoVehiculo, {
          arrayFotos: this.photosVehicuArray,
        })
        .subscribe(
          (response) => {
            this.filesfinalCreate = [];
            this.form.enable();
            this.goBack();
            this.loading = false;
            this.loadingphoto = false;
            console.log('Fotos guardadas');
          },
          (err) => {
            this.filesfinalCreate = [];
            this.form.enable();
            this.goBack();
            this.loading = false;
            this.loadingphoto = false;
            console.log('Fotos guardadas');
            console.log(err);
          }
        );
    } else {
      this.vehiculosService
        .updatePhotosVehiculos(this.codigoVehiculo, {
          arrayFotos: this.photosVehicuArray,
        })
        .subscribe(
          (response) => {
            this.filesfinalCreate = [];
            this.loading = false;
            console.log('Fotos guardadas');
          },
          (err) => {
            console.log(err);
            this.filesfinalCreate = [];
            this.loading = false;
          }
        );
    }
  }
  photosDelete(arraydelate: any) {
    this.vehiculosService
      .updatePhotosVehiculos(this.codigoVehiculo, {
        arrayFotos: arraydelate.arrayFotosActualizadas,
      })
      .subscribe(
        (response) => {
          this.photosVehicuArray = arraydelate.arrayFotosActualizadas;
          this.storage.deleteMultipleByUrls(arraydelate.arrayFotosBorradas);
          this.loading = false;
        },
        (err) => {
          console.log(err);
        }
      );
  }
  goBack() {
    this.platformLocation.back();
  }
  get modelo() {
    return this.form.get('modelo');
  }
  get capacidad() {
    return this.form.get('capacidad');
  }
  get transporteAlimento() {
    return this.form.get('transporte_alimento');
  }
  get descripcion() {
    return this.form.get('descripcion');
  }
  get precio() {
    return this.form.get('imagen');
  }
}

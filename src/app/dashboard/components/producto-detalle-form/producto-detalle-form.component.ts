import { PlatformLocation } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { ComunicacionEntreComponentesService } from 'src/app/shared/services/comunicacion-entre-componentes.service';
@Component({
  selector: 'app-producto-detalle-form',
  templateUrl: './producto-detalle-form.component.html',
  styleUrls: ['./producto-detalle-form.component.scss'],
})
export class ProductoDetalleFormComponent implements OnInit {
  producto: any;
  form: FormGroup = new FormGroup({
    nombreProducto: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precio: new FormControl(0, [Validators.required]),
  });
  loading: boolean = false;
  /*  showErrorNotImageSelected: boolean = false; */
  photosProducArray: Array<string | SafeUrl> = [];
  filesfinalCreate: any[] = [];
  authUserId: number = -1;
  modalMode: string = 'create';
  codigoProducto!: number;
  loadingphoto: boolean = false;
  constructor(
    private proveedorService: ProveedorService,
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
    console.log('params ', this.ar.snapshot.params);
    this.producto = this.ar.snapshot.params;
    this.modalMode = this.ar.snapshot.paramMap.get('action')!;
    this.authUserId = Number(this.ar.snapshot.paramMap.get('authUserId')!);
    this.prepareForm(this.modalMode!, this.producto);
    if (this.modalMode == 'update') {
      this.proveedorService
        .getProductoDetail(Number(this.producto.codigo))
        .subscribe((response:any) => {
          console.log(response);
          this.photosProducArray = response.data[0].fotos_producto;
        });
    }
    this.changeArray =
      this.comunicacionEntreComponentesService.changeArray.subscribe(
        (arrayFiles) => {
          if (arrayFiles.length > 0) {
            if (this.modalMode == 'create') {
              if (arrayFiles[0].length > 0) {
                for (let index = 0; index < arrayFiles[0].length; index++) {
                  this.photosProducArray = arrayFiles[0];
                }
              } else {
                this.photosProducArray = [];
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
    /* cancelamos las subcripciones del servicio */
    this.changeArray?.unsubscribe();
    this.ArrayDelate?.unsubscribe();
  }
  prepareForm(action: string, producto?: any) {
    this.modalMode = action;
    this.photosProducArray = [];
    this.filesfinalCreate = [];
    this.codigoProducto = -1;
    this.form.reset();
    this.formInit();
    if (action == 'update') {
      this.codigoProducto = Number(producto.codigo!);
      this.nombreProducto?.setValue(producto.nombreProducto);
      this.descripcion?.setValue(producto.descripcion);
      this.precio?.setValue(Number(producto.precio));
    }
  }
  formInit() {
    this.nombreProducto?.setValue('');
    this.descripcion?.setValue('');
    this.precio?.setValue(null);
    this.photosProducArray = [];
    this.filesfinalCreate = [];
    /*   this.showErrorNotImageSelected = false; */
  }
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  addProducto() {
    this.loading = true;
    if (!this.form.valid /* || this.filesfinalCreate.length == 0 */) {
      this.form.markAllAsTouched();
      /*     if (this.filesfinalCreate.length == 0) {
        this.showErrorNotImageSelected = true;
      } */
      console.log('Faltan datos');
      this.loading = false;
      return;
    }
    /* this.showErrorNotImageSelected = false; */
    this.form.disable();
    let newProducto = {
      nombreProducto: this.nombreProducto?.value,
      descripcion: this.descripcion?.value,
      precio: this.precio?.value,
    };
    this.proveedorService.addProducto(newProducto).subscribe(
      (response) => {
        this.codigoProducto = response.body.message.insertId;
        this.loadPhotos(this.filesfinalCreate);
        this.loadingphoto = true;
      },
      (err) => {
        this.goBack();
        this.form.enable();
        this.loading = false;
      }
    );
  }
  updateProducto() {
    this.loading = true;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    let newProducto = {
      nombreProducto: this.nombreProducto?.value,
      descripcion: this.descripcion?.value,
      precio: this.precio?.value,
    };
    this.form.disable();
    this.proveedorService
      .updateProducto(newProducto, Number(this.producto.codigo))
      .subscribe(
        (response) => {
          this.filesfinalCreate = [];
          this.photosProducArray = [];
          this.loading = false;
          this.form.enable();
          this.goBack();
        },
        (err) => {
          this.filesfinalCreate = [];
          this.photosProducArray = [];
          this.form.enable();
          this.loading = false;
          this.goBack();
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
      let arrayFotos = this.photosProducArray;
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
        let fileNameBase = '/productos/' + 'prod-' + this.authUserId + '-';
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
        this.photosProducArray = [];
        this.photosProducArray = this.photosProducArray.concat(arrayFotos);
        this.photosUpdate();
      } catch (err) {}
    } else if (this.modalMode == 'update') {
      try {
        const compressedFiles =
          await this.compressImageSizeService.handleImageArrayUpload(event);
        let fileNameBase = '/productos/' + 'prod-' + this.authUserId + '-';
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
        this.photosProducArray = this.photosProducArray.concat(arrayFotos);
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
      this.proveedorService
        .updatePhotosProducto(this.codigoProducto, {
          arrayFotos: this.photosProducArray,
        })
        .subscribe(
          (response) => {
            this.filesfinalCreate = [];
            this.form.enable();
            this.goBack();
            this.loading = false;
          },
          (err) => {
              this.filesfinalCreate = [];
              this.form.enable();
              this.goBack();
              this.loading = false;
            console.log(err);
          }
        );
    } else {
      this.proveedorService
        .updatePhotosProducto(this.codigoProducto, {
          arrayFotos: this.photosProducArray,
        })
        .subscribe(
          (response) => {
            this.filesfinalCreate = [];
            this.loading = false;
            console.log('fotos guardadas: ');
          },
          (err) => {
            this.filesfinalCreate = [];
            this.loading = false;
            console.log(err);
          }
        );
    }
  }

  photosDelete(arraydelate: any) {
    this.proveedorService
      .updatePhotosProducto(this.codigoProducto, {
        arrayFotos: arraydelate.arrayFotosActualizadas,
      })
      .subscribe(
        (response) => {
          this.photosProducArray = arraydelate.arrayFotosActualizadas;
          this.loading = false;
          console.log('fotos guardadas: ');
        },
        (err) => {
          console.log(err);
        }
      );
  }
  goBack() {
    this.platformLocation.back();
  }
  get nombreProducto() {
    return this.form.get('nombreProducto');
  }
  get descripcion() {
    return this.form.get('descripcion');
  }
  get precio() {
    return this.form.get('precio');
  }
}

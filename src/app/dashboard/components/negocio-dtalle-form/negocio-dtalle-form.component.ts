import {
  Component,
  OnInit,
  HostListener,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { PlacesService } from 'src/app/services/places.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Subscription } from 'rxjs';
import { NegociosService } from 'src/app/services/negocios.service';
import { PlatformLocation } from '@angular/common';
import { ComunicacionEntreComponentesService } from '../../../shared/services/comunicacion-entre-componentes.service';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { limiteMapa } from '../../../../models/limiteMapaGoogle.model';
import { WhiteSpaceValidator } from 'src/app/validators/white-space.validator';
@Component({
  selector: 'app-negocio-dtalle-form',
  templateUrl: './negocio-dtalle-form.component.html',
  styleUrls: ['./negocio-dtalle-form.component.scss'],
})
export class NegocioDtalleFormComponent implements OnInit, OnDestroy {
  modalMode: string = 'update';
  negocio: any;
  photosNegocioArray: Array<string | SafeUrl> = [];
  municipios: Array<any> = [];
  departamentos: Array<any> = [];
  filesfinalCreate: any[] = [];
  loading1: boolean = false;
  loadingphoto: boolean = false;
  cargandodata: boolean = false;
  authUserId: number = -1;
  /* Mapa variables */
  noexistendatos: boolean = false;
  faltanargumentos: boolean = false;
  faltadireccion: boolean = false;
  inputOn: boolean = true;
  /* form declaraciones*/
  form: FormGroup = new FormGroup({
    nombre_negocio: new FormControl('', [
      Validators.required,
      WhiteSpaceValidator,
    ]),
    direccion: new FormControl('', [Validators.required]),
    informacion_adicional_direccion: new FormControl('', [
      Validators.required,
      WhiteSpaceValidator,
    ]),
    latitud: new FormControl(0, [Validators.required]),
    longitud: new FormControl(0, [Validators.required]),
    descripcion_negocio: new FormControl('', [
      Validators.required,
      WhiteSpaceValidator,
    ]),
    id_departamento: new FormControl(70, [Validators.required]),
    id_municipio: new FormControl('', [Validators.required]),
    corregimiento_vereda: new FormControl(''),
  });
  id_negocio!: number;
  onMapa: boolean = false;
  constructor(
    private negociosService: NegociosService,
    private places: PlacesService,
    private ar: ActivatedRoute,
    public platformLocation: PlatformLocation,
    private appModalService: AppModalService,
    private comunicacionEntreComponentesService: ComunicacionEntreComponentesService,
    private compressImageSizeService: CompressImageSizeService,
    private storage: FirebaseStorageService
  ) {}
  /* agregar esto para camcelar el subscribe de  comunicacionEntreComponentesService*/
  public changeArray!: Subscription;
  public ArrayDelate!: Subscription;
  ngOnInit(): void {
    registerLocaleData(es);
    this.negocio = this.ar.snapshot.params;
    this.modalMode = this.ar.snapshot.paramMap.get('action')!;
    this.authUserId = Number(this.ar.snapshot.paramMap.get('authUserId')!);
    this.prepareForm();
    this.loadDptos();
    /* escucha el componente que carga los files desde la modal */
    this.changeArray =
      this.comunicacionEntreComponentesService.changeArray.subscribe(
        (array) => {
          if (!this.onMapa) {
            if (array.length > 0) {
              if (this.modalMode == 'create') {
                if (array[0].length > 0) {
                  for (let index = 0; index < array[0].length; index++) {
                    const element = array[0][index];
                    this.photosNegocioArray = array[0];
                  }
                } else {
                  this.photosNegocioArray = [];
                }
                for (let index = 0; index < array[1].length; index++) {
                  const element = array[1][index];
                  this.filesfinalCreate.push(element);
                }
                for (let index = 0; index < array[2].length; index++) {
                  const element = array[2][index];
                  this.filesfinalCreate.splice(element, 1);
                }
              } else if (this.modalMode == 'update') {
                this.loadPhotos(array);
              }
            }
          } else {
            console.log(array);
            this.latitud?.setValue(array[0].latitud);
            this.longitud?.setValue(array[0].longitud);
            this.direccion?.setValue(array[0].direccion);
            this.idMunic?.setValue(array[0].id_municipio);
            this.closeMap();
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

  addNegocio() {
    this.loading1 = true;
    if (!this.form.valid) {
      if (this.form.getRawValue().direccion == '') {
        this.faltadireccion = true;
      } else {
        this.faltadireccion = false;
      }
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    if (this.form.getRawValue().direccion !== '') {
      this.form.disable();
      this.cargandodata = true;
      this.faltadireccion = false;
      this.negociosService.addNegocio(this.form.getRawValue()).subscribe(
        (response) => {
          this.id_negocio = response.body.insertId;
          if (this.filesfinalCreate.length !== 0) {
            this.loadPhotos(this.filesfinalCreate);
            this.loadingphoto = true;
          } else {
            this.loading1 = false;
            this.goBack();
          }
        },
        (err) => {
          this.goBack();
          this.form.enable();
          this.cargandodata = false;
          this.loading1 = false;
          console.log(err);
        }
      );
    } else {
      this.loading1 = false;
      this.faltadireccion = true;
    }
  }

  updateNegocio() {
    this.loading1 = true;
    if (!this.form.valid) {
      if (this.form.getRawValue().direccion == '') {
        this.faltadireccion = true;
      } else {
        this.faltadireccion = false;
      }
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    if (this.form.getRawValue().direccion !== '') {
      this.form.disable();
      this.cargandodata = true;
      this.faltadireccion = false;
      this.negociosService
        .updateNegocio(Number(this.negocio.id_negocio), this.form.getRawValue())
        .subscribe(
          (response) => {
            console.log(response);
            this.loading1 = false;
            this.goBack();
          },
          (err) => {
            this.goBack();
            this.form.enable();
            this.cargandodata = false;
            console.log(err);
            this.loading1 = false;
          }
        );
    } else {
      this.loading1 = false;
      this.faltadireccion = true;
    }
  }

  loadDptos() {
    this.places.getDepartamentos().subscribe(
      (response) => {
        this.departamentos = response.data;
        this.idDpto?.setValue(70);
        this.idDpto?.disable();
        this.loadMunic();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  loadMunic() {
    this.places.getMunicipiosDepartamentos(this.idDpto?.value).subscribe(
      (response) => {
        this.municipios = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }
  initForm() {
    this.idmunicipioselec();
    this.direccion?.setValue('');
    this.latitud?.setValue(0);
    this.longitud?.setValue(0);
    this.descripcion?.setValue('');
    this.idDpto?.setValue(70);
    this.idMunic?.setValue(null);
  }
  prepareForm() {
    this.faltanargumentos = false;
    this.faltadireccion = false;
    this.id_negocio = -1;
    this.form.reset();
    this.initForm();
    this.idDpto?.setValue(70);
    if (this.modalMode == 'update') {
      this.negociosService.detail(Number(this.negocio.id_negocio)).subscribe(
        (response) => {
          let negocio = response.data[0];
          this.photosNegocioArray = response.data[0].fotos_negocio;
          this.id_negocio = negocio.id_negocio;
          this.nombreNegocio?.setValue(negocio.nombre_negocio);
          this.direccion?.setValue(negocio.direccion);
          this.infoAdicionalDir?.setValue(
            negocio.informacion_adicional_direccion
          );
          this.latitud?.setValue(negocio.latitud);
          this.longitud?.setValue(negocio.longitud);
          this.descripcion?.setValue(negocio.descripcion_negocio);
          this.idDpto?.setValue(negocio.id_departamento);
          this.idMunic?.setValue(negocio.id_municipio);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  goBack() {
    this.platformLocation.back();
  }
  /* Funciones necesarias para el mapa y escoger direccion */
  idmunicipioselec() {
    if (this.modalMode == 'update') {
      this.places
        .getMunicipioById(this.form.get('id_municipio')?.value)
        .subscribe(
          (response) => {
            if (response.data != 0) {
              if (
                this.form.get('id_municipio')?.value !==
                Number(this.negocio.id_municipio)
              ) {
                this.latitud?.setValue(response.data[0].latitud);
                this.longitud?.setValue(response.data[0].longitud);
                this.direccion?.setValue('');
                this.verMapaDireccion();
                this.faltadireccion = true;
              } else {
                this.latitud?.setValue(response.data[0].latitud);
                this.longitud?.setValue(response.data[0].longitud);
                this.direccion?.setValue('');
                this.verMapaDireccion();
                this.faltadireccion = true;
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else if (this.modalMode == 'create') {
      this.faltanargumentos = false;
      this.places
        .getMunicipioById(this.form.get('id_municipio')?.value)
        .subscribe(
          (response) => {
            if (response.data != 0) {
              this.latitud?.setValue(response.data[0].latitud);
              this.longitud?.setValue(response.data[0].longitud);
              this.direccion?.setValue('');
              this.verMapaDireccion();
              this.faltadireccion = true;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  closeMap() {
    this.appModalService.CloseGoogleMapGeneralModal();
  }
  verMapaDireccion() {
    this.onMapa = true;
    this.faltadireccion = false;
    if (this.modalMode == 'update') {
      let modalheadergooglemap = false;
      let mapaSeach = true;
      let limiteMapa: limiteMapa = {
        limite: 'Sucre',
        nivDivAdm: 'Departamento',
        id_departamento: 70,
      };
      let atributos = {
        longAndLat: {
          lat: this.form.getRawValue().latitud,
          lng: this.form.getRawValue().longitud,
        },
      };
      this.platformLocation.onPopState(() => {
        this.appModalService.CloseGoogleMapGeneralModal();
      });
      this.appModalService
        .GoogleMapModalGeneral(
          atributos,
          modalheadergooglemap,
          '',
          mapaSeach,
          limiteMapa
        )
        .then((result) => {
          this.onMapa = false;
          if (this.form.getRawValue().direccion == '') {
            this.faltadireccion = true;
            this.latitud?.setValue(0);
            this.longitud?.setValue(0);
            this.idMunic?.setValue(null);
          } else {
            this.faltadireccion = false;
          }
        })
        .catch((result) => {
          this.onMapa = false;
          if (this.form.getRawValue().direccion == '') {
            this.faltadireccion = true;
            this.latitud?.setValue(0);
            this.longitud?.setValue(0);
            this.idMunic?.setValue(null);
          } else {
            this.faltadireccion = false;
          }
        });
    } else if (this.modalMode == 'create') {
      if (
        this.form.getRawValue().latitud !== 0 &&
        this.form.getRawValue().longitud !== 0
      ) {
        this.faltanargumentos = false;
        let modalheadergooglemap = false;
        let mapaSeach = true;
        let limiteMapa: limiteMapa = {
          limite: 'Sucre',
          nivDivAdm: 'Departamento',
          id_departamento: 70,
        };
        let atributos = {
          longAndLat: {
            lat: this.form.getRawValue().latitud,
            lng: this.form.getRawValue().longitud,
          },
        };
        this.platformLocation.onPopState(() => {
          this.appModalService.CloseGoogleMapGeneralModal();
        });
        this.appModalService
          .GoogleMapModalGeneral(
            atributos,
            modalheadergooglemap,
            '',
            mapaSeach,
            limiteMapa
          )
          .then((result) => {
            this.onMapa = false;
            if (this.form.getRawValue().direccion == '') {
              this.faltadireccion = true;
              this.latitud?.setValue(0);
              this.longitud?.setValue(0);
              this.idMunic?.setValue(null);
            } else {
              this.faltadireccion = false;
            }
          })
          .catch((result) => {
            this.onMapa = false;
            if (this.form.getRawValue().direccion == '') {
              this.faltadireccion = true;
              this.latitud?.setValue(0);
              this.longitud?.setValue(0);
              this.idMunic?.setValue(null);
            } else {
              this.faltadireccion = false;
            }
          });
      }
    }
  }
  /* funciones necesarias para cargar y adicionar fotos */
  @HostListener('loadPhotos')
  async loadPhotos(event: any) {
    if (this.modalMode == 'create') {
      /* Se ejecuta cuando se esta creando una granja */
      try {
        const compressedFiles =
          await this.compressImageSizeService.handleImageArrayUpload(event);
        let fileNameBase =
          '/negocios/User' +
          Number(this.authUserId) +
          '/negocio' +
          Number(this.id_negocio) +
          '/foto';
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
        this.photosNegocioArray = [];
        this.photosNegocioArray = this.photosNegocioArray.concat(arrayFotos);
        this.photosUpdate();
      } catch (err) {
        console.log(err);
      }
    } else if (this.modalMode == 'update') {
      try {
        const compressedFiles =
          await this.compressImageSizeService.handleImageArrayUpload(event);
        let fileNameBase =
          '/negocios/User' +
          Number(this.authUserId) +
          '/negocio' +
          Number(this.negocio.id_negocio) +
          '/foto';
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
        this.photosNegocioArray = this.photosNegocioArray.concat(arrayFotos);
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
    if (this.modalMode == 'update') {
      this.negociosService
        .updatePhotos(Number(this.id_negocio), this.photosNegocioArray)
        .subscribe(
          (response) => {
            console.log('fotos guardadas: ');
            console.log(response);
            this.loading1 = false;
          },
          (err) => {
            this.loading1 = false;
            console.log(err);
          }
        );
    } else if (this.modalMode == 'create') {
      /* Sube las fotos a la BD */
      this.negociosService
        .updatePhotos(Number(this.id_negocio), this.photosNegocioArray)
        .subscribe(
          (response) => {
            this.loading1 = false;
            this.goBack();
          },
          (err) => {
            this.loading1 = false;
            this.goBack();
            console.log(err);
          }
        );
    }
  }
  photosDelete(arraydelate: any) {
    this.negociosService
      .updatePhotos(Number(this.id_negocio), arraydelate.arrayFotosActualizadas)
      .subscribe(
        (response) => {
          this.photosNegocioArray = arraydelate.arrayFotosActualizadas;
          this.storage.deleteMultipleByUrls(arraydelate.arrayFotosBorradas);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  openPhotosModal() {
    this.platformLocation.onPopState(() => {
      this.appModalService.CloseModalGalleryVerAdiconarEliminarFotos();
    });
    let showconteslaider = false;
    let veryadicionar = true;
    let arrayFotos = this.photosNegocioArray;
    let filesCreate: any;
    if (this.modalMode == 'create') {
      filesCreate = this.filesfinalCreate;
    } else if (this.modalMode == 'update') {
      filesCreate = -1;
    }
    console.log(filesCreate);
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
  get idDpto() {
    return this.form.get('id_departamento');
  }

  get idMunic() {
    return this.form.get('id_municipio');
  }

  get nombreNegocio() {
    return this.form.get('nombre_negocio');
  }

  get descripcion() {
    return this.form.get('descripcion_negocio');
  }

  get direccion() {
    return this.form.get('direccion');
  }

  get infoAdicionalDir() {
    return this.form.get('informacion_adicional_direccion');
  }
  get latitud() {
    return this.form.get('latitud');
  }

  get longitud() {
    return this.form.get('longitud');
  }
}

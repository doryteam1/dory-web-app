import { Component, OnInit,
  HostListener,
  OnDestroy} from '@angular/core';
  import { FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { PlatformLocation } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import {  Subscription } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { ComunicacionEntreComponentesService } from '../../../shared/services/comunicacion-entre-componentes.service';
import { CompressImageSizeService } from 'src/app/services/compress-image-size.service';
import { limiteMapa } from '../../../../models/limiteMapaGoogle.model';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';

const _ = require('lodash');

@Component({
  selector: 'app-publicacion-detalle-form',
  templateUrl: './publicacion-detalle-form.component.html',
  styleUrls: ['./publicacion-detalle-form.component.scss']
})
export class PublicacionDetalleFormComponent implements OnInit, OnDestroy {
  formState = 'enable';
  modalMode: string = 'update';
  publicacion: any;
  file: any = null;
  inputOn: boolean = true;
  /* error: string = ''; */
  action!: string;
  especies: Array<any> = [];
  photosPublicacionArray: Array<string | SafeUrl> = [];
  municipios: Array<any> = [];
  departamentos: Array<any> = [];
  filesfinalCreate: any[] = [];
  loading1: boolean = false;
  loadingphoto: boolean = false;
  authUserId: number = -1;
  id_publicacionnew: any;
  /* Mapa variables */
  noexistendatos: boolean = false;
  /* form declaraciones*/
  form: FormGroup = new FormGroup({
    id_especie: new FormControl('', [Validators.required]),
    cantidad: new FormControl(0, [Validators.required]),
    preciokilogramo: new FormControl(0, [Validators.required]),
    id_municipio: new FormControl(null),
    usuarios_id: new FormControl(null)
  });
  onMapa: boolean = false;
  constructor(
    private publicacionesService: PublicacionesService,
    private granjasServices:GranjasService,
    private ar: ActivatedRoute,
    public platformLocation: PlatformLocation,
    private appModalService: AppModalService,
    private comunicacionEntreComponentesService: ComunicacionEntreComponentesService,
    private compressImageSizeService: CompressImageSizeService,
    private storage: FirebaseStorageService,
    private userService:UsuarioService
  ) {}
  /* agregar esto para camcelar el subscribe de  comunicacionEntreComponentesService*/
  public changeArray!: Subscription;
  public ArrayDelete!: Subscription;

  ngOnInit(): void {
    registerLocaleData(es);
    this.publicacion = this.ar.snapshot.params;
    let action = this.ar.snapshot.paramMap.get('action');
    this.formState = this.ar.snapshot.paramMap.get('formState')!;
    this.getAuthUserDetail()

    if(action == 'update'){
      this.publicacionesService.getPublicacionDetail(this.publicacion.id_publicacion).subscribe(
        (response)=>{
          let publicacionTemp = this.publicacion;
          console.log("Publicacion temp ",publicacionTemp)
          this.publicacion = response.data[0];
          this.publicacion.formState = publicacionTemp.formState;
          this.publicacion.action = publicacionTemp.action;
          this.prepareForm(action!, this.publicacion);
          this.granjasServices.getEspecies().subscribe(
            (response) => {
              this.especies = response.data;
            },
            (err) => {
              console.log(err);
            }
          );
        }
      )
    }else if(action == 'create'){
      this.prepareForm(action!, this.publicacion);
      this.granjasServices.getEspecies().subscribe(
        (response) => {
          this.especies = response.data;
        },
        (err) => {
          console.log(err);
        }
      );
    }
    



    /* escucha el componente que carga los files desde la modal */
    this.changeArray =
      this.comunicacionEntreComponentesService.changeArray.subscribe(
        (array) => {
          console.log("Array--> ",array)
            if (array.length > 0) {
              if (action == 'create') {
                if (array[0].length > 0) {
                  for (let index = 0; index < array[0].length; index++) {
                    const element = array[0][index];
                    this.photosPublicacionArray = array[0];
                    console.log("-->",this.photosPublicacionArray);
                  }
                } else {
                  this.photosPublicacionArray = [];
                }
                for (let index = 0; index < array[1].length; index++) {
                  const element = array[1][index];
                  this.filesfinalCreate.push(element);
                }
                for (let index = 0; index < array[2].length; index++) {
                  const element = array[2][index];
                  this.filesfinalCreate.splice(element, 1);
                }
              } else if (action == 'update') {
                console.log("Array enviado a loadPhotos ",array)
                console.log("tipo array loadphotos ",typeof array)
                this.loadPhotos(array);
              }
            }
        }
      );
    this.ArrayDelete =
      this.comunicacionEntreComponentesService.ArrayDelate.subscribe(
        (response:any) => {
          this.photosDelete(response);
        }
      );
  }

  async getAuthUserDetail(){
    let authUser = this.userService.getAuthUser();
    this.authUserId = authUser.sub;
    let authUserDetail = await this.userService.getUsuarioByEmail(authUser.email).toPromise();
    authUserDetail = authUserDetail?.data[0];
    this.municipio?.setValue(authUserDetail?.id_municipio)
    this.usuario?.setValue(this.authUserId)
  }
  ngOnDestroy(): void {
    /* cancelamos las subcripciones del servicio */
    this.changeArray?.unsubscribe();
    this.ArrayDelete?.unsubscribe();
  }
  addPublicacion() {
    this.loading1 = true;
    if (!this.form.valid) {
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    this.publicacionesService.addPublicacion(this.form.getRawValue()).subscribe(
      (response) => {
        this.id_publicacionnew = response.body.insertId;
        if (this.filesfinalCreate.length !== 0) {
          this.loadPhotos(this.filesfinalCreate);
          this.loadingphoto = true;
        } else {
          this.loading1 = false;
          this.goBack();
        }
      },
      (err) => {
        this.form.enable();
        this.loading1 = false;
        console.log(err);
      }
    );
  }

  updatePublicacion() {
    this.loading1 = true;
    if (!this.form.valid) {
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    this.publicacionesService
      .updatePublicacion(this.publicacion.id_publicacion, this.form.getRawValue())
      .subscribe(
        (response) => {
          this.loading1 = false;
          this.goBack();
        },
        (err) => {
          this.form.enable();
          console.log(err);
          this.loading1 = false;
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
    this.idEspecie?.setValue('');
    this.cantidad?.setValue(null);
    this.precio?.setValue(null);
  }

  prepareForm(action: string, publicacion?: any) {
    this.modalMode = action;
    this.form.reset();
    this.initForm();
    if (action == 'update') {
      this.photosPublicacionArray = publicacion.fotos;
      this.idEspecie?.setValue(Number(publicacion.id_especie_fk));
      this.cantidad?.setValue(publicacion.cantidad);
      this.precio?.setValue(publicacion.preciokilogramo);

      if (this.formState == 'disable') {
        this.form.disable();
      }
    }
  }
  goBack() {
    this.platformLocation.back();
  }

  /* funciones necesarias para cargar y adicionar fotos */
  @HostListener('loadPhotos')
  async loadPhotos(filesPhotos: any[]) {
    if (this.publicacion.action == 'create') {
      /* Se ejecuta cuando se esta creando una publicacion */
      try {
        const compressedFiles =
          await this.compressImageSizeService.handleImageArrayUpload(filesPhotos);
        let fileNameBase =
          '/publicaciones/User' +
          this.authUserId +
          '/publicacion' +
          this.id_publicacionnew +
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
        }
        this.photosPublicacionArray = [];
        this.photosPublicacionArray = this.photosPublicacionArray.concat(arrayFotos);
        this.photosUpdate();
      } catch (err) {
        console.log(err);
      }
    } else if (this.publicacion.action == 'update') {
      /* Se ejecuta cuando se esta editando una publicacion */
      try {
        const compressedFiles =
          await this.compressImageSizeService.handleImageArrayUpload(filesPhotos);
        let fileNameBase =
          '/publicaciones/User' +
          this.authUserId +
          '/publicacion' +
         this.publicacion.id_publicacion +
          '/foto';
        let files: Array<any> = compressedFiles;
        let arrayFotos: Array<string> = [];
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
        }
        this.photosPublicacionArray = this.photosPublicacionArray.concat(arrayFotos);

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
    if (this.publicacion.action == 'update') {
      this.publicacionesService
        .updatePhotos(this.publicacion.id_publicacion, {
          arrayFotos: this.photosPublicacionArray,
        })
        .subscribe(
          (response) => {
            this.loading1 = false;
          },
          (err) => {
            console.log(err);
          }
        );
    } else if (this.publicacion.action == 'create') {
      /* Sube las fotos a la BD */
      this.publicacionesService
        .updatePhotos(this.id_publicacionnew, {
          arrayFotos: this.photosPublicacionArray,
        })
        .subscribe(
          (response) => {
            this.loading1 = false;
            this.goBack();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  photosDelete(newPhotos: any) {
    this.publicacionesService
      .updatePhotos(this.publicacion.id_publicacion, {
        arrayFotos: newPhotos.arrayFotosActualizadas,
      })
      .subscribe(
        (response) => {
          this.photosPublicacionArray = newPhotos.arrayFotosActualizadas;
          this.storage.deleteMultipleByUrls(newPhotos.arrayFotosBorradas);
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
    let arrayFotos = this.photosPublicacionArray;
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

  get idEspecie() {
    return this.form.get('id_especie');
  }

  get cantidad() {
    return this.form.get('cantidad');
  }

  get precio() {
    return this.form.get('preciokilogramo');
  }

  get municipio(){
    return this.form.get('id_municipio');
  }

  get usuario(){
    return this.form.get('usuarios_id');
  }
}


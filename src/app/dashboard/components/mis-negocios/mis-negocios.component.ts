import { Component, OnInit ,  ElementRef,
  ViewChild, } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { DomSanitizer} from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MapGeocoder } from '@angular/google-maps';
import { ConfirmModalMapService } from '../../../shared/services/confirm-modal-map.service';
import { vertices } from '../../../global/constants';
import { NegociosService } from 'src/app/services/negocios.service';
const _ = require('lodash');

@Component({
  selector: 'app-mis-negocios',
  templateUrl: './mis-negocios.component.html',
  styleUrls: ['./mis-negocios.component.scss']
})
export class MisNegociosComponent implements OnInit {
  @ViewChild('myselecmunicipio') myselecmunicipio!: ElementRef;
  @ViewChild('map') map: any;
  @ViewChild('fileInput') inputFileDialog!: ElementRef;
  negocios: Array<any> = [];
  showNotFound: boolean = false;
  indicenegocio!: number;
  guarlatlog: boolean = false;
  noexistendatos: boolean = false;
  buscarx: string = '';
  fueraDirecion: boolean = false;
  loadingseart: boolean = false;
  borrarseart: boolean = false;
  valorbuscarx: string = '';
  p!: number;
  tempDir:string = '';
  tempMunicId:number = -1;
  firstTimeOpenModal = true;
  form: FormGroup = new FormGroup({
    nombre_negocio: new FormControl(''),
    direccion: new FormControl('', [Validators.required]),
    informacion_adicional_direccion:new FormControl('',),
    latitud: new FormControl(0),
    longitud: new FormControl(0),
    descripcion_negocio: new FormControl(''),
    id_departamento: new FormControl(70, [Validators.required]),
    id_municipio: new FormControl('', [Validators.required]),
    corregimiento_vereda: new FormControl('')
  });
  file: any = null;
  productImagePath: string = '';
  itemUpdateIndex: number = -1;
  modalMode: string = 'create';
  municipios: Array<any> = [];
  departamentos: Array<any> = [];
  loading1: boolean = false;
  loading2: boolean = false;
  loading3: boolean = false;
  apiLoaded: Observable<boolean>;
  infraestructurasData: Array<any> = [];
  especiesData: Array<any> = [];
  authUserId: number = -1;
  vertices = vertices;
  options: google.maps.MapOptions = {
    scrollwheel: true,
    center: { lat: 0, lng: 0 },
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  optionPoli: google.maps.PolylineOptions = {
    strokeColor: '#494949',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    visible: true,
  };
  photosNegocioArray: Array<string> = [];
  photosNegocioArrayCopy: Array<string> = [];
  photosNegocioUrlToDel: Array<string> = [];
  isPhotoSelectingToDel: boolean = false;
  indexSelectedToDel: Array<number> = [];
  showNotFoundPhotos: boolean = false;
  timeLapsed1: number = 0;

  constructor(
    private negociosService: NegociosService,
    private modalService: NgbModal,
    private storage: FirebaseStorageService,
    private sanitizer: DomSanitizer,
    private places: PlacesService,
    private appModalService: AppModalService,
    httpClient: HttpClient,
    private geocoder: MapGeocoder,
    private confirmModalMapService: ConfirmModalMapService
  ) {
    this.apiLoaded = httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=' + environment.doryApiKey,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    this.negociosService.getNegociosByUserId(payload.sub).subscribe(
      (respose) => {
        this.negocios = respose.data;
        if (this.negocios.length < 1) {
          this.showNotFound = true;
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.loadDptos();
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

  idmunicipioselec() {
    this.direccion?.setValue('');
    if(this.idMunic?.value == this.tempMunicId){
      this.direccion?.setValue(this.tempDir);
      console.log("temp dir ",this.tempDir)
    }else if(!this.firstTimeOpenModal){
      this.verMap();
    }
  }

  openModal(content: any, action: string, negocio?: any) {
    this.modalMode = action;
    this.form.reset();
    this.initForm();
    this.idDpto?.setValue(70);
    if (action == 'update') {
      this.nombreNegocio?.setValue(negocio.nombre_negocio);
      this.direccion?.setValue(negocio.direccion);
      this.infoAdicionalDir?.setValue(negocio.informacion_adicional_direccion);
      this.latitud?.setValue(negocio.latitud);
      this.longitud?.setValue(negocio.longitud);
      this.descripcion?.setValue(negocio.descripcion_negocio);
      this.idDpto?.setValue(negocio.id_departamento);
      this.idMunic?.setValue(negocio.id_municipio);
      this.itemUpdateIndex = this.negocios.findIndex((element)=>element.id_negocio == negocio.id_negocio);
      this.tempDir = this.direccion?.value;
      this.tempMunicId = this.idMunic?.value;
    }
    this.modalService
      .open(content)
      .result.then((result) => {
        console.log('se cerro modal ', result);
        this.firstTimeOpenModal = true;
      })
      .catch((err) => {
        this.file = null;
        this.productImagePath = '';
        console.log(err);
        this.firstTimeOpenModal = true;
      });
      this.firstTimeOpenModal = false;
  }

  addNegocio() {
    console.log('addNegocio');
    console.log(this.form.getRawValue());
    console.log(this.form.controls);
    this.loading1 = true;
    if (!this.form.valid) {
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }

    this.negociosService.addNegocio(this.form.getRawValue()).subscribe(
      (response) => {
        let nuevoNegocio = _.clone(this.form.getRawValue());
        nuevoNegocio.id_negocio = response.body.insertId;
        let indexMunc = this.municipios.findIndex((municipio)=>{
          return municipio.id_municipio == nuevoNegocio.id_municipio;
        })
        nuevoNegocio.nombre_municipio = this.municipios[indexMunc].nombre;
        let indexDepto = this.departamentos.findIndex((dpto)=>{
          return dpto.id_departamento == nuevoNegocio.id_departamento;
        })
        nuevoNegocio.nombre_departamento = this.departamentos[indexDepto].nombre_departamento;
        this.loading1 = false;
        console.log(nuevoNegocio)
        this.negocios.push(nuevoNegocio);
        this.modalService.dismissAll();
        //this.verMap(this.negocios.length - 1);
      },
      (err) => {
        this.loading1 = false;
        console.log(err);
      }
    );
  }

  fileChange(event: any) {
    console.log('change', event);
    this.file = event.target.files[0];
    /* let productImagePath:any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]))
    console.log(productImagePath.changingThisBreaksApplicationSecurity) */
    //this.productImagePath = productImagePath.changingThisBreaksApplicationSecurity;
  }

  deleteNegocio(negocio:any) {
    this.appModalService
      .confirm(
        'Eliminar negocio',
        'Esta seguro que desea eliminar este negocio',
        'Eliminar',
        'No estoy seguro',
        negocio.nombre
      )
      .then((result) => {
        if (result == true) {
          this.negociosService.deleteNegocio(negocio.id_negocio).subscribe(
            (response: any) => {
              let index = this.negocios.findIndex((element)=> element.id_negocio == negocio.id_negocio)
              this.negocios.splice(index, 1);
            },
            (err) => {
              console.log(err);
            }
          );
        }
      })
      .catch((result) => {});
  }

  updateNegocio() {
    this.loading1 = true;
    if (!this.form.valid) {
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }

    this.negociosService
      .updateNegocio(
        this.negocios[this.itemUpdateIndex].id_negocio,
        this.form.getRawValue()
      )
      .subscribe(
        (response) => {
          console.log(response);
          this.loading1 = false;

          window.location.reload();
          this.modalService.dismissAll();
        },
        (err) => {
          console.log(err);
          this.loading1 = false;
        }
      );
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

  changeDpto() {
    this.form.get('id_municipio')?.setValue(0);
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

  onCheckboxChange(e: any, controlName: string) {
    const checkArray: FormArray = this.form.get(controlName) as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach(
        (
          item: AbstractControl,
          i: number,
          controls: Array<AbstractControl>
        ) => {
          if (item.value == e.target.value) {
            checkArray.removeAt(i);
            return;
          }
          i++;
        }
      );
    }
  }

  isChecked(controlName: string, value: number) {
    let checked: boolean = false;
    const checkArray: FormArray = this.form.get(controlName) as FormArray;
    checkArray.controls.forEach(
      (item: AbstractControl, i: number, controls: Array<AbstractControl>) => {
        if (item.value == value) {
          checked = true;
        }
      }
    );
    return checked;
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

  get infoAdicionalDir(){
    return this.form.get('informacion_adicional_direccion');
  }
  get latitud() {
    return this.form.get('latitud');
  }

  get longitud() {
    return this.form.get('longitud');
  }


  verMap(negocio?: any) {
    if(negocio){
      let index = this.negocios.findIndex((element)=>element.id_negocio == negocio.id_negocio)
      this.indicenegocio = index!;
    }
    
    this.modalService
      .open(this.map, { size: 'xl', centered: true, windowClass: 'dark-modal' })
      .result.then((result) => {
        console.log('se cerro modal ', result);
        this.buscarx = '';
      })
      .catch((err) => {
        console.log(err);
        this.buscarx = '';
      });

    if(!negocio){
      this.indicenegocio = -1;
      let idMunicipio = this.idMunic?.value;
      let indexMunc = this.municipios.findIndex((element)=>element.id_municipio == idMunicipio)
      console.log("indexMunc ",indexMunc)
      console.log("idMunic ",idMunicipio)
      if(indexMunc != -1){
        let municipioNombre = this.municipios[indexMunc].nombre;
        this.buscarx = municipioNombre;
        this.buscar();
        console.log("buscar....")
      }
      return;
    }

    const sucreColombia = {
      north: 10.184454,
      south: 8.136442,
      west: -75.842392,
      east: -74.324908,
    };
    this.markerPosition = {
      lat: parseFloat(negocio.latitud),
      lng: parseFloat(negocio.longitud),
    };

    this.options = {
      center: {
        lat: parseFloat(negocio.latitud),
        lng: parseFloat(negocio.longitud),
      },
      restriction: {
        latLngBounds: sucreColombia,
        strictBounds: false,
      },
      zoom: 14,
      scrollwheel: true,
    };
    this.buscarx = '';
  }

  buscar() {
    this.loadingseart = true;
    const valor = this.buscarx;
    this.valorbuscarx = this.buscarx;
    if (valor.trim().length == 0) {
      this.loadingseart = false;
      return;
    }

    this.geocoder
      .geocode({
        address: `${valor}`,
      })
      .subscribe(({ results }) => {
        console.log(results);
        if (results.length === 0) {
          this.loadingseart = false;
          this.noexistendatos = true;
          this.fueraDirecion = false;
          setTimeout(() => {
            this.noexistendatos = false;
          }, 10000);
        } else {
          this.loadingseart = false;
          this.fueraDirecion = false;
          const point: google.maps.LatLngLiteral = {
            lat: results[0].geometry.location.toJSON().lat!,
            lng: results[0].geometry.location.toJSON().lng!,
          };

          this.places.geocodeLatLng(point).then((response) => {
            if (response.status == 'OK') {
              let result = response.results[0].address_components;
              let index = result.findIndex((element) =>
                element.types.includes('administrative_area_level_1')
              );
              let dpto = result[index].short_name;
              index = result.findIndex((element) =>
                element.types.includes('administrative_area_level_2')
              );
              index = this.departamentos.findIndex(
                (element) => element.nombre_departamento == dpto
              );
              if (dpto == 'Sucre') {
                if (
                  results[0].geometry.location.toJSON().lat! &&
                  results[0].geometry.location.toJSON().lng!
                ) {
                  this.options = {
                    center: {
                      lat: results[0].geometry.location.toJSON().lat!,
                      lng: results[0].geometry.location.toJSON().lng!,
                    },
                    zoom: 13,
                  };
                }
              } else {
                this.loadingseart = false;
                this.fueraDirecion = true;
                this.noexistendatos = false;
                setTimeout(() => {
                  this.fueraDirecion = false;
                }, 5000);
              }
            }
          });
        }
      });
  }
  borrarBusqueda() {
    this.buscarx = '';
    this.borrarseart = false;
    this.fueraDirecion = false;
    this.noexistendatos = false;
  }
  onKey(event: any) {
    if (event.target.value !== '') {
      this.borrarseart = true;
    } else if (event.target.value == '') {
      this.borrarseart = false;
    }
  }
  // Metodo para adicionar una marca en el mapa
  addMarker(event: google.maps.MapMouseEvent) {
    this.guarlatlog = false;
    const point: google.maps.LatLngLiteral = {
      lat: event.latLng?.toJSON().lat!,
      lng: event.latLng?.toJSON().lng!,
    };
    this.places.geocodeLatLng(point).then((response) => {
      if (response.status == 'OK') {
        console.log(response);
        console.log(this.municipios);
        let result = response.results[0].address_components;
        console.log('administrative_area_level_1');
        let index = result.findIndex((element) =>
          element.types.includes('administrative_area_level_1')
        );
        console.log(`departamento indice${index}`);
        let dpto = result[index].short_name;
        console.log(`departamento ${dpto}`);
        /* municipio */
        console.log('administrative_area_level_2');
        index = result.findIndex((element) =>
          element.types.includes('administrative_area_level_2')
        );
        console.log(`municipio indice ${index}`);
        let municipio = result[index].short_name;
        console.log(`municipio ${municipio}`);
        /*  index = this.departamentos.findIndex(
          (element) => element.nombre_departamento == dpto
        );
        let idDpto = this.departamentos[index]?.id_departamento; */
        /* id munisipio */
        index = this.municipios.findIndex(
          (element) => element.nombre == municipio
        );
        console.log(`munisipio indice id ${index}`);
        let idMunipio = this.municipios[index]?.id_municipio;
        console.log(`munisipio id ${idMunipio}`);

        if (dpto == 'Sucre') {
          this.markerPosition = {
            lat: event.latLng!.toJSON().lat,
            lng: event.latLng!.toJSON().lng,
          };
          this.negocios[this.indicenegocio!];
          this.fueraDirecion = false;

          this.confirmModalMapService
            .confirm(
              '../../../../assets/icons/editar.svg',
              '../../../../assets/icons/save.svg',
              'Actualizar  mi ubicación',
              'Estás a punto de cambiar tu ubicación, ¿estás seguro de realizar este cambio?',
              'Si',
              'No estoy seguro'
            )
            .then((result) => {
              console.log(result);
              if (result == true) {
                if(this.indicenegocio == -1){
                  this.direccion?.setValue(response.results[0].formatted_address);
                  this.idMunic?.setValue(idMunipio)
                }else{
                  this.negociosService
                  .updateParcialNegocio(this.negocios[this.indicenegocio!].id_negocio, {
                    latitud: event.latLng!.toJSON().lat,
                    longitud: event.latLng!.toJSON().lng,
                    id_municipio:idMunipio,
                    direccion: response.results[0].formatted_address
                  })
                  .subscribe(
                    (response) => {
                      console.log(response);
                      this.tempDir = this.direccion?.value;
                      this.tempMunicId = this.idMunic?.value;
                      window.location.reload();
                    },
                    (err) => {
                      this.guarlatlog = true;
                      setTimeout(() => {
                        this.guarlatlog = false;
                      }, 5000);
                      console.log(err);
                    }
                  );
                }
              } else {
                this.markerPosition = {
                  lat: parseFloat(this.negocios[this.indicenegocio!].latitud),
                  lng: parseFloat(this.negocios[this.indicenegocio!].longitud),
                };
              }
            })
            .catch((result) => {});
        } else {
          this.noexistendatos = false;
          this.fueraDirecion = true;
          setTimeout(() => {
            this.fueraDirecion = false;
          }, 5000);
        }
      }
    });
  }

  async loadPhotos(event: any) {
    this.loading2 = true;
    try {
      let fileNameBase =
        '/negocios/User' +
        this.authUserId +
        '/negocio' +
        this.negocios[this.itemUpdateIndex].id_negocio +
        '/foto';
      let files: Array<any> = event.target.files;
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
      this.photosNegocioArray = this.photosNegocioArray.concat(arrayFotos);
      if (this.photosNegocioArray.length < 1) {
        this.showNotFoundPhotos = true;
      } else {
        this.showNotFoundPhotos = false;
      }
      this.loading2 = false;
      this.photosUpdate();
    } catch (err) {
      this.loading2 = false;
    }
  }

  openAddFileDialog() {
    const element: HTMLElement = this.inputFileDialog.nativeElement;
    element.click();
  }

  openPhotosModal(content: any, negocio:any) {
    let index = this.negocios.findIndex((element)=>element.id_negocio == negocio.id_negocio);
    this.itemUpdateIndex = index;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-photo',
      })
      .result.then(
        (result) => {
          console.log(result);
        },
        (reason) => {
          console.log(reason);
        }
      );
    this.photosNegocioArray = [];
    this.loading1 = true;

    this.photosNegocioArray = this.negocios[index].fotos;
    console.log("arrayFotosNegocio ",this.photosNegocioArray)
    if(this.photosNegocioArray.length == 0){
      this.showNotFoundPhotos = true;
    }else{
      this.showNotFound = false;
    }

    this.loading1 = false;
    this.negociosService.detail(this.negocios[index].id_negocio)
      .subscribe(
        (response) => {
          this.photosNegocioArray = response.data[0].fotos_negocio;
          this.loading1 = false;
          this.showNotFoundPhotos = false;
          if (this.photosNegocioArray.length < 1) {
            this.showNotFoundPhotos = true;
          }
        },
        (err) => {
          this.loading1 = false;
          this.showNotFoundPhotos = false;
        }
      );
  }

  photosUpdate() {
    this.loading2 = true;
    this.negociosService
      .updatePhotos(this.negocios[this.itemUpdateIndex].id_negocio, this.photosNegocioArray)
      .subscribe(
        (response) => {
          this.loading2 = false;
          console.log(response);
        },
        (err) => {
          this.loading2 = false;
          console.log(err);
        }
      );
  }

  onLongPressing(event: number) {
    console.log(event);
  }

  onLongPress() {
    this.isPhotoSelectingToDel = true;
  }

  onReleasePressing() {}

  abortDeleting() {
    this.isPhotoSelectingToDel = false;
    this.photosNegocioUrlToDel = [];
  }

  addPhotoToDel(photoUrl: string) {
    if (!this.isPhotoSelectingToDel) {
      return;
    }
    let i = this.photosNegocioUrlToDel.indexOf(photoUrl);
    if (i > -1) {
      this.photosNegocioUrlToDel.splice(i, 1);
    } else {
      this.photosNegocioUrlToDel.push(photoUrl);
    }
  }

  isPhotoIncludeToDelete(photoUrl: string) {
    return this.photosNegocioUrlToDel.includes(photoUrl);
  }

  photosDelete() {
    this.loading3 = true;
    console.log(this.photosNegocioArray);
    this.photosNegocioArrayCopy = this.photosNegocioArray.slice(0);
    this.photosNegocioUrlToDel.forEach((photo) => {
      let index = this.photosNegocioArrayCopy.indexOf(photo);
      if (index > -1) {
        this.photosNegocioArrayCopy.splice(index, 1);
      }
    });
    console.log(this.photosNegocioArrayCopy);
    this.negociosService
      .updatePhotos(this.negocios[this.itemUpdateIndex].id_negocio,this.photosNegocioArrayCopy)
      .subscribe(
        (response) => {
          this.photosNegocioArray = this.photosNegocioArrayCopy;
          this.photosNegocioUrlToDel = [];
          this.isPhotoSelectingToDel = false;
          this.loading3 = false;
          if (this.photosNegocioArray.length < 1) {
            this.showNotFoundPhotos = true;
          }
        },
        (err) => {
          console.log(err);
          this.loading3 = false;
        }
      );
  }
}

import { Component, OnInit ,  ElementRef,
  ViewChild, } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { ConfirmModalService } from 'src/app/shared/services/confirm-modal.service';
import { Utilities } from 'src/app/utilities/utilities';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MapGeocoder } from '@angular/google-maps';
import { ConfirmModalMapService } from '../../../shared/services/confirm-modal-map.service';
import { vertices } from '../../../global/constants';

@Component({
  selector: 'app-mis-granjas',
  templateUrl: './mis-granjas.component.html',
  styleUrls: ['./mis-granjas.component.scss']
})
export class MisGranjasComponent implements OnInit {
  @ViewChild('myselecmunicipio') myselecmunicipio!: ElementRef;
  granjas:Array<any> = [];
  showNotFound:boolean = false;
  indicegranja!: number;
  guarlatlog: boolean=false;
  form:FormGroup = new FormGroup({
    nombre_granja:new FormControl('',[Validators.required]),
    area:new FormControl(0,[Validators.required]),
    numero_trabajadores:new FormControl(0,[Validators.required]),
    produccion_estimada_mes:new FormControl(0,[Validators.required]),
    direccion:new FormControl('',[Validators.required]),
    latitud:new FormControl(0,[Validators.required]),
    longitud:new FormControl(0,[Validators.required]),
    descripcion:new FormControl('',[Validators.required]),
    id_departamento:new FormControl(70,[Validators.required]),
    id_municipio:new FormControl('',[Validators.required]),
    id_vereda:new FormControl(0),
    id_corregimiento:new FormControl(0),
    corregimiento_vereda:new FormControl(''),
    arrayTiposInfraestructuras:new FormArray([]),
    arrayEspecies:new FormArray([]),
  });
  file: any = null;
  productImagePath: string = '';
  itemUpdateIndex: number = -1;
  modalMode: string = 'create';
  municipios: Array<any> = [];
  departamentos: Array<any> = [];
  loading: boolean = false;
  apiLoaded: Observable<boolean>;
  infraestructurasData:Array<any> = [];
  especiesData:Array<any> = [];
  vertices = vertices;
  constructor(
    private granjaService: GranjasService,
    private modalService: NgbModal,
    private storage: FirebaseStorageService,
    private sanitizer: DomSanitizer,
    private places: PlacesService,
    private confirmModalService: ConfirmModalService,
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

    this.granjaService.getGranjaByUserId(payload.sub).subscribe(
      (respose) => {
        this.granjas = respose.data;
        if(this.granjas.length < 1){
          this.showNotFound = true;
        }
      },err=>{
        console.log(err)
      }
    )

    this.loadDptos();

    this.granjaService.getInfraestructuras().subscribe(
      (response)=>{
        this.infraestructurasData = response.data;
      },err=>{
        console.log(err)
      }
    )

    this.granjaService.getEspecies().subscribe(
      (response)=>{
        this.especiesData = response.data;
      },err=>{
        console.log(err)
      }
    )
    /* mi codigo */
    const sucreColombia = {
      north: 10.184454,
      south: 8.136442,
      west: -75.842392,
      east: -74.324908,
    };
    this.options = {
      restriction: {
        latLngBounds: sucreColombia,
        strictBounds: false,
      },
    };
    /* fin */
  }

  initForm(){
    this.idmunicipioselec()
    this.nombreGranja?.setValue('');
    this.area?.setValue(0)
    this.numeroTrabajadores?.setValue(0);
    this.prodEstimadaMes?.setValue(0);
    this.direccion?.setValue('');
    this.latitud?.setValue(0);
    this.longitud?.setValue(0);
    this.descripcion?.setValue('');
    this.idDpto?.setValue(70);
    this.idMunic?.setValue(null);
    this.idVereda?.setValue(0);
    this.idCorregimiento?.setValue(0);
    this.corregimiento_vereda?.setValue('')
    this.infraestructuras.clear();
    this.especies.clear();
  }
/* mi codigo */
idmunicipioselec(){
   if(this.modalMode == 'update'){
     console.log(this.modalMode)
       this.places.getMunicipioById( this.form.get('id_municipio')?.value).subscribe(
         (response) => {
              if (response.data != 0) {
              if (this.form.get('id_municipio')?.value !== this.granjas[this.itemUpdateIndex ].id_municipio) {
                console.log("id no es igual")
                console.log(this.latitud?.value)
                console.log(this.longitud?.value)
                this.latitud?.setValue(response.data[0].latitud);
                this.longitud?.setValue(response.data[0].longitud);
              }else{
                this.latitud?.setValue(this.granjas[this.itemUpdateIndex].latitud);
                this.longitud?.setValue(this.granjas[this.itemUpdateIndex].longitud);
              }
           }
          },
         (err) => {
          console.log(err);
          }
           )

   }else if(this.modalMode == 'create'){
      console.log(this.modalMode)
       this.places.getMunicipioById(this.form.get('id_municipio')?.value).subscribe(
         (response) => {
              if (response.data != 0) {

                this.latitud?.setValue(response.data[0].latitud);
                this.longitud?.setValue(response.data[0].longitud);

           }
          },
         (err) => {
          console.log(err);
          }
           )
   }


  }
/* fin */
  openModal(content:any, action:string, i?:number){
    this.modalMode = action;
    this.form.reset()
    this.initForm();
    this.idDpto?.setValue(70);
    if(action == 'update'){
      this.granjaService.getGranjaDetalle(this.granjas[i!].id_granja).subscribe(
        (granja)=>{
          let granjaDetalle = granja.data[0];
          console.log(granjaDetalle)
          this.nombreGranja?.setValue(granjaDetalle.nombre);
          this.area?.setValue(granjaDetalle.area);
          this.numeroTrabajadores?.setValue(granjaDetalle.numero_trabajadores);
          this.prodEstimadaMes?.setValue(granjaDetalle.produccion_estimada_mes);
          this.direccion?.setValue(granjaDetalle.direccion);
          this.latitud?.setValue(granjaDetalle.latitud);
          this.longitud?.setValue(granjaDetalle.longitud);
          this.descripcion?.setValue(granjaDetalle.descripcion);
          this.idDpto?.setValue(granjaDetalle.id_departamento);
          this.idMunic?.setValue(granjaDetalle.id_municipio);
         this.idVereda?.setValue(granjaDetalle.id_vereda);
          this.idCorregimiento?.setValue(granjaDetalle.id_corregimiento);
          this.corregimiento_vereda?.setValue(granjaDetalle.corregimiento_vereda);

          if(granjaDetalle.infraestructuras && granjaDetalle.infraestructuras.length > 0){
            granjaDetalle.infraestructuras.forEach((element:any) => {
              this.infraestructuras?.push(new FormControl(element.id_infraestructura))
            });
          }

          if(granjaDetalle.especies && granjaDetalle.especies.length > 0){
            granjaDetalle.especies.forEach((element:any) => {
              this.especies?.push(new FormControl(element.id_especie))
            });
          }


        }
      )

      this.itemUpdateIndex = i!;
    }
    this.modalService
      .open(content)
      .result.then((result)=>{
        console.log("se cerro modal ",result)
      })
      .catch((err) => {
        this.file = null;
        this.productImagePath = '';
        console.log(err);
      });
  }

  addGranja() {
    console.log('addGranja');
    console.log(this.form.value);
    console.log(this.form.controls);
    this.loading = true;
    if (!this.form.valid) {
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }

    this.granjaService.addGranja(this.form.getRawValue()).subscribe(
      (response) => {
        this.loading = false;
        this.modalService.dismissAll();
        window.location.reload();
        console.log(response);
      },err => {
        this.loading = false;
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

  deleteGranja(idGranja:number, i:number){
    this.confirmModalService.confirm('Eliminar granja','Esta seguro que desea eliminar la granja','Eliminar','No estoy seguro',this.granjas[i].nombre)
    .then(
      (result)=>{
        if(result == true){
          this.granjaService.anularGranja(idGranja).subscribe(
            (response: any) => {
              this.granjas.splice(i, 1);
            },err=>{
              console.log(err)
            }
          )
          }
      })
      .catch((result) => {});
  }

  updateGranja() {
    this.loading = true;
    if(!this.form.valid){
      console.log("Not valid!")
      this.form.markAllAsTouched()
      this.loading = false;
      return;
    }

    this.granjaService
      .updateGranja(
        this.granjas[this.itemUpdateIndex].id_granja,
        this.form.getRawValue()
      )
      .subscribe(
        (response) => {
          console.log(response);
          this.loading = false;
          window.location.reload();
          this.modalService.dismissAll();
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
    //this.proveedorService.updateProducto(this.form)
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

  onCheckboxChange(e:any,controlName:string) {
    const checkArray: FormArray = this.form.get(controlName) as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: AbstractControl,i:number,controls:Array<AbstractControl>) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  isChecked(controlName:string, value:number){
    let checked:boolean =false
    const checkArray: FormArray = this.form.get(controlName) as FormArray;
    checkArray.controls.forEach((item: AbstractControl,i:number,controls:Array<AbstractControl>) => {
      if (item.value == value) {
        checked =  true;
      }
    });
    return checked;
  }

  get idDpto(){
    return this.form.get('id_departamento');
  }

  get idMunic() {
    return this.form.get('id_municipio');
  }

  get nombreGranja() {
    return this.form.get('nombre_granja');
  }

  get descripcion() {
    return this.form.get('descripcion');
  }

  get area() {
    return this.form.get('area');
  }

  get numeroTrabajadores() {
    return this.form.get('numero_trabajadores');
  }

  get prodEstimadaMes() {
    return this.form.get('produccion_estimada_mes');
  }

  get direccion() {
    return this.form.get('direccion');
  }

  get corregimiento_vereda(){
    return this.form.get('corregimiento_vereda');
  }

  get latitud() {
    return this.form.get('latitud');
  }

  get longitud() {
    return this.form.get('longitud');
  }

  get idVereda() {
    return this.form.get('id_vereda');
  }

  get idCorregimiento() {
    return this.form.get('id_corregimiento');
  }

  get infraestructuras(){
    return this.form.get('arrayTiposInfraestructuras') as FormArray;
  }

  get especies(){
    return this.form.get('arrayEspecies') as FormArray;
  }
  /* andres mi codigo */

  buscarx: string = '';
  fueraDirecion: boolean = false;
  options: google.maps.MapOptions = {
    scrollwheel: true,
    center: { lat: 0, lng: 0},
   /*  zoom: 1, */
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


  verMap(i?: number) {
    this.indicegranja = i!
    this.markerPosition = {
      lat: parseFloat(this.granjas[i!].latitud),
      lng: parseFloat(this.granjas[i!].longitud),
    };
    this.options = {
      center: {
        lat: parseFloat(this.granjas[i!].latitud),
        lng: parseFloat(this.granjas[i!].longitud),
      },
      zoom: 12,
      scrollwheel: true,
    };
    this.buscarx = '';
  }

  buscar() {
    const valor = this.buscarx;
    if (valor.trim().length == 0) {
      return;
    }
    this.geocoder
      .geocode({
        address: `${valor}`,
      })
      .subscribe(({ results }) => {
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
                /*  this.markerPosition = {
                  lat: results[0].geometry.location.toJSON().lat!,
                  lng: results[0].geometry.location.toJSON().lng!,
                };*/
              }
            } else {
              this.fueraDirecion = true;
              setTimeout(() => {
                this.fueraDirecion = false;
              }, 5000);
              this.buscarx = '';
            }
          }
        });
      });
  }
  // Metodo para adicionar una marca en el mapa
  addMarker(event: google.maps.MapMouseEvent) {
    this.guarlatlog=false
    const point: google.maps.LatLngLiteral = {
      lat: event.latLng?.toJSON().lat!,
      lng: event.latLng?.toJSON().lng!,
    };
    this.places.geocodeLatLng(point).then((response) => {
      if (response.status == 'OK') {
        console.log(response)
        console.log(this.municipios)
        let result = response.results[0].address_components;
        console.log('administrative_area_level_1')
        let index = result.findIndex((element) =>
          element.types.includes('administrative_area_level_1')
        );
          console.log(`departamento indice${index}`)
        let dpto = result[index].short_name;
        console.log(`departamento ${dpto}`)
        /* munisipio */
        console.log('administrative_area_level_2')
        index = result.findIndex((element) =>
          element.types.includes('administrative_area_level_2')
        );
        console.log(`munisipio indice ${index}`)
        let municipio = result[index].short_name;
        console.log(`munisipio ${municipio}`)
       /*  index = this.departamentos.findIndex(
          (element) => element.nombre_departamento == dpto
        );
        let idDpto = this.departamentos[index]?.id_departamento; */
       /* id munisipio */
        index = this.municipios.findIndex(
          (element) => element.nombre == municipio
        );
        console.log(`munisipio indice id ${index}`)
        let idMunipio = this.municipios[index]?.id_municipio;
         console.log(`munisipio id ${idMunipio}`)

        if (dpto == 'Sucre') {
           this.markerPosition = {
           lat: event.latLng!.toJSON().lat,
           lng: event.latLng!.toJSON().lng
          };
          this.granjas[this.indicegranja!]
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
              console.log(result)
              if (result == true) {
                this.granjaService.updateParcial(this.granjas[this.indicegranja!].id_granja,
                  {latitud:event.latLng!.toJSON().lat,
                   longitud:event.latLng!.toJSON().lng,
                   id_municipio:idMunipio,
                   direccion:response.results[0].formatted_address
                  }).subscribe(
                      (response) => {
                       console.log(response);
                       window.location.reload();
                      },
                    (err) => {
                       this.guarlatlog=true
                      setTimeout(() => {
                      this.guarlatlog=false
                      }, 5000);
                     console.log(err);
                    }

                  )
              }else{
                this.markerPosition = {
                lat: parseFloat(this.granjas[this.indicegranja!].latitud),
                lng: parseFloat(this.granjas[this.indicegranja!].longitud),
              };
              }
            })
            .catch((result) => {});
        } else {
          this.fueraDirecion = true;
          setTimeout(() => {
            this.fueraDirecion = false;
          }, 5000);
        }
      }
    });
  }
 /*  addlatlog() {
    console.log(this.form.getRawValue())
    this.granjaService
      .updateGranja(
        this.granjas[this.indicegranja].id_granja,
        this.form.getRawValue()
      )
      .subscribe(
        (response) => {
          console.log(response);
          window.location.reload();
        },
        (err) => {
          this.guarlatlog=true
          setTimeout(() => {
            this.guarlatlog=false
          }, 5000);

          console.log(err);
        }
      );
  } */
}

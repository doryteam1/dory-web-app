import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AsociacionesService } from 'src/app/asociaciones/services/asociaciones.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { Utilities } from 'src/app/utilities/utilities';
import { formatDate, Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { TipoAsocValidator } from '../../validators/tipo-asociacion.validator';

@Component({
  selector: 'app-asociacion-detalle-form',
  templateUrl: './asociacion-detalle-form.component.html',
  styleUrls: ['./asociacion-detalle-form.component.scss']
})
export class AsociacionDetalleFormComponent implements OnInit {
  formState = 'enable';
  loading1:boolean = false;
  modalMode:string = 'update';
  asociacion:any;
  file: any = null;
  error:string = '';
  previousValue:number = 0;
  form: FormGroup = new FormGroup({
    nit: new FormControl('',[Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    legalconstituida: new FormControl('', [Validators.required]),
    informacion_adicional_direccion:new FormControl('',),
    fecha_renovacion_camarac: new FormControl('',[Validators.required]),
    id_departamento: new FormControl(70, [Validators.required]),
    id_municipio: new FormControl('', [Validators.required]),
    corregimiento_vereda: new FormControl(''),
    foto_camarac: new FormControl('',[Validators.required]),
    id_tipo_asociacion_fk:new FormControl('',[Validators.required])
  });
  tiposAsociaciones: any;
  departamentos: any;
  municipios: any;
  constructor(
    private asociacionesService:AsociacionesService, 
    private storage: FirebaseStorageService,
    private places: PlacesService,
    private ar:ActivatedRoute,
    private router:Router,
    private location:Location) { }

  ngOnInit(): void {
    registerLocaleData( es );
    console.log("params ",this.ar.snapshot.params)
    this.asociacion = this.ar.snapshot.params;
    let action = this.ar.snapshot.paramMap.get('action');
    this.formState = this.ar.snapshot.paramMap.get('formState')!;
    this.prepareForm(action!,this.asociacion)
    this.loadDptos();
    this.loadTiposAsociaciones();
    this.onChangeLegalConst();
    this.idTipoAsoc?.valueChanges.subscribe((value)=>{

    })
  }

  updateAsociacion() {
    console.log("Actualizando!!")
    this.loading1 = true;

    if(this.isLegalConstituida?.value == '0' || (this.asociacion.foto_camarac && this.asociacion.foto_camarac != 'null') ){
      this.fotoCamc?.clearValidators();
      this.fotoCamc?.updateValueAndValidity();
      console.log("Se quitaron los validadores")
    }
    
    if (!this.form.valid){
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    this.fotoCamc?.setValidators([Validators.required])
    this.fotoCamc?.updateValueAndValidity();
    if(this.fotoCamc?.invalid){
      let updatedAsociacion = { ...this.form.getRawValue() }
      updatedAsociacion.foto_camarac = this.asociacion.foto_camarac;
      this.asociacionesService
              .update(
                this.asociacion.nit,
                updatedAsociacion
              )
              .subscribe(
                (response) => {
                  this.loading1 = false;
                  this.location.back()
                },
                (err) => {
                  console.log(err);
                  this.loading1 = false;
                }
              );
    }else{
      let ext = this.file.name.split('.')[1];
      let basePath = '/asociaciones/camaracomecio/todas/';
      let fileName = 'asociacion-'+this.form.getRawValue().nit+'.'+ext;
      let filePath = basePath + fileName;
      console.log("file ",this.file)
      this.storage.cloudStorageTask(filePath,this.file).percentageChanges().subscribe(
        (response)=>{
          console.log(response)
          if(response == 100){
            this.storage.cloudStorageRef(filePath).getDownloadURL().subscribe(
              (downloadUrl)=>{
                console.log("download url ",downloadUrl)
                let updatedAsociacion = { ...this.form.getRawValue() }
                updatedAsociacion.foto_camarac = downloadUrl;
                this.asociacionesService
                .update(
                  this.asociacion.nit,
                  updatedAsociacion
                )
                .subscribe(
                  (response) => {
                    this.loading1 = false;
                    this.location.back()
                  },
                  (err) => {
                    console.log(err);
                    this.loading1 = false;
                  }
                );
              },err=>{
                this.loading1 = false;
                console.log(err);
              }
            )
          }
        }
      );
    }
  }

  addAsociaciones() {
    console.log('addAsociaciones');
    console.log("form asociaciones ",this.form.getRawValue());
    console.log(this.form.controls);
    this.loading1 = true;
    if(this.isLegalConstituida?.value == '0'){
      this.fotoCamc?.clearValidators();
      this.fotoCamc?.updateValueAndValidity();
    }
    if (!this.form.valid) {
      console.log('Not valid!');
      this.form.markAllAsTouched();
      this.loading1 = false;
      return;
    }
    this.fotoCamc?.setValidators([Validators.required])
    this.fotoCamc?.updateValueAndValidity();

    if(this.isLegalConstituida?.value == '0'){
      let asociacion = { ...this.form.getRawValue() }
      this.asociacionesService.add(asociacion).subscribe(
        (response) => {
          console.log(response)
          this.location.back();
          this.loading1 = false;
        },
        (err) => {
          this.loading1 = false;
          console.log(err);
          if(err.status == 400){
            this.error = err.error.message;
          }else{
            this.error = 'A ocurrido un error'
          }
        });
    }
    else{
      let ext = this.file.name.split('.')[1];
      let token = localStorage.getItem('token');
      let payload = Utilities.parseJwt(token!);
      let basePath = '/asociaciones/camaracomecio/todas/';
      let fileName = 'asociacion-'+this.form.getRawValue().nit+'.'+ext;
      let filePath = basePath + fileName;
      console.log("file ",this.file)
      this.storage.cloudStorageTask(filePath,this.file).percentageChanges().subscribe(
        (response)=>{
          console.log(response)
          if(response == 100){//porcentaje de carga de la camara de comercio
            this.storage.cloudStorageRef(filePath).getDownloadURL().subscribe(
              (downloadUrl)=>{
                console.log("download url ",downloadUrl)
                let asociacion = { ...this.form.getRawValue() }
                asociacion.foto_camarac = downloadUrl;
                this.asociacionesService.add(asociacion).subscribe(
                  (response) => {
                    console.log(response)
                    this.location.back();
                    this.loading1 = false;
                  },
                  (err) => {
                    this.loading1 = false;
                    console.log(err);
                    if(err.status == 400){
                      this.error = 'Ya existe una asociación con el Nit '+ asociacion.nit
                    }else{
                      this.error = 'A ocurrido un error'
                    }
                  }
                );
              },err=>{
                this.loading1 = false;
                console.log(err);
              }
            )
          }
        }
      );
    }
  }

  fileChange(event: any) {
    console.log('change', event);
    this.file = event.target.files[0];
  }

  loadTiposAsociaciones(){
    this.asociacionesService.tiposAsociacion().subscribe(
      (response)=>{
        this.tiposAsociaciones = response.data;
      },err=>{
        console.log(err)
      }
    )
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

  verMiembros(){
    this.asociacionesService.showAscociacionMiembrosModal(this.nit?.value, 'Miembros')
  }
  agregarMiembro(){
    this.asociacionesService.showSolicitudesModal(this.nit?.value, 'Agregar miembro');
  }

  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }

  prepareForm(action: string, asociacion?: any){
    this.modalMode = action;
    this.form.reset();
    console.log("action ",action)
    console.log("formState ",this.formState)
    if (action == 'update') {
      this.idDpto?.setValue(asociacion.id_departamento);
      this.idMunic?.setValue(asociacion.id_municipio);
      this.nit?.setValue(asociacion.nit);
      this.direccion?.setValue(asociacion.direccion);
      this.infoAdicionalDir?.setValue(asociacion.informacion_adicional_direccion);
      this.nombre?.setValue(asociacion.nombre);
      this.isLegalConstituida?.setValue(asociacion.legalconstituida);
      let fechaRenv:string = '';
      if(asociacion?.fecha_renovacion_camarac){
        fechaRenv = (asociacion?.fecha_renovacion_camarac) as string;
        fechaRenv = fechaRenv.split('T')[0]; 
      }
      this.fechRenvCamc?.setValue(formatDate(fechaRenv,'yyyy-MM-dd','es'));
      //this.fotoCamc?.setValue(asociacion.foto_camarac);
      this.idTipoAsoc?.setValue(asociacion.id_tipo_asociacion_fk);
      this.corregVereda?.setValue(asociacion.corregimiento_vereda);
      this.direccion?.setValue(asociacion.direccion);
      this.nit?.disable();
      if(this.formState == 'disable'){
        this.form.disable();
      }
    }
    console.log("asociacion cargada en form ", this.form.getRawValue())
  }

  goBack(){
    this.location.back();
  }

  onChangeLegalConst(){
    console.log(this.isLegalConstituida?.value)
    if(this.isLegalConstituida?.value == '1'){
      this.fotoCamc?.enable();
    }else{
      this.fotoCamc?.disable();
    }
  }

  get idDpto() {
    return this.form.get('id_departamento');
  }

  get idMunic() {
    return this.form.get('id_municipio');
  }

  get nit() {
    return this.form.get('nit');
  }

  get direccion() {
    return this.form.get('direccion');
  }

  get infoAdicionalDir(){
    return this.form.get('informacion_adicional_direccion');
  }

  get nombre(){
    return this.form.get('nombre');
  }

  get isLegalConstituida(){
    return this.form.get('legalconstituida');
  }

  get fechRenvCamc(){
    return this.form.get('fecha_renovacion_camarac');
  }

  get fotoCamc(){
    return this.form.get('foto_camarac');
  }

  get idTipoAsoc(){
    return this.form.get('id_tipo_asociacion_fk');
  }

  get corregVereda(){
    return this.form.get('corregimiento_vereda');
  }
}

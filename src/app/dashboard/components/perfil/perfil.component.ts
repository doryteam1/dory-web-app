import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';;
import { AreasExperticiaService } from 'src/app/services/areas-experticia.service';
import { PlacesService } from 'src/app/services/places.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RegExpUtils } from 'src/app/utilities/regexps';
import { Utilities } from 'src/app/utilities/utilities';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario:any;
  loading:boolean = false; 
  areas:Array<any> = [];
  departamentos:Array<any> = [];
  municipios:Array<any> = [];
  corregimientos:Array<any> = [];
  veredas:Array<any> = [];

  form:FormGroup = new FormGroup({
    id:new FormControl(''),	
    cedula:new FormControl(''),	
    nombres:new FormControl(''),	
    apellidos:new FormControl(''),	
    celular:new FormControl(''),	
    direccion:new FormControl(''),	
    id_tipo_usuario:new FormControl(''),	
    email:new FormControl('',[Validators.required, Validators.email]),	
    id_area_experticia:new FormControl(0),	
    nombre_negocio:new FormControl(''),	
    foto:new FormControl(''),	
    fecha_registro:new FormControl(''),	
    fecha_nacimiento:new FormControl(''),	
    nombre_vereda:new FormControl(''),	
    id_departamento:new FormControl(0),	
    id_municipio:new FormControl(0),	
    id_corregimiento:new FormControl(0),	
    id_vereda:new FormControl(''),	
    latitud:new FormControl(''),	
    longitud:new FormControl(''),	
    nombre_corregimiento:new FormControl(''),
  });

  constructor(private us:UsuarioService, private aes:AreasExperticiaService, private router:Router, private places:PlacesService, private storageService:StorageService) { }

  ngOnInit(): void {
    let email:string | null = localStorage.getItem('email');
    console.log('email logueado ',email);
    this.us.getUsuarioByEmail(email).subscribe(
      (response)=>{
        console.log(response);
        this.usuario = response.data[0];
        console.log(response);

        this.form.get('id')?.setValue(this.usuario.id),	
        this.form.get('cedula')?.setValue(this.usuario.cedula),	
        this.form.get('nombres')?.setValue(this.usuario.nombres),	
        this.form.get('apellidos')?.setValue(this.usuario.apellidos),	
        this.form.get('celular')?.setValue(this.usuario.celular),	
        this.form.get('direccion')?.setValue(this.usuario.direccion),
        this.form.get('id_tipo_usuario')?.setValue(this.usuario.id_tipo_usuario),
        this.form.get('email')?.setValue(this.usuario.email),
        this.form.get('id_area_experticia')?.setValue(this.usuario.id_area_experticia),
        this.form.get('nombre_negocio')?.setValue(this.usuario.nombre_negocio),
        this.form.get('foto')?.setValue(this.usuario.foto),
        this.form.get('fecha_registro')?.setValue(Utilities.dateToISOString(this.usuario.fecha_registro)),
        this.form.get('fecha_nacimiento')?.setValue(Utilities.dateToISOString(this.usuario.fecha_nacimiento)),
        this.form.get('nombre_vereda')?.setValue(this.usuario.nombre_vereda),	
        this.form.get('id_departamento')?.setValue(this.usuario.id_departamento),	
        this.form.get('id_municipio')?.setValue(this.usuario.id_municipio),	
        this.form.get('id_corregimiento')?.setValue(this.usuario.id_corregimiento),	
        this.form.get('id_vereda')?.setValue(this.usuario.id_vereda),	
        this.form.get('latitud')?.setValue(this.usuario.latitud),	
        this.form.get('longitud')?.setValue(this.usuario.longitud),	
        this.form.get('nombre_corregimiento')?.setValue(this.usuario.nombre_corregimiento),


        this.loadAreasExp();
        this.loadDptos();
        this.loadCorregVeredas();
        this.nomCorregVeredasubs();
        this.storageService.add('photoUser',this.usuario.foto)
        this.storageService.add('nomApell',this.getNomApell(this.usuario.nombres,this.usuario.apellidos))
        if(!this.usuario.tipo_usuario || !(this.usuario.nombres && this.usuario.apellidos)){
          this.router.navigate(['/welcome',this.usuario]);  
        }
      },(err)=>{
        console.log(err);
      }
    );
  }

  nomCorregVeredasubs() {
   this.nomCorreg?.valueChanges.subscribe(
     (response)=>{
       console.log(response)
       this.idCorreg?.patchValue( 0, {emitEvent: false} );
       this.idCorreg?.updateValueAndValidity();
     }
   );

   this.nomVereda?.valueChanges.subscribe(
     (response)=>{
      console.log(response)
       this.idVereda?.patchValue( 0, {emitEvent: false} );
       this.idVereda?.updateValueAndValidity();
     }
   );
  }

  getNomApell(nombres:string,apellidos:string){
    let nomComp:string = '';
    if(nombres){
      nomComp = nombres.split(' ')[0];
    }
    if(apellidos){
      nomComp = nomComp +" "+ apellidos.split(' ')[0];
    }
    return nomComp;
  }

  loadAreasExp(){
    this.aes.getAreasDeExperticia().subscribe(
      (response)=>{
        this.areas = response.data;
      },(err)=>{
        console.log(err);
      }
    );
  }

  loadDptos(){
    this.places.getDepartamentos().subscribe(
      (response)=>{
        this.departamentos = response.data;
      },err=>{
        console.log(err);
      }
    );
  }

  changeDpto(){
    this.form.get('id_municipio')?.setValue(0);
    this.places.getMunicipiosDepartamentos(this.form.get('id_departamento')?.value).subscribe(
      (response)=>{
        this.municipios = response.data;
      },(err)=>{
        console.log(err);
      }
    );
  }

  changeMunic(){
    this.idCorreg?.setValue(0);
    this.idVereda?.setValue(0);
    this.places.getCorregimientosMunicipio(this.idMunic?.value).subscribe(
      (response)=>{
        this.corregimientos = response.data;
      },err=>{
        console.log(err);
      }
    )

    this.places.getVeredasMunicipio(this.idMunic?.value).subscribe(
      (response)=>{
        this.veredas = response.data;
      },err=>{
        console.log(err)
      }
    );
  }

  loadCorregVeredas(){
    this.places.getCorregimientosMunicipio(this.idMunic?.value).subscribe(
      (response)=>{
        this.corregimientos = response.data;
      },err=>{
        console.log(err);
      }
    )

    this.places.getVeredasMunicipio(this.idMunic?.value).subscribe(
      (response)=>{
        this.veredas = response.data;
      },err=>{
        console.log(err)
      }
    );
  }

  onSubmit(){
    console.log(this.form.value)
    this.loading = true;
    if(this.form.invalid){
      this.loading = false;
      return;
    }

    this.us.actualizarUsuario(this.form.get('id')?.value,this.form.value).subscribe(
      (response)=>{
        console.log(response);
        this.loading = false;
      },err=>{
        this.loading = false;
        console.log(err)
      }
    );
  }

  corregSelected(){
    this.nomCorreg?.setValue('');
  }

  veredaSelected(){
    this.nomVereda?.setValue('');
  }

  get id(){
    return this.form.get('id');
  }
  
  get cedula(){
    return this.form.get('cedula');	
  }

  get nombres(){
    return this.form.get('nombres');	
  }
        
  get apellidos(){
    return this.form.get('apellidos');
  }
        
  get celular(){
    return this.form.get('celular');	
  }
        
  get direccion(){
    return this.form.get('direccion');
  }
        
  get idTipoUsuario(){
    return this.form.get('id_tipo_usuario');
  }

  get email(){
    return this.form.get('email');
  }
        
  get idAreaExpert(){
    return this.form.get('id_area_experticia');
  }
        
  get nombreNegocio(){
    return this.form.get('nombre_negocio');
  }

  get foto(){
    return this.form.get('foto');
  }
        
  get fechaRegistro(){
    return this.form.get('fecha_registro');
  }
        
  get fechaNac(){
    return this.form.get('fecha_nacimiento');
  }
        
  get nomVereda(){
    return this.form.get('nombre_vereda');
  }
        
  get idDpto(){
    return this.form.get('id_departamento');
  }
        
  get idMunic(){
    return this.form.get('id_municipio');
  }
        
  get idCorreg(){
    return this.form.get('id_corregimiento');
  }
        
  get idVereda(){
    return this.form.get('id_vereda');
  }
        
  get latitud(){
    return this.form.get('latitud');
  }
        
  get longitud(){
    return this.form.get('longitud');
  }
        
  get nomCorreg(){
    return this.form.get('nombre_corregimiento');
  }
        
}

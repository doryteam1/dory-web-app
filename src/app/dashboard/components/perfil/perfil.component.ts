import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AreasExperticiaService } from 'src/app/services/areas-experticia.service';
import { PlacesService } from 'src/app/services/places.service';
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
  isEditing:boolean = false;
  areaExp:number = 0;
  dpto:number = 0;
  munic:number = 0;
  corrId:number = 0;
  correNomb:string = '';
  veredaNom:string = '';
  email:string = '';
  fechaNac:string = '';
  cel:string = '';
  dir:string = '';
  areas:Array<any> = [];
  departamentos:Array<any> = [];
  municipios:Array<any> = [];
  corregimientos:Array<any> = [];
  loading:boolean = false;
  update:string = ''; 
  idUsuario:number=-1;

  constructor(private us:UsuarioService, private aes:AreasExperticiaService, private router:Router, private places:PlacesService) { }

  ngOnInit(): void {
    let email:string | null = localStorage.getItem('email');
    console.log('email logueado ',email);
    this.us.getUsuarioByEmail(email).subscribe(
      (response)=>{
        this.usuario = response.data[0];
        console.log(response);
        this.email = this.usuario.email;
        this.areaExp = this.usuario.id_area_experticia;
        this.fechaNac = Utilities.dateToISOString(this.usuario.fecha_nacimiento);
        this.cel = this.usuario.celular;
        this.dpto = this.usuario.departamento;
        this.munic = this.usuario.id_municipio;
        this.corrId = this.usuario.id_corregimiento;
        this.correNomb = this.usuario.corregimiento;
        this.veredaNom = this.usuario.vereda;
        this.idUsuario = this.usuario.id;
        this.loadAreasExp();
        this.loadDptos();
        if(!this.usuario.tipo_usuario || !(this.usuario.nombres && this.usuario.apellidos)){
          this.router.navigate(['/welcome',this.usuario]);  
        }
      },(err)=>{
        console.log(err);
      }
    );
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

  resetErrors(){

  }

  changeDpto(){
    this.munic = 0;
    this.places.getMunicipiosDepartamentos(this.dpto).subscribe(
      (response)=>{
        this.municipios = response.data;
      },(err)=>{
        console.log(err);
      }
    );
  }

  changeMunic(){
    this.corrId = 0;
    console.log(this.munic);
    this.places.getCorregimientosMunicipio(this.munic).subscribe(
      (response)=>{
        this.corregimientos = response.data;
      },err=>{
        console.log(err);
      }
    )
  }

  updateUser(propToUpdate:string){
    console.log(propToUpdate)
    this.loading = true;
    this.update = propToUpdate;
    let userData:any = {

    }
    if(this.update == 'aexp'){
      if(this.areaExp == 0){
        return;
      }
      userData.id_area_experticia = this.areaExp;
    }else if(this.update == 'email'){
      if(/*RegExp email*/false){
        return;
      }
      userData.email = this.email;
    }else if(this.update == 'fechaNac'){
      if(this.fechaNac == ''){
        return;
      }
      userData.fecha_nacimiento = this.fechaNac;
    }else if(this.update == 'cel'){
      if(this.cel == '' /*RegExp solo numeros*/ ){
        return;
      }
      userData.celular = this.cel;
    }else if(this.update == 'dpto'){
      if(this.dpto == 0){
        return;
      }
      userData.id_departamento = this.dpto;
    }else if(this.update == 'munic'){
      if(this.munic == 0){
        return;
      }
      userData.id_municipio = this.munic;
    }else if(this.update == 'corr'){
      if(this.corregimientos.length>0){
        if(this.corrId == 0){
          return;
        }
        userData.id_corregimiento = this.corrId;
      }else{
        if(this.correNomb == ''){
          return;
        }
        userData.corregimiento = this.correNomb;
      }
    }else if(this.update == 'vereda'){
      if(this.veredaNom == ''){
        return;
      }
      userData.vereda = this.veredaNom;
    }else if(this.update == 'dir'){
      if(this.dir == ''){
        return;
      }
      userData.direccion = this.dir;
    }
    if(this.idUsuario == -1){
      return;
    }
    this.us.actualizarUsuario(this.idUsuario,userData).subscribe(
      (response)=>{
        console.log(response);
      },err=>{
        console.log(err)
      }
    );
  }
}

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
  areas:Array<any> = [];
  email:string = '';
  fechaNac:string = '';
  cel:string = '';
  dpto:number = -1;
  departamentos:Array<any> = [];

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
        if(!this.usuario.tipo_usuario || !(this.usuario.nombres && this.usuario.apellidos)){
          this.router.navigate(['/welcome',this.usuario]);  
        }
      },(err)=>{
        console.log(err);
      }
    );

    this.aes.getAreasDeExperticia().subscribe(
      (response)=>{
        this.areas = response.data;
      },(err)=>{
        console.log(err);
      }
    );

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
}

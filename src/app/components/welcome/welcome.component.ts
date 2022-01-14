import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RegExpUtils } from 'src/app/utilities/regexps';
import { Router } from '@angular/router';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  isFillUserType:boolean = false;
  isFillName:boolean = false;
  tipos:Array<any> = [];
  idTipo:number = 0;
  nombres:string | null= '';
  apellidos:string | null = '';
  error:string = '';
  id:string | null = '';

  constructor(private ar:ActivatedRoute, private us:UsuarioService, private router:Router) {
    this.us.getTiposUsuario().subscribe(
      (response)=>{
        this.tipos = response.data;
      },err=>{
        this.error="Error al cargar los tipos de usuarios";
        console.log("Error al cargar los tipos de usuarios ",err);
      }
    );
  }

  ngOnInit(): void {
    console.log("Welcome user objet ",this.ar.snapshot.paramMap);
    let tipoUsuario = this.ar.snapshot.paramMap.get('tipo_usuario')
    this.nombres = this.ar.snapshot.paramMap.get('nombres');
    this.apellidos = this.ar.snapshot.paramMap.get('apellidos');
    this.id = this.ar.snapshot.paramMap.get('id');


    if(tipoUsuario){
      console.log("Tiene tipo de usuario ",tipoUsuario);
    }

    if(this.ar.snapshot.paramMap.get('nombres')=='null' 
      || this.ar.snapshot.paramMap.get('apellidos') == 'null'
      || this.ar.snapshot.paramMap.get('nombres')==''
      || this.ar.snapshot.paramMap.get('apellidos')=='' ){
      this.isFillName = true;
      console.log("Este usuario debe llenar su nombre ");
    }else if(this.ar.snapshot.paramMap.get('tipo_usuario')=='null'){
      console.log("Este usuario debe llenar el tipo de usuario");
      this.isFillUserType = true;
    }else{
      console.log("No entro a ninguna");
    }
  }

  next(){
    console.log("actualizando usuario...");
    let usuario:any = {

    }

    if(this.isFillUserType){
      if(this.idTipo<1){
        this.error = 'Ayudanos a con esta información'
        return;
      }
      usuario.id_tipo_usuario = this.idTipo;
    }else if(this.isFillName){
      if(!this.isOkNomApell()){
        this.error = 'Mmm al parecer falta tu nombre o apellido...';
        return;
      }
      usuario.nombres = this.nombres;
      usuario.apellidos = this.apellidos;

    }

    this.us.actualizarUsuario(parseInt(this.id as string),usuario).subscribe(
      (response)=>{
        console.log("Usuario actualizado... ",response);
        this.router.navigateByUrl('/dashboard');
      },err=>{
        console.log(err);
      }
    );
    console.log("actualizando usuario ",usuario);
  }

  isOkNomApell(){
    return RegExpUtils.twoStringSpace().test(this.nombres as string) && RegExpUtils.twoStringSpace().test(this.apellidos as string)
  }

  resetErrors()
  {
    console.log("change")
    this.error = '';
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RegExpUtils } from 'src/app/utilities/regexps';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario:any;
  isEditing:boolean = false;

  form:FormGroup = new FormGroup({
    cedula:new FormControl(''),
    nombres:new FormControl(''),
    apellidos:new FormControl(''),
    email:new FormControl('',[Validators.required, Validators.email]),
    tipoUsuario:new FormControl('',[Validators.required]),
    fechaNac:new FormControl(''),
    celular:new FormControl('',),
    departamento:new FormControl(''),
    municipio:new FormControl('',),
    corregimiento:new FormControl('',),
    vereda:new FormControl('',),
    terms:new FormControl('',Validators.required),
  });

  constructor(private us:UsuarioService, private router:Router) { }

  ngOnInit(): void {
    let email:string | null = localStorage.getItem('email');
    console.log('email logueado ',email);
    this.us.getUsuarioByEmail(email).subscribe(
      (response)=>{
        this.usuario = response.data[0];
        console.log(response);
        if(!this.usuario.tipo_usuario || !(this.usuario.nombres && this.usuario.apellidos)){
          this.router.navigate(['/welcome',this.usuario]);  
        }
      },(err)=>{
        console.log(err);
      }
    );
  }

  invalid(controlFormName:string){;
    return this.form.get(controlFormName)?.invalid && (this.form.get(controlFormName)?.dirty || this.form.get(controlFormName)?.touched)
  }

  get nombres(){
    return this.form.get('nombres');
  }

  get email(){
    return this.form.get('email');
  }

  get tipoUsuario(){
    return this.form.get('tipoUsuario');
  }

  get fechaNac(){
    return this.form.get('fechaNac');
  }

}

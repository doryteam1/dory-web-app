import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PlacesService } from 'src/app/services/places.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  @Output() exit: EventEmitter<any> = new EventEmitter();
  form:FormGroup = new FormGroup({
    cedula:new FormControl(''),
    nombres:new FormControl(''),
    apellidos:new FormControl(''),
    email:new FormControl('',[Validators.required, Validators.email]),
    tipoUsuario:new FormControl('',[Validators.required]),
    fechaNac:new FormControl(''),
    celular:new FormControl('',),
    password:new FormControl('',Validators.required),
    matchPassword:new FormControl('',Validators.required),
    departamento:new FormControl(''),
    municipio:new FormControl('',),
    corregimiento:new FormControl('',),
    vereda:new FormControl('',),
    terms:new FormControl('',Validators.required),
  });

  tipoUsuarios:any[]=[];
  error:string='';

  constructor(private usuarioService:UsuarioService, private spinner: NgxSpinnerService) { 
  }


  ngOnInit(): void {
    this.usuarioService.getTiposUsuario().subscribe(
      (response)=>{
        console.warn(response.data);
        this.tipoUsuarios = response.data;
      }
    );
  }

  exiting(event:any){
    console.log("exit reg")
    this.exit.emit(true)
  }

  invalid(controlFormName:string){;
    return this.form.get(controlFormName)?.invalid && (this.form.get(controlFormName)?.dirty || this.form.get(controlFormName)?.touched)
  }

  noMatchingPasswords(){
    return this.password?.value != this.matchPassword?.value && (this.matchPassword?.dirty || this.matchPassword?.touched);
  }

  onSubmit(){
    console.warn(this.form.value)
    console.log("valid = ",this.form.valid)
    if(this.form.valid){
      this.spinner.show();
      this.usuarioService.registrarUsuario(this.form.value).subscribe(
        (response)=>{
          this.spinner.hide();
        },(err)=>{
          this.error = err.error.message;
          this.spinner.hide();
        }
      );
    }else{
      this.form.markAllAsTouched();
    }
  }

  onChange(){
    console.log('on change');
    this.error='';
  }

  get nombreCompleto(){
    return this.form.get('nombreCompleto')
  }

  get email(){
    return this.form.get('email');
  }

  get password(){
    return this.form.get('password');
  }

  get matchPassword(){
    return this.form.get('matchPassword');
  }

  get tipoUsuario(){
    return this.form.get('tipoUsuario');
  }

}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
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
    cedula:new FormControl('',[Validators.required, Validators.pattern(/^([0-9]+)$/)]),
    nombreCompleto:new FormControl('',Validators.required),
    email:new FormControl('',[Validators.required, Validators.email]),
    fechaNac:new FormControl(''),
    celular:new FormControl('',[Validators.required, Validators.maxLength(10), Validators.pattern(/^([0-9]+)$/)]),
    password:new FormControl('',Validators.required),
    matchPassword:new FormControl('',Validators.required),
    departamento:new FormControl(''),
    municipio:new FormControl('',),
    corregimiento:new FormControl('',),
    vereda:new FormControl('',),
    terms:new FormControl('',Validators.required),
  });
  constructor(private places:PlacesService, private usuarioService:UsuarioService) { 
    console.log(this.form.value);
  }

  departamentos:any[] = [];
  municipios:any[] = [];
  corregimientos:any[] = [];
  veredas:any[] = [];

  dptoSelec:any = {
    id:-1,
    nombre:'Selecciona un departamento'
  };

  municSelec:any = {
    id:-1,
    nombre:'Selecciona un municipio'
  };

  corregimientoSelec:any = {
    id:-1,
    nombre:'Selecciona un corregimiento'
  };

  veredaSelec:any = {
    id:-1,
    nombre:'Selecciona un vereda'
  };

  ngOnInit(): void {
    this.places.getDepartamentos().subscribe(
      (response)=>{
        console.warn(response.data);
        this.departamentos = response.data;
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

  dptoSelecc(dpto:any){
    this.dptoSelec.id = dpto.id_departamento;
    this.dptoSelec.nombre = dpto.nombre_departamento;
    this.form.get('departamento')?.setValue(this.dptoSelec.id);
    this.resetMunic();
    this.resetCorreg();
    this.resetVereda();
    this.places.getMunicipiosDepartamentos(this.dptoSelec.id).subscribe(
      (response)=>{
        this.municipios = response.data;
      }
    );
  }

  municSelecc(municipio:any){
    this.municSelec.id = municipio.id_municipio;
    this.municSelec.nombre = municipio.nombre;
    this.form.get('municipio')?.setValue(this.municSelec.id);
    this.resetCorreg();
    this.resetVereda();
    this.places.getCorregimientosMunicipio(this.municSelec.id).subscribe(
      (response)=>{
        this.corregimientos = response.data;
      }
    );
    this.places.getVeredasMunicipio(this.municSelec.id).subscribe(
      (response)=>{
        this.veredas = response.data;
      }
    );
  }

  corregSelecc(corregimiento:any){
    this.corregimientoSelec.id = corregimiento.id_corregimiento;
    this.corregimientoSelec.nombre = corregimiento.nombre;
    this.form.get('corregimiento')?.setValue(this.corregimientoSelec.id);
  }

  veredaSelecc(vereda:any){
    this.veredaSelec.id = vereda.id_vereda;
    this.veredaSelec.nombre = vereda.nombre;
    this.form.get('vereda')?.setValue(this.veredaSelec.id);
  }

  resetMunic(){
    this.municSelec = {
      id:-1,
      nombre:'Selecciona un municipio'
    };
    this.form.get('municipio')?.setValue('');
  }

  resetCorreg(){
    this.corregimientoSelec = {
      id:-1,
      nombre:'Selecciona un corregimiento'
    };
    this.form.get('corregimiento')?.setValue('');
  }

  resetVereda(){
    this.veredaSelec = {
      id:-1,
      nombre:'Selecciona un vereda'
    };
    this.form.get('vereda')?.setValue('');
  }
  onSubmit(){
    console.warn(this.form.value)
    console.warn(this.form.value)
    console.log("valid = ",this.form.valid)
    if(this.form.valid){
      this.form.get('fechaNac')?.setValue(this.fechaNac?.value.year+"-"+this.fechaNac?.value.month+"-"+this.fechaNac?.value.day)
      this.usuarioService.registrarUsuario(this.form.value).subscribe(
        (response)=>{
          console.log("termino registro",response);
        }
      );
    }
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

  get celular(){
    return this.form.get('celular');
  }

  get fechaNac(){
    return this.form.get('fechaNac');
  }

  get cedula(){
    return this.form.get('cedula');
  }
}

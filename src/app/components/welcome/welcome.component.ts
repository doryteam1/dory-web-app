import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RegExpUtils } from 'src/app/utilities/regexps';
import { Router } from '@angular/router';
import { PlacesService } from 'src/app/services/places.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  isFillUserType: boolean = false;
  isFillName: boolean = false;
  tipos: Array<any> = [];
  idTipo: number = 0;
  idMunic: number = 0;
  idDepartamento: number = 70;
  nombres: string | null = '';
  apellidos: string | null = '';
  error: string = '';
  id: string | null = '';
  municipios: any[] = [];
  departamentos: any[] = [];
  tipoUsuario:any;

  constructor(
    private ar: ActivatedRoute,
    private us: UsuarioService,
    private router: Router,
    private places: PlacesService
  ) {
    this.us.getTiposUsuario().subscribe(
      (response) => {
        this.tipos = response.data;
      },
      (err) => {
        //this.error="Error al cargar los tipos de usuarios";
      }
    );

  }

  ngOnInit(): void {
    this.tipoUsuario = this.ar.snapshot.paramMap.get('tipo_usuario');
    this.nombres = this.ar.snapshot.paramMap.get('nombres');
    this.apellidos = this.ar.snapshot.paramMap.get('apellidos');
    this.id = this.ar.snapshot.paramMap.get('id');

    if (
      this.ar.snapshot.paramMap.get('nombres') == 'null' ||
      this.ar.snapshot.paramMap.get('apellidos') == 'null' ||
      this.ar.snapshot.paramMap.get('nombres') == '' ||
      this.ar.snapshot.paramMap.get('apellidos') == ''
    ) {
      this.isFillName = true;
      console.log('Este usuario debe llenar su nombre ');
    } else if (this.ar.snapshot.paramMap.get('tipo_usuario') == 'null') {
      console.log('Este usuario debe llenar el tipo de usuario');
      this.isFillUserType = true;
    } else {
      console.log('No entro a ninguna');
    }
    if (this.tipoUsuario == 'Proveedor') {
      this.loadDptos();
      this.idDepartamento = 0;
    }else{
      this.changeDpto(70);
    }
  }
  loadDptos() {
    this.places.getDepartamentos().subscribe(
      (response) => {
        this.departamentos = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  changeDpto(idDepart:number) {
    this.idMunic=0
       this.places.getMunicipiosDepartamentos(idDepart).subscribe(
         (response) => {
           this.municipios = response.data;
         },
         (err) => {
           console.log(err);
         }
       );
  }
  next() {
    console.log('actualizando usuario...');
    let usuario: any = {
      id_departamento:this.idDepartamento,
      id_municipio: this.idMunic,
    };
    if (this.isFillUserType) {
      if (this.idTipo < 1) {
        this.error = 'Ayudanos con esta información';
        return;
      }
      usuario.id_tipo_usuario = this.idTipo;
    } else if (this.isFillName) {
     /*  if (!this.isOkNomApell()) {
        this.error = 'Mmm al parecer falta tu nombre o apellido...';
        return;
      } */
      usuario.nombres = this.nombres;
      usuario.apellidos = this.apellidos;
    }

    if (this.idMunic == 0) {
      this.error = 'Olvidaste seleccionar el municipio donde vives';
      return;
    }
    if (this.idDepartamento == 0 && this.tipoUsuario == 'Proveedor') {
      this.error = 'Olvidaste seleccionar tú departamento';
      return;
    }
    this.us.actualizarUsuario(parseInt(this.id as string), usuario).subscribe(
      (response) => {
        console.log('Usuario actualizado... ', response);
        this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        console.log(err);
      }
    );
    console.log('actualizando usuario ', usuario);
  }

  isOkNomApell() {
    return (
      RegExpUtils.twoStringSpace().test(this.nombres as string) &&
      RegExpUtils.twoStringSpace().test(this.apellidos as string)
    );
  }

  resetErrors() {
    this.error = '';
  }
}

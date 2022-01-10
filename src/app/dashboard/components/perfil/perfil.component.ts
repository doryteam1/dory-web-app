import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario:any;

  constructor(private us:UsuarioService) { }

  ngOnInit(): void {
    let email:string | null = localStorage.getItem('email');
    console.log('email logueado ',email);
    this.us.getUsuarioByEmail(email).subscribe(
      (response)=>{
        this.usuario = response.data[0];
        console.log(response);
      },(err)=>{
        console.log(err);
      }
    );
  }

}

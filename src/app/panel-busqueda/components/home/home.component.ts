import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tipoUsuario:string = '';
  error:string = '';
  constructor(private socialService:SocialAuthService, private userService:UsuarioService, private router:Router) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if(token && token!='undefined'){
      this.tipoUsuario = Utilities.parseJwt(token!).rol;
      if(!this.tipoUsuario && this.userService.authenticatedWith()=='google'){
        this.socialService.authState.subscribe(
          (response)=>{
            let idToken = response.idToken;
            this.userService.loginWithGoogle(idToken).subscribe(
              (response)=>{
                localStorage.setItem('token',response.body.token);
                this.userService.setAuthWith('google');
                this.tipoUsuario = Utilities.parseJwt(response.body.token).rol;
              },err=>{
                console.log(err);
                this.error = 'No se pudo iniciar sessión';
              }
            )
          }
        )
      }
    }
  }
}

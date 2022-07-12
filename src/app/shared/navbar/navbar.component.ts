import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  photoUser:string = '';
  nomCom:string = '';
  successMessage = 'Mensaje de prueba';
  invitaciones:Array<any> = [];
  notificatiosOpened:boolean = false;
  constructor(
    private router:Router,
    private userService:UsuarioService,
    private storageService:StorageService) { }

  ngOnInit(): void {
    this.photoUser = localStorage.getItem('photoUser')!;
    this.nomCom = localStorage.getItem('nomApell')!;
    this.storageService.store$.subscribe(
      (response)=>{
        this.photoUser = response.photoUser;
        this.nomCom = response.nomApell;
      }
    );
    this.userService.solicitudesDeAsociaciones().subscribe(
      (response)=>{
        this.invitaciones = response.data;
      }
    )
  }

  login(){
    let isAuth = this.userService.isAuthenticated();

    if(isAuth){
      this.router.navigateByUrl('/dashboard');
    }else{
      this.router.navigateByUrl('/login');
    }
  }

  authenticated(){
    return this.userService.isAuthenticated();
  }
  
  authUserPhoto():any{
    return this.userService.getAuthUserPhoto();
  }
  authWith(){
    return this.userService.authenticatedWith();
  }
  logout(){
    this.userService.logout();
    this.router.navigateByUrl('/home')
  }
  
  updatePassword(){
    this.router.navigateByUrl('update-password')
  }

  confirmarInvitacion(invitacion:any){
    invitacion.message = 'Aceptaste la solicitud. Ya eres miembro.';
    this.userService.aceptarInvitacion(invitacion.id_solicitud).subscribe(
      (response)=>{
        
      },err=>{
        invitacion.message = undefined;
      }
    )
  }

  eliminarInvitacion(invitacion:any){
    invitacion.message = 'Solicitud eliminada'
    this.userService.eliminarSolicitud(invitacion.id_solicitud).subscribe(
      (response)=>{
        console.log(response)
      },err=>{
        console.log(err)
        invitacion.message = undefined;
      });
    }
}

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
  constructor(private router:Router,private userService:UsuarioService,private storageService:StorageService) { }

  ngOnInit(): void {
    this.photoUser = localStorage.getItem('photoUser')!;
    this.nomCom = localStorage.getItem('nomApell')!;
    this.storageService.store$.subscribe(
      (response)=>{
        this.photoUser = response.photoUser;
        this.nomCom = response.nomApell;
      }
    );
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

  logout(){
    this.userService.logout();
    this.router.navigateByUrl('/home')
  }
}

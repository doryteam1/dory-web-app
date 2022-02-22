import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  login(){
    let email = localStorage.getItem('email');
    let token = localStorage.getItem('token');

    if(email && token && email != '' && token != ''){
      this.router.navigateByUrl('/dashboard');
    }else{
      this.router.navigateByUrl('/login');
    }
  }
}

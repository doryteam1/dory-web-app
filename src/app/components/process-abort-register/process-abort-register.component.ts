import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-process-abort-register',
  templateUrl: './process-abort-register.component.html',
  styleUrls: ['./process-abort-register.component.scss'],
})
export class ProcessAbortRegisterComponent implements OnInit {
  constructor(private router: Router, public userService: UsuarioService) {}

  ngOnInit(): void {
    localStorage.setItem(
      'urlPrevious-abort',
      this.router.routerState.snapshot.url
    );
  }

  navegateTo(url: string) {
    if (url == '/home') {
      this.userService.removeLocalStorage(true);
    }
    this.router.navigateByUrl(url);
  }
}

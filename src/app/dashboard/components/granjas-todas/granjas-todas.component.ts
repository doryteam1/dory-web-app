import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-granjas-todas',
  templateUrl: './granjas-todas.component.html',
  styleUrls: ['./granjas-todas.component.scss'],
})
export class GranjasTodasComponent implements OnInit {
  authUserId: number = -1;
  UserTipo: any;
  constructor(private router: Router, private us: UsuarioService) {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    this.authUserId = payload.sub;
    let email = localStorage.getItem('email');
    this.us.getUsuarioByEmail(email).subscribe((response) => {
      this.UserTipo = response.data[0].tipo_usuario;
    });
  }
  editarGranja(granja: any, formState: string) {
    if (this.UserTipo == 'Administrador') {
      let object: any = { ...granja };
      (object.action = 'update'),
        (object.formState = formState),
        (object.authUserId = this.authUserId);
      this.router.navigate(['/dashboard/granja/detalle', object]);
    }
  }
}

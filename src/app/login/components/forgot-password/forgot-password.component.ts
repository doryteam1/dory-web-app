import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  send: boolean = false;
  errorMensaje:string=''
  error:boolean=false
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  loading: boolean = false;

  constructor(private router: Router, private userService: UsuarioService) {}

  ngOnInit(): void {}

  invalid(controlFormName: string) {
    return (
      this.form.get(controlFormName)?.invalid &&
      (this.form.get(controlFormName)?.dirty ||
        this.form.get(controlFormName)?.touched)
    );
  }

  onChange() {
     this.error = false;
  }

  onSubmit() {
    this.loading = true;
    if (this.form.invalid) {
      this.loading = false;
       this.error = false;
      return;
    }
     this.error = false;
    this.userService.recoveryPassword(this.form.get('email')?.value).subscribe(
      (respose) => {
       this.error=false
        this.send = true;
        this.loading = false;
      },
      (err) => {
        console.log(err);
        if (err.status == 404) {
           this.error = true;
          this.errorMensaje = 'El usuario no se encuentra registrado';
          this.loading = false;
        }
        this.loading = false;
      }
    );
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}

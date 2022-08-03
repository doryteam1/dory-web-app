import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RegExpUtils } from 'src/app/utilities/regexps';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  success:boolean = false;
  visiblePass:boolean = false;
  visibleNewPass:boolean = false;
  visibleMatchPass:boolean = false;
  
  form:FormGroup = new FormGroup({
    oldPassword:new FormControl('',Validators.required),
    password:new FormControl('',[
      Validators.required,
      Validators.pattern(RegExpUtils.eigthChar()),
      Validators.pattern(RegExpUtils.capitalcase()),
      Validators.pattern(RegExpUtils.lowercase()),
      Validators.pattern(RegExpUtils.number()),
    ]),
    matchPassword:new FormControl('',Validators.required)
  });
  loading:boolean = false;
  token:string = '';
  error:string = '';

  constructor(private router:Router, private userService:UsuarioService,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token')!;
    
    if(this.activatedRoute.snapshot.paramMap.keys.length>0){
      if(this.activatedRoute.snapshot.paramMap.get('token') == 'true')
      this.token = localStorage.getItem('token')!;
    }
  }

  invalid(controlFormName:string){;
    return this.form.get(controlFormName)?.invalid && (this.form.get(controlFormName)?.dirty || this.form.get(controlFormName)?.touched)
  }

  onChange(){
    console.log('on change');
  }

  noMatchingPasswords(){
    return this.password?.value != this.matchPassword?.value && (this.matchPassword?.dirty || this.matchPassword?.touched);
  }

  onSubmit(){
    console.log('on change');
    if(this.form.invalid){
      return;
    }
    this.loading = true;
    let data = {
      antiguoPassword : this.oldPassword?.value,
      newPassword: this.password?.value
    }
    this.userService.changePassword(data).subscribe(
      (response)=>{
        this.success = true;
        this.loading = false;
        this.error = '';
      },err=>{
        this.error = err.error.message;
        this.loading = false;
        console.log(this.error)
        console.log(err);
      }
    )
  }

  get password(){
    return this.form.get('password');
  }

  get matchPassword(){
    return this.form.get('matchPassword');
  }

  get oldPassword(){
    return this.form.get('oldPassword');
  }

  eigthChar(cad:string){
    return RegExpUtils.eigthCharTest(cad);
  }

  capitalcase(cad:string){
    return RegExpUtils.capitalcaseTest(cad);
  }

  lowercase(cad:string){
    return RegExpUtils.lowercaseTest(cad);
  }

  number(cad:string){
    return RegExpUtils.numberTest(cad);
  }

}

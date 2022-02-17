import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MailService } from 'src/app/services/mail.service';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  form:FormGroup = new FormGroup({
    nomCompleto:new FormControl('',[Validators.required]),
    email:new FormControl('',[Validators.required, Validators.email]),
    celular:new FormControl('',[Validators.required]),
    asunto:new FormControl('',[Validators.required],),
    mensaje:new FormControl('',[Validators.required]),
  });
  loading:boolean = false;

  constructor(private router:Router,private mailService:MailService) { }

  ngOnInit(): void {
  }

  invalid(controlFormName:string){;
    return this.form.get(controlFormName)?.invalid && (this.form.get(controlFormName)?.dirty || this.form.get(controlFormName)?.touched)
  }

  onChange(){
    console.log('on change');
  }

  onSubmit(){
    console.log('on change');
    if(this.form.invalid){
      return;
    }
    this.loading = true;
    let data:any = {
      nombre: this.form.get('nomCompleto')?.value,
      email: this.form.get('email')?.value,
      asunto: this.form.get('asunto')?.value,
      celular: this.form.get('celular')?.value,
      mensaje: this.form.get('mensaje')?.value,
    }
    
    this.mailService.contactenosSendMail(data).subscribe(
      (response)=>{
        this.loading = false;
        this.router.navigateByUrl('/basic-message');    
      },err=>{
        this.loading = false;
        console.log(err);
      }
    );
  }


  get nomCompleto(){
    return this.form.get('nomCompleto')
  }

  get email(){
    return this.form.get('email');
  }

  get celular(){
    return this.form.get('celular');
  }

  get asunto(){
    return this.form.get('asunto');
  }

  get mensaje(){
    return this.form.get('mensaje');
  }


}

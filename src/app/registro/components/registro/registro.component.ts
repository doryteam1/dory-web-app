import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControlDirective} from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegExpUtils } from '../../../utilities/regexps';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  @Output() exit: EventEmitter<any> = new EventEmitter();
  form:FormGroup = new FormGroup({
    cedula:new FormControl(''),
    nombres:new FormControl(''),
    apellidos:new FormControl(''),
    email:new FormControl('',[Validators.required, Validators.email]),
    tipoUsuario:new FormControl('',[Validators.required]),
    fechaNac:new FormControl(''),
    celular:new FormControl('',),
    password:new FormControl('',[
      Validators.required,
      Validators.pattern(RegExpUtils.eigthChar()),
      Validators.pattern(RegExpUtils.capitalcase()),
      Validators.pattern(RegExpUtils.lowercase()),
      Validators.pattern(RegExpUtils.number()),
    ]),
    matchPassword:new FormControl('',Validators.required),
    departamento:new FormControl(''),
    municipio:new FormControl('',),
    corregimiento:new FormControl('',),
    vereda:new FormControl('',),
    terms:new FormControl('',Validators.required),
  });

  tipoUsuarios:any[]=[];
  error:string='';
  success:boolean = false;

  sucreLatLng = {
    lat:9.176187, 
    lng:-75.110196
  }

  constructor(private usuarioService:UsuarioService, private spinner: NgxSpinnerService, private router:Router, private socialAuthService:SocialAuthService,private modalService: NgbModal, private userService:UsuarioService) { 
    
  }


  ngOnInit(): void {
    this.usuarioService.getTiposUsuario().subscribe(
      (response)=>{
        this.tipoUsuarios = response.data;
      }
    );
  }

  exiting(event:any){
    this.exit.emit(true)
  }

  invalid(controlFormName:string){;
    return this.form.get(controlFormName)?.invalid && (this.form.get(controlFormName)?.dirty || this.form.get(controlFormName)?.touched)
  }

  noMatchingPasswords(){
    return this.password?.value != this.matchPassword?.value && (this.matchPassword?.dirty || this.matchPassword?.touched);
  }

  onSubmit(){
    if(this.form.valid && this.terms?.value){
      this.spinner.show();
      let newUser = this.form.getRawValue();
      newUser.latitud = this.sucreLatLng.lat;
      newUser.longitud = this.sucreLatLng.lng;

      this.usuarioService.registrarUsuario(newUser).subscribe(
        (response)=>{
          this.success = true;
          localStorage.setItem('email',this.email?.value);
          this.success = true;
          this.spinner.hide();
        },(err)=>{
          this.success = false;
          if(err.error.message == 'El registro ya existe'){
            this.error='El usuario ya se encuentra registrado. Intente iniciar sessión'
          }else{
            this.error = err.error.message
          }
          this.spinner.hide();
        }
      );
    }else{
      this.form.markAllAsTouched();
    }
  }

  onChange(){
    this.error='';
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {
        this.regUserAuthGoogle();
      }).catch((err)=>{
          console.log(err);
          this.form.markAsUntouched();
          this.error = "No pudimos ingresar con google"
      });

  }

  regUserAuthGoogle(){
    let email:string;
    let idToken:string;
    this.socialAuthService.authState.subscribe(
      (response)=>{
        email = response.email;
        idToken = response.idToken;
        localStorage.setItem('email',email);
        this.usuarioService.registrarUsuario({
          nombres:response.firstName,
          apellidos:response.lastName,
          email:response.email,
          foto:response.photoUrl,
          latitud:this.sucreLatLng.lat,
          longitud:this.sucreLatLng.lng,
          creadoCon:'google'
        }).subscribe(
          (response)=>{
            this.getTokenWithGoogleIdToken(idToken,email);
          },(err)=>{
            this.form.markAsUntouched();
            if(err.error.message == 'El registro ya existe'){
              this.error='El usuario ya se encuentra registrado. Intente iniciar sessión'
            }else{
              this.error = err.error.message
            }
          }
        );
      },(err)=>{
        console.log(err);
        this.form.markAsUntouched();
        this.error = "No pudimos ingresar con google. Intentelo nuevamente."
      }
    );
  }

  getTokenWithGoogleIdToken(idToken:string,email:string){
    this.userService.loginWithGoogle(idToken).subscribe(
      (response)=>{
        localStorage.setItem('token',response.body.token);
        this.userService.setAuthWith('google');
        this.navigateTo(email)
      },err=>{
        console.log(err);
        this.error = 'No se pudo iniciar sessión';
      }
    )
  }

  navigateTo(email:string){
    this.userService.getUsuarioByEmail(email).subscribe(
      response=>{
        let usuario = response.data[0];
        if (
          !usuario.tipo_usuario ||
          !(usuario.nombres && usuario.apellidos)
        ) {
          this.router.navigate(['/welcome', usuario]);
        }else{
          this.router.navigateByUrl('/dashboard');
        }
      }
    )
  }

  get nombreCompleto(){
    return this.form.get('nombreCompleto')
  }

  get email(){
    return this.form.get('email');
  }

  get password(){
    return this.form.get('password');
  }

  get matchPassword(){
    return this.form.get('matchPassword');
  }

  get terms(){
    return this.form.get('terms');
  }

  get tipoUsuario(){
    return this.form.get('tipoUsuario');
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

  openScrollableContent() {
    let longContent = `TERMINOS Y CONDICIONES DE LA PLATAFORMA WEB DORY
    CUALQUIER PERSONA QUE NO ACEPTE ESTOS TÉRMINOS Y CONDICIONES GENERALES,
    LOS CUALES TIENEN UN CARÁCTER OBLIGATORIO Y VINCULANTE, DEBERÁ ABSTENERSE
    DE UTILIZAR EL SITIO Y/O LOS SERVICIOS.
    Es requisito necesario para la adquisición de los servicios suministrados que ofrece este
    sitio Web, que lea, entienda y acepte los siguientes términos y condiciones establecidos
    de privacidad de la Plataforma Web que a continuación se redactan.
    El uso de los servicios prestados por la Plataforma Web Dory, como la información acerca
    del sector piscícola y todo lo relacionado a la misma como los cursos, capacitaciones,
    congresos, entre otros y las normatividades correspondientes al mismo, implicara que
    usted ha leído y aceptado los términos y condiciones de uso en el presente documento.
    Todos los servicios que son ofrecidos por la página web y para poder adquirirlos, será
    necesario realizar un registro por parte del usuario, con ingreso de datos personales
    fidedignos y por ende la definición de una contraseña, dentro del sitio web https://dory-
    web-app-tests.herokuapp.com/
    El usuario puede elegir y cambiar la clave para su acceso de administración de la cuenta
    en cualquier momento, en caso de que se haya registrado y en caso de que sea necesario
    para la compra de algunos de los servicios que son ofertados por la página, como cursos,
    congresos o capacitaciones, no se asume la responsabilidad en caso de que entregue
    dicha clave a terceros, por ende, ccualquier persona que desee acceder o usar el sitio, o
    los servicios que la pagina entrega, podrá hacerlo sujetándose a los términos y
    condiciones generales, junto a las demás políticas y principios que rige la plataforma web
    Dory.
    Es obligatorio completar el formulario de inscripción en todos sus campos con datos
    válidos, debe tener al menos, el municipio, nombre completo, fecha de nacimiento, correo
    electrónico, como un acuerdo de vinculación, para poder utilizar los servicios que brinda la
    Plataforma Dory, el usuario deberá completarlo con su información personal de manera
    exacta, precisa y verdadera (Datos personales) y asumirá el compromiso de actualizar los
    datos personales conforme resulte necesario. La Plataforma Web Dory, podrá utilizar
    diversos medios para identificar a sus usuarios, pero la Plataforma Web Dory, NO se
    responsabilizará por la certeza de los datos personales provistos por sus usuarios. Los
    usuarios garantizan y responden, en cualquier caso, de la veracidad, exactitud, vigencia y
    autenticidad de los datos personales ingresados.`

    this.modalService.open(longContent, { scrollable: true });
  }
}

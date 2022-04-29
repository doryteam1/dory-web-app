import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { faRupiahSign } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PlacesService } from 'src/app/services/places.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-mis-granjas',
  templateUrl: './mis-granjas.component.html',
  styleUrls: ['./mis-granjas.component.scss']
})
export class MisGranjasComponent implements OnInit {
  granjas:Array<any> = [];
  showNotFound:boolean = false;
  form:FormGroup = new FormGroup({
    nombre_granja:new FormControl('',[Validators.required]),
    area:new FormControl(0,[Validators.required]),
    numero_trabajadores:new FormControl(0,[Validators.required]),
    produccion_estimada_mes:new FormControl(0,[Validators.required]),
    direccion:new FormControl(0,[Validators.required]),
    latitud:new FormControl(0,[Validators.required]),
    longitud:new FormControl(0,[Validators.required]),
    descripcion:new FormControl('',[Validators.required]),
    id_departamento:new FormControl(0,[Validators.required]),
    id_municipio:new FormControl(0,[Validators.required]),
    id_vereda:new FormControl(0),
    id_corregimiento:new FormControl(0),
    corregimiento:new FormControl('',[Validators.required]),
    vereda:new FormControl('',[Validators.required]),
    arrayTiposInfraestructuras:new FormControl('[1,2]',[Validators.required]),
    arrayEspecies:new FormControl('[1,2]',[Validators.required]),
  });
  file:any = null;
  productImagePath: string = '';
  itemUpdateIndex:number = -1;
  modalMode:string = 'create';
  municipios:Array<any> = [];
  departamentos:Array<any> = [];
  constructor(private granjaService:GranjasService, private modalService:NgbModal, private storage:FirebaseStorageService, private sanitizer: DomSanitizer, private places:PlacesService) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);

    this.granjaService.getGranjaByUserId(payload.sub).subscribe(
      (respose)=>{
        this.granjas = respose.data;
        if(this.granjas.length < 1){
          this.showNotFound = true;
        }
      },err=>{
        console.log(err)
      }
    )

    this.loadDptos();
  }

  openModal(content:any, action?:string, i?:number){
    if(action == 'update'){
      this.modalMode = action;
      console.log("action update")
      //this.nombreProducto?.setValue(this.productos[i!].nombreProducto);
      this.descripcion?.setValue(this.granjas[i!].descripcion);
      //this.precio?.setValue(this.productos[i!].precio);
      this.productImagePath = this.granjas[i!].imagen;
      this.itemUpdateIndex = i!;
    }
    this.modalService.open(content).result.then(
      (result)=>{
        console.log("se cerro modal ",result)
      } 
    ).catch(
      (err)=>{
        this.file = null;
        this.productImagePath = '';
        console.log(err)
      }
    )
  }

  addGranja(){
    console.log("addGranja")
    if(!this.form.valid){
      console.log("Not valid!")
      return;
    }

    console.log(this.form.value)
    this.granjaService.addGranja(this.form.value).subscribe(
      (response)=>{
        console.log(response)
      },err=>{
        console.log(err)
      }
    )
    
  }

  fileChange(event:any){
    console.log("change",event)
    this.file = event.target.files[0];
    /* let productImagePath:any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]))
    console.log(productImagePath.changingThisBreaksApplicationSecurity) */
    //this.productImagePath = productImagePath.changingThisBreaksApplicationSecurity;
  }

  anularGranja(idGranja:number, i:number){
    this.granjaService.anularGranja(idGranja).subscribe(
      (response:any)=>{
        this.granjas.splice(i,1);
      },err=>{
        console.log(err)
      }
    )
  }

  updateGranja(){
    if(!this.form.valid){
      return;
    }
   
    //this.proveedorService.updateProducto(this.form)
  }

  loadDptos(){
    this.places.getDepartamentos().subscribe(
      (response)=>{
        this.departamentos = response.data;
        this.idDpto?.setValue(70);
        this.idDpto?.disable();
        this.loadMunic();
      },err=>{
        console.log(err);
      }
    );
  }

  loadMunic(){
    this.places.getMunicipiosDepartamentos(this.idDpto?.value).subscribe(
      (response)=>{
        this.municipios = response.data;
      },(err)=>{
        console.log(err);
      }
    );
  }

  changeDpto(){
    this.form.get('id_municipio')?.setValue(0);
    this.places.getMunicipiosDepartamentos(this.idDpto?.value).subscribe(
      (response)=>{
        this.municipios = response.data;
      },(err)=>{
        console.log(err);
      }
    );
  }


  get idDpto(){
    return this.form.get('id_departamento');
  }
        
  get idMunic(){
    return this.form.get('id_municipio');
  }

  get nombreGranjao(){
    return this.form.get('nombreGranja')
  }

  get descripcion(){
    return this.form.get('descripcion')
  }

  get area(){
    return this.form.get('area')
  }
}

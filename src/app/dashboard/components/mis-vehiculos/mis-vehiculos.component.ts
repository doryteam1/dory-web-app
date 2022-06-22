import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-mis-vehiculos',
  templateUrl: './mis-vehiculos.component.html',
  styleUrls: ['./mis-vehiculos.component.scss']
})
export class MisVehiculosComponent implements OnInit {
  vehiculos:Array<any> = [];
  showNotFound:boolean = false;
  p!:number
  form:FormGroup = new FormGroup({
    modelo:new FormControl('',[Validators.required]),
    capacidad:new FormControl('',[Validators.required]),
    transporte_alimento:new FormControl('',[Validators.required]),
    imagen:new FormControl(''),
  });
  file:any = null;
  vehiculoImagePath: string = '';
  previewImage:SafeUrl = '';
  itemUpdateIndex:number = -1;
  modalMode:string = 'create';
  loading:boolean = false;
  showErrorNotImageSelected:boolean = false;
  constructor(private vehiculosService:VehiculosService,
              private modalService:NgbModal,
              private storage:FirebaseStorageService,
              private sanitizer: DomSanitizer,
              private cd:ChangeDetectorRef,
              private appModalService:AppModalService) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    console.log("Vehiculos del usuario ", payload.sub)
    this.vehiculosService.getVehiculosUser(payload.sub).subscribe(
      (respose)=>{
        this.vehiculos = respose.data;
        if(this.vehiculos.length < 1){
          this.showNotFound = true;
        }
      },err=>{
        console.log(err)
      }
    )
  }

  openModal(content:any, action:string, id_vehiculo?:number){
     let i = this.vehiculos.findIndex((vehiculo: any) => {
       return vehiculo.id_vehiculo == id_vehiculo;
     });
     console.log(i)
    this.modalMode = action;
    this.form.reset();
    this.formInit();
    if(action == 'update'){
      this.modelo?.setValue(this.vehiculos[i!].modelo);
      this.capacidad?.setValue(this.vehiculos[i!].capacidad);
      this.transporteAlimento?.setValue(this.vehiculos[i!].transporte_alimento);
      this.vehiculoImagePath = this.vehiculos[i!].imagen;
      this.previewImage = this.vehiculoImagePath;
      this.itemUpdateIndex = i!;
    }
    this.modalService.open(content).result.then(
      (result)=>{
        console.log("se cerro modal ",result)
      }
    ).catch(
      (err)=>{
        this.file = null;
        this.vehiculoImagePath = '';
        console.log(err)
      }
    )
  }

  formInit(){
    this.modelo?.setValue('');
    this.capacidad?.setValue('');
    this.imagen?.setValue('');
    this.transporteAlimento?.setValue('');
    this.vehiculoImagePath = '';
    this.previewImage = '';
    this.itemUpdateIndex = -1;
    this.file = null;
    this.showErrorNotImageSelected = false;
  }

  addVehiculo(){
    console.log("addVehiculo")
    this.loading = true;
    if(!this.form.valid || this.file == null){
      this.form.markAllAsTouched();
      if(this.file == null){
        this.showErrorNotImageSelected = true;
      }
      this.loading = false;
      return;
    }

    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    let fileName = '/vehiculos/'+'vehiculo-'+payload.sub+'-'+new Date().getTime();
    this.storage.cloudStorageTask(fileName,this.file).percentageChanges().subscribe(
      (response)=>{
        console.log(response)
        if(response == 100){
          this.storage.cloudStorageRef(fileName).getDownloadURL().subscribe(
            (downloadUrl)=>{
              console.log(downloadUrl)
              let newVehiculo = {
                modelo : this.modelo?.value,
                capacidad : this.capacidad?.value,
                transporte_alimento : this.transporteAlimento?.value,
                imagen : downloadUrl,
              }
              this.vehiculosService.addVehiculo(newVehiculo).subscribe(
                (response)=>{
                  console.log(response)
                  this.file = null;
                  this.vehiculoImagePath = '';
                  this.modalService.dismissAll()
                  this.loading = false;
                  window.location.reload();
                },err=>{
                  console.log(err)
                  this.loading = false;
                }
              )
            },err=>{
              console.log(err)
              this.loading = false;
            }
          )
        }
      }
    );
  }

  fileChange(event:any){
    console.log("change",event)
    this.file = event.target.files[0];
    let objectURL = URL.createObjectURL(this.file);
    this.previewImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    this.showErrorNotImageSelected = false;
  }

/*   changePreviewImage(imageUrl:any){
    var reader = new FileReader();
    reader.onload = function(){
      var output:any = document.getElementById('output');
      output['src'] = reader.result;
    };
    reader.readAsDataURL(imageUrl);
  } */

  deleteVehiculo(id:number){
      let i = this.vehiculos.findIndex((vehiculo: any) => {
        return vehiculo.id_vehiculo == id;
      });
    this.appModalService.confirm('Eliminar vehiculo','Esta seguro que desea eliminar el vehiculo con id','Eliminar','No estoy seguro',this.vehiculos[i].modelo)
    .then(
      (result)=>{
        if(result == true){
            this.vehiculosService.deleteVehiculo(id).subscribe(
              (response)=>{
                    let index = this.vehiculos.findIndex((vehiculo: any) => {
                      return vehiculo.id_vehiculo == id;
                    });
                    this.vehiculos.splice(index,1);
                    if (this.vehiculos.length <= 0) {
                      this.showNotFound = true;
                    }
              },err=>{
                console.log(err)
              }
            )
          }
        }
    ).catch(
      (result)=>{

      }
    )
  }

  updateVehiculo(){
    this.loading = true;
    if(!this.form.valid){
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }

    if(!this.file){
      let newVehiculo = {
        modelo : this.modelo?.value,
        capacidad : this.capacidad?.value,
        transporte_alimento : this.transporteAlimento?.value,
        imagen : this.vehiculoImagePath
      }
      console.log(newVehiculo)
      this.vehiculosService.updateVehiculo(newVehiculo, this.vehiculos[this.itemUpdateIndex].id_vehiculo).subscribe(
        (response)=>{
          this.vehiculos[this.itemUpdateIndex].modelo = newVehiculo.modelo;
          this.vehiculos[this.itemUpdateIndex].capacidad = newVehiculo.capacidad;
          this.vehiculos[this.itemUpdateIndex].transporte_alimento = newVehiculo.transporte_alimento;
          this.file = null;
          this.vehiculoImagePath = '';
          this.modalService.dismissAll()
          this.loading = false;
        },err=>{
          console.log(err);
          this.loading = false;
        }
      )
    }else{
      this.storage.refFromUrl(this.vehiculoImagePath).put(this.file).percentageChanges().subscribe(
        (response)=>{
          console.log(response)
          if(response == 100){
            this.storage.refFromUrl(this.vehiculoImagePath).getDownloadURL().subscribe(
              (downloadUrl) => {
                this.vehiculos[this.itemUpdateIndex].imagen = downloadUrl;
                let newVehiculo = {
                  modelo : this.modelo?.value,
                  capacidad : this.capacidad?.value,
                  transporte_alimento : this.transporteAlimento?.value,
                  imagen : downloadUrl,
                }
                this.vehiculosService.updateVehiculo(newVehiculo, this.vehiculos[this.itemUpdateIndex].id_vehiculo).subscribe(
                  (response)=>{
                    console.log(response)
                    this.vehiculos[this.itemUpdateIndex].modelo = newVehiculo.modelo;
                    this.vehiculos[this.itemUpdateIndex].capacidad = newVehiculo.capacidad;
                    this.vehiculos[this.itemUpdateIndex].transporte_alimento = newVehiculo.transporte_alimento;
                    this.file = null;
                    this.vehiculoImagePath = '';
                    this.modalService.dismissAll()
                    this.loading = false;
                  },err=>{
                    console.log(err);
                    this.loading = false;
                  }
                )
              },err=>{
                console.log(err);
                this.loading = false;
              }
            )
          }
        },err=>{
          console.log(err);
          this.loading = false;
        }
      )
    }
  }

  invalid(controlFormName:string){;
    return this.form.get(controlFormName)?.invalid && (this.form.get(controlFormName)?.dirty || this.form.get(controlFormName)?.touched)
  }


  get modelo(){
    return this.form.get('modelo')
  }

  get capacidad(){
    return this.form.get('capacidad')
  }

  get transporteAlimento(){
    return this.form.get('transporte_alimento')
  }

  get precio(){
    return this.form.get('imagen')
  }

  get imagen(){
    return this.form.get('imagen')
  }

}

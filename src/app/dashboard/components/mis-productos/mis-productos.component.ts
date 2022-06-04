import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { faRupiahSign } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-mis-productos',
  templateUrl: './mis-productos.component.html',
  styleUrls: ['./mis-productos.component.scss']
})
export class MisProductosComponent implements OnInit {
  productos:Array<any> = [];
  showNotFound:boolean = false;
  form:FormGroup = new FormGroup({
    nombreProducto:new FormControl('',[Validators.required]),
    descripcion:new FormControl('',[Validators.required]),
    imagen:new FormControl(''),
    precio:new FormControl(0,[Validators.required]),
  });
  file:any = null;
  productImagePath: string = '';
  previewImage:SafeUrl = '';
  itemUpdateIndex:number = -1;
  modalMode:string = 'create';
  loading:boolean = false;
  showErrorNotImageSelected:boolean = false;
  constructor(private proveedorService:ProveedorService, private modalService:NgbModal, private storage:FirebaseStorageService, private sanitizer: DomSanitizer, private cd:ChangeDetectorRef, private appModalService:AppModalService) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let payload = Utilities.parseJwt(token!);
    console.log("Productos del usuario ", payload.sub)
    this.proveedorService.getProductosById(payload.sub).subscribe(
      (respose)=>{
        this.productos = respose.data;
        if(this.productos.length < 1){
          this.showNotFound = true;
        }
      },err=>{
        console.log(err)
      }
    )
  }

  openModal(content:any, action:string, i?:number){
    this.modalMode = action;
    this.form.reset();
    this.formInit();
    if(action == 'update'){
      console.log("action update")
      this.nombreProducto?.setValue(this.productos[i!].nombreProducto);
      this.descripcion?.setValue(this.productos[i!].descripcion);
      this.precio?.setValue(this.productos[i!].precio);
      this.productImagePath = this.productos[i!].imagen;
      this.previewImage = this.productImagePath;
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

  formInit(){
    this.nombreProducto?.setValue('');
    this.descripcion?.setValue('');
    this.imagen?.setValue('');
    this.precio?.setValue(0);
    this.productImagePath = '';
    this.previewImage = '';
    this.itemUpdateIndex = -1;
    this.file = null;
    this.showErrorNotImageSelected = false;
  }

  addProducto(){
    console.log("addProducto")
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
    let fileName = '/productos/'+'prod-'+payload.sub+'-'+new Date().getTime();
    this.storage.cloudStorageTask(fileName,this.file).percentageChanges().subscribe(
      (response)=>{
        console.log(response)
        if(response == 100){
          this.storage.cloudStorageRef(fileName).getDownloadURL().subscribe(
            (downloadUrl)=>{
              console.log(downloadUrl)
              let newProducto = {
                nombreProducto : this.nombreProducto?.value,
                descripcion : this.descripcion?.value,
                precio : this.precio?.value,
                imagen : downloadUrl,
              }
              this.proveedorService.addProducto(newProducto).subscribe(
                (response)=>{
                  console.log(response)
                  this.productos.push(newProducto);
                  this.file = null;
                  this.productImagePath = '';
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

  deleteProducto(codigo:number, i:number){
    this.appModalService.confirm('Eliminar producto','Esta seguro que desea eliminar el producto','Cancelar','No estoy seguro',this.productos[i].nombreProducto)
    .then(
      (result)=>{
        if(result == true){
          this.proveedorService.deleteProducto(codigo).subscribe(
            (response)=>{
              this.productos.splice(i,1);
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

  updateProducto(){
    this.loading = true;
    if(!this.form.valid){
      this.loading = false;
      this.form.markAllAsTouched();
      return;
    }

    if(!this.file){
      let newProducto = {
        nombreProducto : this.nombreProducto?.value,
        descripcion : this.descripcion?.value,
        precio : this.precio?.value,
        imagen : this.productImagePath
      }
      this.proveedorService.updateProducto(newProducto, this.productos[this.itemUpdateIndex].codigo).subscribe(
        (response)=>{
          console.log(response)
          this.productos[this.itemUpdateIndex].nombreProducto = newProducto.nombreProducto;
          this.productos[this.itemUpdateIndex].descripcion = newProducto.descripcion;
          this.productos[this.itemUpdateIndex].precio = newProducto.precio;
          this.file = null;
          this.productImagePath = '';
          this.modalService.dismissAll()
          this.loading = false;
        },err=>{
          console.log(err);
          this.loading = false;
        }
      )
    }else{
      this.storage.refFromUrl(this.productImagePath).put(this.file).percentageChanges().subscribe(
        (response)=>{
          console.log(response)
          if(response == 100){
            this.storage.refFromUrl(this.productImagePath).getDownloadURL().subscribe(
              (downloadUrl) => {
                this.productos[this.itemUpdateIndex].imagen = downloadUrl;
                let newProducto = {
                  nombreProducto : this.nombreProducto?.value,
                  descripcion : this.descripcion?.value,
                  precio : this.precio?.value,
                  imagen : downloadUrl,
                }
                this.proveedorService.updateProducto(newProducto, this.productos[this.itemUpdateIndex].codigo).subscribe(
                  (response)=>{
                    console.log(response)
                    this.productos[this.itemUpdateIndex].nombreProducto = newProducto.nombreProducto;
                    this.productos[this.itemUpdateIndex].descripcion = newProducto.descripcion;
                    this.productos[this.itemUpdateIndex].precio = newProducto.precio;
                    this.file = null;
                    this.productImagePath = '';
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

  get nombreProducto(){
    return this.form.get('nombreProducto')
  }

  get descripcion(){
    return this.form.get('descripcion')
  }

  get imagen(){
    return this.form.get('imagen')
  }

  get precio(){
    return this.form.get('precio')
  }
}

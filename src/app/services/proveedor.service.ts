import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(private httpsService:HttpsService) { }

  getProductosById(userId:number){
    return this.httpsService.get(environment.doryApiRestBaseUrl+'/proveedores/productos/userId/'+userId)
  }

  addProducto(producto:any){
    return this.httpsService.post(environment.doryApiRestBaseUrl+'/proveedores/producto',producto)
  }

  deleteProducto(id:number){
    return this.httpsService.delete(environment.doryApiRestBaseUrl+'/proveedores/producto/'+id)
  }

  updateProducto(producto:any,id:number){
    return this.httpsService.put(environment.doryApiRestBaseUrl+'/proveedores/producto/'+id,producto)
  }

  getProductosAll(){
    return this.httpsService.get(environment.doryApiRestBaseUrl+'/proveedores/producto/todos')
  }

  getProveedoresAll(){
    return this.httpsService.get(environment.doryApiRestBaseUrl+'/usuario/proveedores/todos')
  }

}

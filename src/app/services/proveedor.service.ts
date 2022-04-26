import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(private httpsService:HttpsService) { }

  getProductosById(userId:number){
    return this.httpsService.get('https://dory-api-rest.herokuapp.com/api/proveedores/productos/userId/'+userId)
  }

  addProducto(producto:any){
    return this.httpsService.post('https://dory-api-rest.herokuapp.com/api/proveedores/producto',producto)
  }
}

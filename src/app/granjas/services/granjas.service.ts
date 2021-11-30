import { Injectable } from '@angular/core';
import { HttpsService } from 'src/app/services/https.service';

@Injectable({
  providedIn: 'root'
})
export class GranjasService {

  constructor(private https:HttpsService) {

  }

  getGranjas(){
    this.https.get("https://dory-api-rest.herokuapp.com/granjas").subscribe(
      (response)=>{
        console.log(response);
      }
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private https:HttpsService) { }

  contactenosSendMail(formData:any){
    return this.https.post('https://dory-api-rest.herokuapp.com/api/contactenos',formData);
  }
}

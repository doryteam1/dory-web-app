import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private https:HttpsService) { }

  contactenosSendMail(formData:any){
    return this.https.post(environment.doryApiRestBaseUrl+'/contactenos',formData);
  }
}

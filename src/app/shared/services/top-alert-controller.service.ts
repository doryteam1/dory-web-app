import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertMessage } from 'src/models/alert-message.model';


@Injectable({
  providedIn: 'root'
})

export class TopAlertControllerService {
  subjectMessage = new Subject<AlertMessage>();
  
  constructor() { 
  }

  getListener(){
    return this.subjectMessage.asObservable();
  }

  showAlertAutoDissmis(message:string,milliseconds:number){
    this.subjectMessage.next({message:message,milliseconds:milliseconds});
  }
}

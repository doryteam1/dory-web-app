import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  constructor(private storage:AngularFireStorage) { }

    public cloudStorageTask(fileName: string, data: any) {
      return this.storage.upload(fileName, data);
    }
  
    public cloudStorageRef(fileName: string) {
      return this.storage.ref(fileName);
    }

    public refFromUrl(path:string){
      return this.storage.refFromURL(path);
    }
}

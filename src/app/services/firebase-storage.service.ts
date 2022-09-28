import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  deleteDoc,
  updateDoc,
  DocumentReference,
  setDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  constructor(private storage: AngularFireStorage) {}

  public cloudStorageTask(fileName: string, data: any) {
    return this.storage.upload(fileName, data);
  }

  public cloudStorageRef(fileName: string) {
    return this.storage.ref(fileName);
  }
  public deletephotoPerfil(fileName: string) {
    return this.storage.ref(fileName).delete();
  }

  public deleteByFileName(fileName: string) {
    return this.storage.ref(fileName).delete();
  }

  public deleteByUrl(url:string){
    return this.storage.refFromURL(url).delete();
  }

  public refFromUrl(path: string) {
    return this.storage.refFromURL(path);
  }
}

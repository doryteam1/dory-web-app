import { Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';
@Injectable({
  providedIn: 'root',
})
export class CompressImageSizeService {
  compressedFileFinal: any[] = [];
  async handleImageUpload(imageFile: any): Promise<any> {
/*     console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`); */
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      return compressedFile;
    } catch (error) {
      console.log(error);
    }
  }
  async handleImageArrayUpload(imageFile: any[]): Promise<any> {
    console.log(imageFile);
    this.compressedFileFinal = [];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      for (let index = 0; index < imageFile.length; index++) {
   /*      console.log(
          'originalFile instanceof Blob',
          imageFile[index] instanceof Blob
        ); // true
        console.log(
          `originalFile size ${imageFile[index].size / 1024 / 1024} MB`
        ); */
        const compressedFile = await imageCompression(
          imageFile[index],
          options
        );
/*         console.log(
          'compressedFile instanceof Blob',
          compressedFile instanceof Blob
        ); // true
        console.log(
          `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        ); // smaller than maxSizeMB
        console.log(compressedFile); */
        console.log(compressedFile);
        this.compressedFileFinal.push(compressedFile);
      }
      return this.compressedFileFinal;
    } catch (error) {
      console.log(error);
    }
  }
}

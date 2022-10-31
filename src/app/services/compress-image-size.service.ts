import { Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';
@Injectable({
  providedIn: 'root',
})
export class CompressImageSizeService {
  compressedFileFinal: any[] = [];
  async handleImageUpload(imageFile: any): Promise<any> {
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
    this.compressedFileFinal = [];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      for (let index = 0; index < imageFile.length; index++) {
        const compressedFile = await imageCompression(
          imageFile[index],
          options
        );
        this.compressedFileFinal.push(compressedFile);
      }
      return this.compressedFileFinal;
    } catch (error) {
      console.log(error);
    }
  }
}

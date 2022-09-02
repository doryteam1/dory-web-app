import { Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';
@Injectable({
  providedIn: 'root',
})
export class CompressImageSizeService {
async handleImageUpload(imageFile:any, options:any):Promise<any> {
  console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    console.log(compressedFile)
    /* await uploadToServer(compressedFile); // write your own logic */
    return compressedFile;
  } catch (error) {
    console.log(error);
  }

}
}

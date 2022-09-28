import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
var FileSaver = require('file-saver');
var axios = require('axios');
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  compressFileToZip(urls: {data:string,url:string,image:string}[]){
    console.log("urls ",urls)
    const zip = new JSZip();
    const img = zip.folder("documentos");
    for(let i=0; i<urls.length; i++){
      img!.file(urls[i].data,urls[i].image, {base64: true});
    }

    zip.generateAsync({type:"blob"}).then(function(content) {
      // see FileSaver.js
      FileSaver.saveAs(content, "example.zip");
    });
  }

  toDataURL = (url:string) => fetch(url, {mode: "no-cors"})
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      console.log("image; ",reader.result)
      resolve(reader.result)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

  async urlToBase64(url:string){
    let image = await axios.get(url, {responseType: 'arraybuffer'});
    let raw = Buffer.from(image.data).toString('base64');
    return raw;
  }

  public getBase64ImageCanvas(imgUrl:string):Promise<any> {
    let result:Promise<any>;
    var img = new Image();

    // onload fires when the image is fully loadded, and has width and height

    result = new Promise((resolve, reject) => {
      img.onload = function(){
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png"),
        dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        resolve(dataURL);
      };
    });
    

    // set attributes and src 
    img.setAttribute('crossOrigin', 'anonymous'); //
    img.src = imgUrl;

    return result;
}
}

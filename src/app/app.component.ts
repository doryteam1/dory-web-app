import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web-app-dory';
  isRegistering:boolean = false;

 
  exit(event:any){
    console.log("exit app");
    this.isRegistering = false;
  }
}

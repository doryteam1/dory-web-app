import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registro-google',
  templateUrl: './registro-google.component.html',
  styleUrls: ['./registro-google.component.scss']
})
export class RegistroGoogleComponent implements OnInit, AfterViewInit {
  baseUrl:string = environment.ginelectURL;
  constructor(private elRef:ElementRef) { 
  }
  
  ngAfterViewInit(): void {
    this.elRef.nativeElement.scrollIntoView();
  }

  ngOnInit(): void {
  }

}

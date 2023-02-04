import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit, AfterViewInit {
  baseUrl:string = environment.ginelectURL;
  thisWebUrl:string = environment.thisWebUrl; 
  constructor(private elRef:ElementRef) {     
  }

  ngAfterViewInit(): void {
    this.elRef.nativeElement.scrollIntoView();
  }
  
  ngOnInit(): void {
  }

}



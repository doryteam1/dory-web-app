import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.scss']
})
export class IngresarComponent implements OnInit, AfterViewInit {
  baseUrl:string = environment.ginelectURL;
  constructor(private elRef:ElementRef) { 
  }
  
  ngAfterViewInit(): void {
    this.elRef.nativeElement.scrollIntoView();
  }

  ngOnInit(): void {
  }

}

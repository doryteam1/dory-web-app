import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interfaz-comerciante',
  templateUrl: './interfaz-comerciante.component.html',
  styleUrls: ['./interfaz-comerciante.component.scss']
})
export class InterfazComercianteComponent implements OnInit, AfterViewInit {
  baseUrl:string = environment.ginelectURL;
  constructor(private elRef:ElementRef) { 
  }
  
  ngAfterViewInit(): void {
    console.log("ngAfterViewInit!")
    this.elRef.nativeElement.scrollIntoView();
  }

  ngOnInit(): void {
  }



}

import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-punto-inicio',
  templateUrl: './punto-inicio.component.html',
  styleUrls: ['./punto-inicio.component.scss']
})
export class PuntoInicioComponent implements OnInit, AfterViewInit {
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

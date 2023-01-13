import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interfaz-consumidor',
  templateUrl: './interfaz-consumidor.component.html',
  styleUrls: ['./interfaz-consumidor.component.scss']
})
export class InterfazConsumidorComponent implements OnInit, AfterViewInit {
  baseUrl:string = environment.ginelectURL;
  constructor(private elRef:ElementRef) { 
  }
  
  ngAfterViewInit(): void {
    this.elRef.nativeElement.scrollTop = 0;
  }

  ngOnInit(): void {
  }

}

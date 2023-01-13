import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interfaz-investigador',
  templateUrl: './interfaz-investigador.component.html',
  styleUrls: ['./interfaz-investigador.component.scss']
})
export class InterfazInvestigadorComponent implements OnInit, AfterViewInit {
  baseUrl:string = environment.ginelectURL;
  constructor(private elRef:ElementRef) { 
  }
  
  ngAfterViewInit(): void {
    this.elRef.nativeElement.scrollIntoView();
  }
  ngOnInit(): void {
  }

}

import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cuerpo-pagina',
  templateUrl: './cuerpo-pagina.component.html',
  styleUrls: ['./cuerpo-pagina.component.scss']
})
export class CuerpoPaginaComponent implements OnInit,AfterViewInit {
  baseUrl:string = environment.ginelectURL;
  constructor(private elRef:ElementRef) { 
  }
  
  ngAfterViewInit(): void {
    this.elRef.nativeElement.scrollIntoView();
  }

  ngOnInit(): void {
  }

}

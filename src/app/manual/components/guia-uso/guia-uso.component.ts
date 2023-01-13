import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-guia-uso',
  templateUrl: './guia-uso.component.html',
  styleUrls: ['./guia-uso.component.scss']
})
export class GuiaUsoComponent implements OnInit, AfterViewInit {
  baseUrl:string = environment.ginelectURL;
  constructor(private elRef:ElementRef) { 
  }
  
  ngAfterViewInit(): void {
    this.elRef.nativeElement.scrollIntoView();
  }

  ngOnInit(): void {
  }

}

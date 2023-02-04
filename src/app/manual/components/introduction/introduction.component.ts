import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit, AfterViewInit {
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






